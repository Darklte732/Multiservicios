/**
 * Android Chrome mobile QA — visual + interaction sanity for the home page
 * and the booking entrypoint. Sister agents handle iOS / forms / Lighthouse —
 * this file stays in its lane.
 */

import { test, expect, chromium, devices, type Browser } from '@playwright/test'
import { BASE_URL, ANDROID_DEVICES, type Finding, fmtFinding } from './helpers'
import * as fs from 'fs'
import * as path from 'path'

const SCREENSHOT_ROOT = path.join(__dirname, 'screenshots', 'android')
const FINDINGS_PATH = path.join(__dirname, 'android-findings.json')

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true })
}

function pushFinding(f: Finding) {
  let existing: Finding[] = []
  if (fs.existsSync(FINDINGS_PATH)) {
    try { existing = JSON.parse(fs.readFileSync(FINDINGS_PATH, 'utf8')) } catch {}
  }
  existing.push(f)
  fs.writeFileSync(FINDINGS_PATH, JSON.stringify(existing, null, 2))
}

// reset findings file at start of suite
test.beforeAll(() => {
  ensureDir(SCREENSHOT_ROOT)
  fs.writeFileSync(FINDINGS_PATH, '[]')
})

for (const [deviceName, deviceConfig] of Object.entries(ANDROID_DEVICES)) {
  test.describe(`Android · ${deviceName}`, () => {
    const safeName = deviceName.replace(/[^a-z0-9]+/gi, '_')
    const shotDir = path.join(SCREENSHOT_ROOT, safeName)

    let browser: Browser
    test.beforeAll(async () => {
      ensureDir(shotDir)
      browser = await chromium.launch()
    })
    test.afterAll(async () => { await browser?.close() })

    test('home page renders + interactions work', async () => {
      const context = await browser.newContext({ ...deviceConfig })
      const page = await context.newPage()

      const consoleErrors: string[] = []
      page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()) })
      page.on('pageerror', e => consoleErrors.push(`pageerror: ${e.message}`))

      await page.goto(BASE_URL, { waitUntil: 'networkidle' })
      // give Google Fonts a beat to apply
      await page.waitForTimeout(800)

      // ── 1) full-page screenshot
      const homeShot = path.join(shotDir, '01_home_fullpage.png')
      await page.screenshot({ path: homeShot, fullPage: true })

      // ── 2) viewport-only (above the fold)
      const heroShot = path.join(shotDir, '02_hero_viewport.png')
      await page.screenshot({ path: heroShot, fullPage: false })

      // ── 3) hero / nav must exist & be visible
      const h1 = page.locator('h1').first()
      await expect(h1).toBeVisible()
      const h1Text = (await h1.textContent())?.trim() ?? ''
      if (!/electricistas/i.test(h1Text)) {
        pushFinding({
          severity: 'HIGH',
          device: deviceName,
          area: 'hero',
          description: `Hero h1 missing expected "Electricistas" text — got "${h1Text}"`,
          evidence: heroShot,
        })
      }

      const header = page.locator('header').first()
      await expect(header).toBeVisible()

      // ── 4) horizontal overflow check
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.body.scrollWidth,
        innerWidth: window.innerWidth,
        documentScrollWidth: document.documentElement.scrollWidth,
      }))
      const hasOverflow = overflow.scrollWidth > overflow.innerWidth + 1
      if (hasOverflow) {
        pushFinding({
          severity: 'HIGH',
          device: deviceName,
          area: 'layout',
          description: `Horizontal overflow detected: body.scrollWidth=${overflow.scrollWidth}px, window.innerWidth=${overflow.innerWidth}px (delta ${overflow.scrollWidth - overflow.innerWidth}px)`,
          evidence: homeShot,
        })
      }

      // ── 5) logo loaded & no broken-image artefacts
      const logoSrcImgs = await page.locator('img').evaluateAll(imgs =>
        imgs.map((i: any) => ({
          src: i.currentSrc || i.src,
          natural: i.naturalWidth,
          complete: i.complete,
          alt: i.alt || '',
        }))
      )
      const navLogo = logoSrcImgs.find(i => /logo-multiservicios/i.test(i.src))
      if (navLogo) {
        if (!navLogo.complete || navLogo.natural === 0) {
          pushFinding({
            severity: 'CRITICAL',
            device: deviceName,
            area: 'logo',
            description: `Transparent logo PNG failed to load (complete=${navLogo.complete} natural=${navLogo.natural})`,
          })
        }
      } else {
        pushFinding({
          severity: 'INFO',
          device: deviceName,
          area: 'logo',
          description: `No <img> with src /logo-multiservicios/ found in DOM — site is currently using CSS-generated LogoMark (gradient tile + SVG lightning bolt) instead of the transparent PNG. Confirm intentional.`,
        })
      }

      // ── 6) zoomed nav screenshot to inspect logo edges visually
      const navShot = path.join(shotDir, '03_nav_zoom.png')
      try {
        await header.screenshot({ path: navShot })
      } catch {}

      // ── 7) primary CTA — booking link. Mobile menu CTA "Reservar Ahora"
      // open mobile menu (lg:hidden hamburger)
      const menuBtn = page.locator('header button.lg\\:hidden').first()
      if (await menuBtn.isVisible()) {
        await menuBtn.tap()
        await page.waitForTimeout(400)
        const menuShot = path.join(shotDir, '04_mobile_menu_open.png')
        await page.screenshot({ path: menuShot })

        const reservar = page.getByRole('link', { name: /Reservar Ahora/i })
        if (await reservar.count() > 0) {
          // Use waitForURL race against the tap rather than waitForLoadState which can
          // resolve before client-side nav completes.
          const navPromise = page.waitForURL(/\/booking/, { timeout: 5000 }).catch(() => null)
          await reservar.first().tap()
          await navPromise
          if (!page.url().includes('/booking')) {
            pushFinding({
              severity: 'CRITICAL',
              device: deviceName,
              area: 'booking-cta',
              description: `Reservar Ahora CTA in mobile menu did not navigate to /booking — current url ${page.url()}`,
            })
          } else {
            await page.waitForTimeout(600)
            await page.screenshot({ path: path.join(shotDir, '05_booking_page.png'), fullPage: false })
            // press back
            await page.goBack({ waitUntil: 'domcontentloaded' })
            await page.waitForTimeout(400)
            if (!/\/$|^https?:\/\/[^/]+\/?$/.test(new URL(page.url()).pathname + page.url())) {
              // very loose — just check we're not still on /booking
              if (page.url().includes('/booking')) {
                pushFinding({
                  severity: 'HIGH',
                  device: deviceName,
                  area: 'navigation',
                  description: `Browser back from /booking did not return to home`,
                })
              }
            }
            await page.screenshot({ path: path.join(shotDir, '06_back_to_home.png'), fullPage: false })
          }
        } else {
          pushFinding({
            severity: 'HIGH',
            device: deviceName,
            area: 'booking-cta',
            description: `No "Reservar Ahora" link found in opened mobile menu`,
            evidence: menuShot,
          })
        }
      } else {
        pushFinding({
          severity: 'HIGH',
          device: deviceName,
          area: 'nav',
          description: `Mobile hamburger button not visible at viewport ${deviceConfig.viewport?.width}px`,
        })
      }

      // ── 8) sticky thumb bar — must target ONLY the fixed-position thumb bar.
      // Several WhatsApp/Llamar links exist on the page (guarantee band, final CTA,
      // floating button, sticky bar). Filter to the fixed one by checking
      // position:fixed on the parent container.
      const fixedContainer = page.locator('div[style*="position: fixed"], div[style*="position:fixed"]').filter({ hasText: /WHATSAPP/i }).first()
      await expect(fixedContainer).toBeVisible()
      const stickyWa = fixedContainer.getByRole('link', { name: /WHATSAPP/i }).first()
      const stickyCall = fixedContainer.getByRole('link', { name: /LLAMAR/i }).first()
      await expect(stickyWa).toBeVisible()
      await expect(stickyCall).toBeVisible()

      const waHref = await stickyWa.getAttribute('href') || ''
      const callHref = await stickyCall.getAttribute('href') || ''
      if (!/wa\.me\/\d+/.test(waHref)) {
        pushFinding({
          severity: 'CRITICAL',
          device: deviceName,
          area: 'sticky-bar',
          description: `Sticky WhatsApp href doesn't look like wa.me link — "${waHref}"`,
        })
      }
      if (!callHref.startsWith('tel:')) {
        pushFinding({
          severity: 'CRITICAL',
          device: deviceName,
          area: 'sticky-bar',
          description: `Sticky Llamar href is not a tel: link — "${callHref}"`,
        })
      }

      // ── 9) zoomed shot of sticky bar
      const stickyShot = path.join(shotDir, '07_sticky_bar.png')
      try {
        const stickyParent = stickyWa.locator('xpath=..')
        await stickyParent.screenshot({ path: stickyShot })
      } catch {
        await page.screenshot({ path: stickyShot, clip: { x: 0, y: (deviceConfig.viewport?.height ?? 800) - 110, width: deviceConfig.viewport?.width ?? 360, height: 110 } })
      }

      // ── 10) scroll to bottom, screenshot, verify sticky bar still anchored
      await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' as any }))
      await page.waitForTimeout(500)
      const bottomShot = path.join(shotDir, '08_scrolled_bottom.png')
      await page.screenshot({ path: bottomShot })

      const stickyBox = await stickyWa.boundingBox()
      const vh = deviceConfig.viewport?.height ?? 800
      if (stickyBox) {
        if (stickyBox.y < 0 || stickyBox.y > vh) {
          pushFinding({
            severity: 'HIGH',
            device: deviceName,
            area: 'sticky-bar',
            description: `After scroll to bottom, sticky thumb bar is off-screen at y=${stickyBox.y.toFixed(0)} (viewport height ${vh}). Likely jumped due to address-bar collapse / layout shift.`,
            evidence: bottomShot,
          })
        }
      }

      // ── 11) mid-scroll address-bar-collapse simulation
      await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' as any }))
      await page.waitForTimeout(300)
      const midShot = path.join(shotDir, '09_mid_scroll.png')
      await page.screenshot({ path: midShot })

      // sticky bar should still be visible after mid-scroll
      const midStickyBox = await stickyWa.boundingBox()
      if (midStickyBox && (midStickyBox.y < 0 || midStickyBox.y > vh)) {
        pushFinding({
          severity: 'HIGH',
          device: deviceName,
          area: 'sticky-bar',
          description: `Sticky bar off-screen after mid-scroll (y=${midStickyBox.y.toFixed(0)})`,
          evidence: midShot,
        })
      }

      // ── 12) :active / pressed state — tap the WA sticky and screenshot mid-press
      try {
        const waBox = await stickyWa.boundingBox()
        if (waBox) {
          await page.mouse.move(waBox.x + waBox.width / 2, waBox.y + waBox.height / 2)
          await page.mouse.down()
          await page.waitForTimeout(120)
          await page.screenshot({ path: path.join(shotDir, '10_sticky_active_state.png') })
          await page.mouse.up()
        }
      } catch {}

      // ── 13) Font rendering — verify Bebas Neue & Barlow loaded
      const fontInfo = await page.evaluate(() => {
        const heading = document.querySelector('h1')
        const cs = heading ? window.getComputedStyle(heading) : null
        const subLabel = document.querySelector('[style*="--font-sub"]') as HTMLElement | null
        return {
          h1Font: cs?.fontFamily ?? '',
          h1FontSize: cs?.fontSize ?? '',
          docFonts: Array.from(document.fonts).map(f => `${f.family}-${f.status}`),
        }
      })
      if (!/Bebas|Impact/i.test(fontInfo.h1Font)) {
        pushFinding({
          severity: 'MEDIUM',
          device: deviceName,
          area: 'typography',
          description: `Hero h1 not using Bebas Neue family — computed font-family: "${fontInfo.h1Font}"`,
        })
      }
      const bebasLoaded = fontInfo.docFonts.some(f => /Bebas Neue-loaded/i.test(f))
      const barlowLoaded = fontInfo.docFonts.some(f => /Barlow Condensed-loaded/i.test(f))
      if (!bebasLoaded) {
        pushFinding({
          severity: 'MEDIUM',
          device: deviceName,
          area: 'typography',
          description: `Bebas Neue Google Font not in 'loaded' state on Android — fonts list: ${fontInfo.docFonts.slice(0, 6).join(', ')}`,
        })
      }
      if (!barlowLoaded) {
        pushFinding({
          severity: 'LOW',
          device: deviceName,
          area: 'typography',
          description: `Barlow Condensed not loaded — fonts list excerpt: ${fontInfo.docFonts.slice(0, 8).join(', ')}`,
        })
      }

      // ── 14) console errors
      if (consoleErrors.length > 0) {
        pushFinding({
          severity: 'MEDIUM',
          device: deviceName,
          area: 'console',
          description: `${consoleErrors.length} console error(s): ${consoleErrors.slice(0, 3).join(' | ').slice(0, 400)}`,
        })
      }

      await context.close()
    })
  })
}
