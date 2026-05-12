/**
 * Mobile performance + CWV QA — Agent D (perf lane).
 *
 * Captures network, CWV, CSP runtime violations, image accounting, and
 * compares iPhone 14 Pro vs a slower Android (Galaxy S9+) using CDP.
 *
 * NOTE: dev server is `next dev` (not prod). Numbers are 3-10x worse than
 * production. Use for relative comparison and asset-size catches.
 */

import { test, expect, chromium, devices, type BrowserContext, type Page } from '@playwright/test'
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { BASE_URL } from './helpers'

const SCREEN_DIR = path.join(__dirname, 'screenshots', 'perf')

// Fast 3G / mid 4G profile.
const NETWORK = {
  offline: false,
  latency: 150,
  downloadThroughput: (1.6 * 1024 * 1024) / 8, // bytes/s
  uploadThroughput: (750 * 1024) / 8,
}

type ReqRow = {
  url: string
  method: string
  status: number
  type: string
  startedAt: number
  endedAt: number
  durationMs: number
  encodedBytes: number
  fromCache: boolean
}

async function runProfile(opts: {
  label: string
  device: keyof typeof devices | string
  cpuRate: number
  page: 'home' | 'booking'
  outFileSuffix: string
}) {
  const browser = await chromium.launch()
  const deviceDesc = devices[opts.device as keyof typeof devices] ?? devices['iPhone 14 Pro']
  const context: BrowserContext = await browser.newContext({
    ...deviceDesc,
    bypassCSP: false,
  })
  const page: Page = await context.newPage()

  const cdp = await context.newCDPSession(page)
  await cdp.send('Network.enable')
  await cdp.send('Performance.enable')
  await cdp.send('Network.clearBrowserCache')
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
  await cdp.send('Network.emulateNetworkConditions', NETWORK)
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: opts.cpuRate })

  // Track requests via CDP.
  const reqs = new Map<string, Partial<ReqRow>>()
  cdp.on('Network.requestWillBeSent', (e) => {
    reqs.set(e.requestId, {
      url: e.request.url,
      method: e.request.method,
      type: e.type ?? 'Other',
      startedAt: e.timestamp,
    })
  })
  cdp.on('Network.responseReceived', (e) => {
    const r = reqs.get(e.requestId) ?? {}
    r.status = e.response.status
    r.fromCache = e.response.fromDiskCache || e.response.fromPrefetchCache
    if (!r.type) r.type = e.response.mimeType
    reqs.set(e.requestId, r)
  })
  cdp.on('Network.loadingFinished', (e) => {
    const r = reqs.get(e.requestId) ?? {}
    r.endedAt = e.timestamp
    r.encodedBytes = e.encodedDataLength
    r.durationMs = (e.timestamp - (r.startedAt ?? e.timestamp)) * 1000
    reqs.set(e.requestId, r)
  })

  const consoleLogs: { type: string; text: string }[] = []
  const pageErrors: string[] = []
  page.on('console', (m) => consoleLogs.push({ type: m.type(), text: m.text() }))
  page.on('pageerror', (e) => pageErrors.push(String(e?.message ?? e)))

  const targetUrl = opts.page === 'home' ? `${BASE_URL}/` : `${BASE_URL}/booking`

  // Inject CWV observers before nav so they catch the first paints.
  await page.addInitScript(() => {
    ;(window as any).__cwv = { lcp: 0, lcpEl: null as any, cls: 0, layoutShifts: [] as any[] }
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          ;(window as any).__cwv.lcp = entry.startTime
          ;(window as any).__cwv.lcpEl = entry.element
            ? {
                tag: entry.element.tagName,
                id: entry.element.id,
                cls: entry.element.className,
                src: entry.element.currentSrc || entry.element.src || null,
                rect: entry.element.getBoundingClientRect ? JSON.parse(JSON.stringify(entry.element.getBoundingClientRect())) : null,
              }
            : null
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true })
    } catch {}
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            ;(window as any).__cwv.cls += entry.value
            ;(window as any).__cwv.layoutShifts.push({ value: entry.value, t: entry.startTime })
          }
        }
      }).observe({ type: 'layout-shift', buffered: true })
    } catch {}
  })

  const navStart = Date.now()
  await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 60_000 }).catch(() => {})
  const navMs = Date.now() - navStart

  // Scroll to surface lazy layout shifts.
  await page.evaluate(async () => {
    await new Promise<void>((res) => {
      let y = 0
      const step = () => {
        window.scrollTo(0, y)
        y += 300
        if (y < document.body.scrollHeight) setTimeout(step, 80)
        else setTimeout(res, 500)
      }
      step()
    })
  }).catch(() => {})

  // Wait a beat so CLS observer accumulates.
  await page.waitForTimeout(2000)

  const cwv = await page.evaluate(() => (window as any).__cwv)
  const perfMetrics = await cdp.send('Performance.getMetrics').catch(() => ({ metrics: [] as any[] }))

  // Click "Cotizar" / sticky CTA to approximate INP, if present.
  let inpMs: number | null = null
  try {
    const tStart = Date.now()
    const btn = page.locator('a:has-text("Cotizar"), button:has-text("Cotizar"), a:has-text("WhatsApp"), button:has-text("Llamar")').first()
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click({ trial: true }).catch(() => {})
      // Real click — but trap navigation to keep page alive.
      const clickPromise = btn.click({ noWaitAfter: true }).catch(() => {})
      await Promise.race([clickPromise, page.waitForTimeout(500)])
      inpMs = Date.now() - tStart
    }
  } catch {}

  // LCP element screenshot annotation.
  try {
    await page.screenshot({
      path: path.join(SCREEN_DIR, `lcp-element-${opts.outFileSuffix}.png`),
      fullPage: false,
    })
  } catch {}

  const allReqs: ReqRow[] = Array.from(reqs.values()).filter((r) => r.url) as ReqRow[]
  const totalEncoded = allReqs.reduce((s, r) => s + (r.encodedBytes || 0), 0)
  const largest = [...allReqs].sort((a, b) => (b.encodedBytes || 0) - (a.encodedBytes || 0)).slice(0, 5)
  const slowest = [...allReqs].sort((a, b) => (b.durationMs || 0) - (a.durationMs || 0)).slice(0, 5)
  const errors = allReqs.filter((r) => r.status >= 400)

  // Look for posthog + elevenlabs.
  const posthogLoaded = await page.evaluate(() => Boolean((window as any).posthog && (window as any).posthog.__loaded))
  const elevenlabsScript = await page.locator('script[src*="elevenlabs.io"]').count()
  const elevenlabsWidget = await page.locator('elevenlabs-convai').count()

  // Image accounting.
  const images = await page.evaluate(() =>
    Array.from(document.images).map((img) => ({
      src: img.currentSrc || img.src,
      natW: img.naturalWidth,
      natH: img.naturalHeight,
      renderW: img.width,
      renderH: img.height,
    })),
  )

  // Script count.
  const scriptCount = await page.locator('script').count()
  const jsBytes = allReqs.filter((r) => /javascript|ecmascript|\.js(\?|$)/i.test(r.type || '') || r.url.endsWith('.js')).reduce((s, r) => s + (r.encodedBytes || 0), 0)

  // CSP violations come through as console errors mentioning CSP.
  const cspViolations = consoleLogs.filter((l) => /Content Security Policy|Refused to/i.test(l.text))

  const report = {
    label: opts.label,
    device: opts.device,
    cpuRate: opts.cpuRate,
    page: opts.page,
    navMs,
    cwv,
    inpMsApprox: inpMs,
    perfMetrics: perfMetrics.metrics,
    totals: {
      transferBytes: totalEncoded,
      requestCount: allReqs.length,
      jsTransferBytes: jsBytes,
      scriptTags: scriptCount,
    },
    largest: largest.map((r) => ({ url: r.url, type: r.type, kb: Math.round((r.encodedBytes || 0) / 1024) })),
    slowest: slowest.map((r) => ({ url: r.url, type: r.type, ms: Math.round(r.durationMs || 0) })),
    httpErrors: errors.map((r) => ({ url: r.url, status: r.status })),
    cspViolations: cspViolations.map((l) => l.text),
    consoleErrors: consoleLogs.filter((l) => l.type === 'error').map((l) => l.text),
    pageErrors,
    posthogLoaded,
    elevenlabsScriptCount: elevenlabsScript,
    elevenlabsWidgetCount: elevenlabsWidget,
    images,
  }

  writeFileSync(path.join(SCREEN_DIR, `report-${opts.outFileSuffix}.json`), JSON.stringify(report, null, 2))

  await context.close()
  await browser.close()
  return report
}

test('perf · iPhone 14 Pro · home', async () => {
  const r = await runProfile({
    label: 'iPhone 14 Pro home',
    device: 'iPhone 14 Pro',
    cpuRate: 4,
    page: 'home',
    outFileSuffix: 'iphone14pro-home',
  })
  expect(r.totals.requestCount).toBeGreaterThan(0)
})

test('perf · Galaxy S9+ · home', async () => {
  const r = await runProfile({
    label: 'Galaxy S9+ home',
    device: 'Galaxy S9+',
    cpuRate: 4,
    page: 'home',
    outFileSuffix: 'galaxys9-home',
  })
  expect(r.totals.requestCount).toBeGreaterThan(0)
})

test('perf · iPhone 14 Pro · booking (ElevenLabs check)', async () => {
  const r = await runProfile({
    label: 'iPhone 14 Pro booking',
    device: 'iPhone 14 Pro',
    cpuRate: 4,
    page: 'booking',
    outFileSuffix: 'iphone14pro-booking',
  })
  expect(r.totals.requestCount).toBeGreaterThan(0)
})
