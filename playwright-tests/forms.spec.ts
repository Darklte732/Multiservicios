/**
 * Interactive forms & modals — mobile QA (iPhone 14 Pro + Pixel 7)
 *
 * Covers:
 *   1. MobileQuoteCard 3-step flow (service → urgency → phone → submit)
 *   2. /booking page service selection → call-to-book
 *   3. AuthModal (open from hamburger, tab switch, render, close)
 *   4. FAQ accordion (default open, toggle expand/collapse)
 *   5. WhatsApp deep-link encoding (sticky bar + booking page)
 *
 * Devices are emulated by manually launching contexts inside each test (avoids
 * the Playwright "cannot test.use in describe" limitation when iterating a matrix).
 *
 * Output:
 *   - screenshots in playwright-tests/screenshots/forms/{device}/{flow}/...
 *   - findings + tap measurements written to mobile-qa-reports/forms.md (afterAll)
 */

import { test, expect, chromium, devices, type BrowserContext, type Page } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { BASE_URL, type Finding } from './helpers'

const SCREENSHOT_ROOT = path.resolve(__dirname, 'screenshots', 'forms')
const REPORT_DIR = path.resolve(__dirname, '..', 'mobile-qa-reports')

const findings: Finding[] = []
const tapMeasurements: Array<{ element: string; device: string; width: number; height: number; ok: boolean }> = []
const wins: string[] = []

function recordTap(element: string, device: string, box: { width: number; height: number } | null) {
  if (!box) {
    tapMeasurements.push({ element, device, width: 0, height: 0, ok: false })
    return
  }
  const ok = box.height >= 44 && box.width >= 44
  tapMeasurements.push({ element, device, width: Math.round(box.width), height: Math.round(box.height), ok })
}

function shotPath(device: string, flow: string, name: string): string {
  const safeDev = device.replace(/\s+/g, '-').toLowerCase()
  const dir = path.join(SCREENSHOT_ROOT, safeDev, flow)
  fs.mkdirSync(dir, { recursive: true })
  return path.join(dir, name)
}

async function dismissEmergencyBanner(page: Page) {
  const closeBtn = page.locator('[aria-label="Cerrar"]').first()
  if (await closeBtn.isVisible().catch(() => false)) {
    await closeBtn.click().catch(() => {})
  }
}

const DEVICE_MATRIX = [
  { name: 'iPhone 14 Pro', config: devices['iPhone 14 Pro'] },
  { name: 'Pixel 7', config: devices['Pixel 7'] },
]

// Single shared browser across all tests — faster.
let sharedBrowser: Awaited<ReturnType<typeof chromium.launch>> | null = null

test.beforeAll(async () => {
  sharedBrowser = await chromium.launch()
})

test.afterAll(async () => {
  if (sharedBrowser) await sharedBrowser.close()
})

async function newCtx(deviceConfig: (typeof devices)[string]): Promise<{ ctx: BrowserContext; page: Page }> {
  if (!sharedBrowser) throw new Error('Browser not initialized')
  const ctx = await sharedBrowser.newContext({ ...deviceConfig })
  const page = await ctx.newPage()
  page.setDefaultTimeout(15_000)
  return { ctx, page }
}

for (const { name: deviceName, config: deviceConfig } of DEVICE_MATRIX) {
  test.describe(`[${deviceName}] interactive flows`, () => {

    // ────────────────────────────────────────────────────────
    // 1) MobileQuoteCard
    // ────────────────────────────────────────────────────────
    test(`MobileQuoteCard 3-step flow submits with query params`, async () => {
      const { ctx, page } = await newCtx(deviceConfig)
      try {
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
        await dismissEmergencyBanner(page)

        // Mobile-only quote card. The MobileQuoteCard component renders one root <div> whose
        // FIRST child is a header row containing "COTIZACIÓN GRATIS · 30 SEG" (no "UNDOS").
        // We pick the element with the exact normalized text via :has-text and walk up to the
        // card container via xpath.
        const cardHeader = page.locator('div', { hasText: /^COTIZACIÓN GRATIS · 30 SEG$/ }).first()
        await cardHeader.scrollIntoViewIfNeeded()
        await expect(cardHeader).toBeVisible({ timeout: 6000 })
        // Card root = great-grandparent (header is inside the header row, inside the card).
        // We use xpath ancestor-or-self with 2 levels up.
        const card = cardHeader.locator('xpath=ancestor::div[2]')

        // Measure step-1 service buttons via unique sub-labels (avoids matching home
        // ServiceCards or the desktop quote form whose buttons aren't visible at this viewport).
        const step1Subs = [
          { sub: 'Paneles, cableado, luminarias', label: 'Instalación' },
          { sub: 'Falla, corto, sin luz', label: 'Reparación' },
          { sub: 'Revisión preventiva', label: 'Mantenimiento' },
          { sub: 'Atención inmediata', label: 'Emergencia 24/7' },
        ]
        for (const s of step1Subs) {
          const btn = page.getByRole('button').filter({ hasText: s.sub }).first()
          if (await btn.isVisible().catch(() => false)) {
            const box = await btn.boundingBox()
            recordTap(`quote step-1 "${s.label}"`, deviceName, box)
          }
        }

        await page.screenshot({ path: shotPath(deviceName, 'quote-card', '01-step1-service.png'), fullPage: false })

        // Tap Reparación → advance to step 2 (use unique sub-label "Falla, corto, sin luz")
        const reparacionBtn = page.getByRole('button').filter({ hasText: 'Falla, corto, sin luz' }).first()
        await expect(reparacionBtn).toBeVisible({ timeout: 5000 })
        await reparacionBtn.click()
        await page.waitForTimeout(600)

        await expect(page.locator('text=¿Qué tan urgente?')).toBeVisible({ timeout: 4000 })
        await page.screenshot({ path: shotPath(deviceName, 'quote-card', '02-step2-urgency.png'), fullPage: false })

        // Measure urgency buttons (unique sub-labels lock onto MobileQuoteCard)
        const urgencySubs = [
          { sub: 'Sin luz / emergencia', label: 'Ahora mismo' },
          { sub: 'Lo antes posible', label: 'En 24 horas' },
          { sub: 'Puedo esperar', label: 'Esta semana' },
        ]
        for (const u of urgencySubs) {
          const btn = page.getByRole('button').filter({ hasText: u.sub }).first()
          if (await btn.isVisible().catch(() => false)) {
            const box = await btn.boundingBox()
            recordTap(`quote step-2 "${u.label}"`, deviceName, box)
          }
        }

        const en24Btn = page.getByRole('button').filter({ hasText: 'Lo antes posible' }).first()
        await en24Btn.click()
        await page.waitForTimeout(600)

        // Step 3: phone input — there can also be a desktop quote form input, so prefer
        // the one inside the visible quote card. The mobile input has placeholder "809 251 4329"
        // — same as desktop, but desktop is display:none under md breakpoint, so :visible filters out.
        const phoneInput = page.locator('input[type="tel"]:not([aria-label])').first()
        await expect(phoneInput).toBeVisible({ timeout: 3000 })
        await page.screenshot({ path: shotPath(deviceName, 'quote-card', '03-step3-phone.png'), fullPage: false })

        const inputMode = await phoneInput.getAttribute('inputmode')
        if (inputMode !== 'tel') {
          findings.push({
            severity: 'HIGH',
            area: 'MobileQuoteCard phone input',
            device: deviceName,
            description: `Phone input is missing inputmode="tel" (got: ${inputMode ?? 'null'}). iOS will show the alphabetic keyboard.`,
          })
        } else {
          wins.push(`[${deviceName}] phone input correctly declares inputmode="tel" — iOS/Android will show numeric keypad.`)
        }

        const inputType = await phoneInput.getAttribute('type')
        if (inputType !== 'tel') {
          findings.push({
            severity: 'MEDIUM',
            area: 'MobileQuoteCard phone input',
            device: deviceName,
            description: `Phone input type="${inputType}" should be "tel".`,
          })
        }

        const submitBtn = page.getByRole('button', { name: /RECIBIR MI COTIZACIÓN/ }).first()
        const submitBox = await submitBtn.boundingBox()
        recordTap('quote step-3 submit "RECIBIR MI COTIZACIÓN"', deviceName, submitBox)

        // ── 3a: empty-phone submit ──
        await submitBtn.click()
        await page.waitForLoadState('domcontentloaded', { timeout: 6000 }).catch(() => {})
        await page.waitForTimeout(800)

        const urlAfterEmpty = page.url()
        if (urlAfterEmpty.includes('/booking') && !urlAfterEmpty.includes('phone=')) {
          findings.push({
            severity: 'MEDIUM',
            area: 'MobileQuoteCard validation',
            device: deviceName,
            description: `Empty phone submit still navigates to /booking (URL: ${urlAfterEmpty.replace(BASE_URL, '')}) with no phone param and no inline error. User can advance the form with zero phone data — recommend an inline "Ingresa tu número" hint.`,
          })
        } else if (urlAfterEmpty === BASE_URL + '/' || urlAfterEmpty === BASE_URL) {
          wins.push(`[${deviceName}] empty phone submit was blocked (stayed on /).`)
        }

        await page.screenshot({ path: shotPath(deviceName, 'quote-card', '04-after-empty-submit.png'), fullPage: false })

        // ── 3b: valid phone submit ──
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
        await dismissEmergencyBanner(page)
        await page.waitForTimeout(500)

        const cardHeader2 = page.locator('div', { hasText: /^COTIZACIÓN GRATIS · 30 SEG$/ }).first()
        await cardHeader2.scrollIntoViewIfNeeded()
        await expect(cardHeader2).toBeVisible({ timeout: 6000 })
        await page.waitForTimeout(300)

        // Use button with subtext "Paneles, cableado, luminarias" — unique to MobileQuoteCard
        const instalacionBtn = page.getByRole('button').filter({ hasText: 'Paneles, cableado, luminarias' }).first()
        await expect(instalacionBtn).toBeVisible({ timeout: 5000 })
        await instalacionBtn.click()
        await page.waitForTimeout(600)

        // Now urgency step is rendered. The MobileQuoteCard urgencies have sub-labels too:
        //   'Ahora mismo' / 'Sin luz / emergencia'
        //   'En 24 horas' / 'Lo antes posible'
        //   'Esta semana' / 'Puedo esperar'
        // 'Sin luz' is unique to MobileQuoteCard step-2.
        const nowBtn = page.getByRole('button').filter({ hasText: 'Sin luz / emergencia' }).first()
        await expect(nowBtn).toBeVisible({ timeout: 5000 })
        await nowBtn.click()
        await page.waitForTimeout(600)

        const phoneInput2 = page.locator('input[type="tel"]:not([aria-label])').first()
        await expect(phoneInput2).toBeVisible({ timeout: 5000 })
        await phoneInput2.fill('8092514329')
        await page.screenshot({ path: shotPath(deviceName, 'quote-card', '05-step3-filled.png'), fullPage: false })

        await page.getByRole('button', { name: /RECIBIR MI COTIZACIÓN/ }).first().click()
        await page.waitForLoadState('domcontentloaded', { timeout: 8000 })
        await page.waitForTimeout(500)

        const finalUrl = page.url()
        expect(finalUrl).toContain('/booking')
        expect(finalUrl).toContain('service=instalacion')
        expect(finalUrl).toContain('urgency=now')
        expect(finalUrl).toContain('phone=8092514329')

        wins.push(`[${deviceName}] full 3-step quote submission produced expected URL: /booking?service=instalacion&urgency=now&phone=8092514329`)
        await page.screenshot({ path: shotPath(deviceName, 'quote-card', '06-after-submit.png'), fullPage: false })
      } finally {
        await ctx.close()
      }
    })

    // ────────────────────────────────────────────────────────
    // 2) Booking page
    // ────────────────────────────────────────────────────────
    test(`/booking service-selection grid → call-to-book reveals tel + WhatsApp CTAs`, async () => {
      const { ctx, page } = await newCtx(deviceConfig)
      try {
        await page.goto(BASE_URL + '/booking', { waitUntil: 'domcontentloaded' })
        await dismissEmergencyBanner(page)
        await page.waitForTimeout(700)

        await page.screenshot({ path: shotPath(deviceName, 'booking', '01-service-grid.png'), fullPage: true })

        const repCard = page.locator('text=Reparación Eléctrica').first()
        await repCard.scrollIntoViewIfNeeded()
        const cardBox = await repCard.boundingBox()
        recordTap('booking service card "Reparación Eléctrica" (text node)', deviceName, cardBox)

        await repCard.click()
        await page.waitForTimeout(900)

        const callHeading = page.locator('text=Llama para Reservar')
        const visible = await callHeading.isVisible({ timeout: 4000 }).catch(() => false)
        if (!visible) {
          findings.push({
            severity: 'HIGH',
            area: 'Booking flow',
            device: deviceName,
            description: 'Tapping a service card did not reveal "Llama para Reservar" within 4s. AnimatePresence transition may be slow or broken on this viewport.',
            evidence: shotPath(deviceName, 'booking', '02-after-card-tap.png'),
          })
        } else {
          wins.push(`[${deviceName}] service card → call-to-book transition works on /booking.`)
        }
        await page.screenshot({ path: shotPath(deviceName, 'booking', '02-after-card-tap.png'), fullPage: true })

        const telBtn = page.locator('a[href^="tel:+18092514329"]').first()
        const waBtn = page.locator('a[href^="https://wa.me/18092514329"]').first()

        const telHref = await telBtn.getAttribute('href').catch(() => null)
        const waHref = await waBtn.getAttribute('href').catch(() => null)

        if (!telHref) {
          findings.push({
            severity: 'CRITICAL',
            area: 'Booking call-to-book',
            device: deviceName,
            description: 'No tel: link present after selecting a service — primary call CTA missing.',
          })
        } else if (telHref !== 'tel:+18092514329') {
          findings.push({
            severity: 'HIGH',
            area: 'Booking call-to-book',
            device: deviceName,
            description: `tel: href is "${telHref}" — expected "tel:+18092514329"`,
          })
        }

        if (!waHref) {
          findings.push({
            severity: 'HIGH',
            area: 'Booking call-to-book',
            device: deviceName,
            description: 'No WhatsApp link present after service selection.',
          })
        } else {
          const text = await page.evaluate((h: string) => new URL(h).searchParams.get('text') ?? '', waHref)
          if (!text.toLowerCase().includes('reparación')) {
            findings.push({
              severity: 'MEDIUM',
              area: 'Booking WhatsApp deep-link',
              device: deviceName,
              description: `WhatsApp message does not reference selected service "Reparación". Decoded: "${text}"`,
            })
          } else {
            wins.push(`[${deviceName}] booking WhatsApp message correctly references service. Decoded snippet: "${text.slice(0, 90)}..."`)
          }
        }

        if (telHref) recordTap('booking call CTA (tel)', deviceName, await telBtn.boundingBox())
        if (waHref) recordTap('booking WhatsApp CTA', deviceName, await waBtn.boundingBox())
      } finally {
        await ctx.close()
      }
    })

    // ────────────────────────────────────────────────────────
    // 3) AuthModal
    // ────────────────────────────────────────────────────────
    test(`AuthModal opens from hamburger, renders tabs, accepts input, closes cleanly`, async () => {
      const { ctx, page } = await newCtx(deviceConfig)
      try {
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
        await dismissEmergencyBanner(page)

        await page.evaluate(() => window.scrollTo(0, 300))
        await page.waitForTimeout(150)
        const scrollBefore = await page.evaluate(() => window.scrollY)

        // The lg:hidden hamburger button is the last button in the header (Menu icon)
        const hamburger = page.locator('header button.lg\\:hidden').first()
        await hamburger.click()
        await page.waitForTimeout(500)

        // Tap "Entrar" — there can be 2 in the DOM (mobile + desktop hidden); pick the visible one
        const entrarCandidates = page.locator('button', { hasText: /^\s*Entrar\s*$/ })
        const entrarCount = await entrarCandidates.count()
        let entrarBtn = null
        for (let i = 0; i < entrarCount; i++) {
          const b = entrarCandidates.nth(i)
          if (await b.isVisible().catch(() => false)) {
            entrarBtn = b
            break
          }
        }
        if (!entrarBtn) {
          findings.push({
            severity: 'CRITICAL',
            area: 'AuthModal entry',
            device: deviceName,
            description: 'Could not find a visible "Entrar" button in mobile hamburger menu.',
          })
          await page.screenshot({ path: shotPath(deviceName, 'auth-modal', '00-no-entrar.png'), fullPage: false })
          return
        }
        const entrarBox = await entrarBtn.boundingBox()
        recordTap('hamburger menu "Entrar" button', deviceName, entrarBox)
        await entrarBtn.click()
        await page.waitForTimeout(800)

        await page.screenshot({ path: shotPath(deviceName, 'auth-modal', '01-modal-open-login.png'), fullPage: false })

        const modal = page.locator('.glass-modal').first()
        const modalBox = await modal.boundingBox()
        const viewport = page.viewportSize()!
        if (modalBox) {
          if (modalBox.y < 0 || modalBox.y + modalBox.height > viewport.height + 4) {
            findings.push({
              severity: 'HIGH',
              area: 'AuthModal layout',
              device: deviceName,
              description: `Modal vertically overflows viewport: top=${Math.round(modalBox.y)}, bottom=${Math.round(modalBox.y + modalBox.height)}, viewport h=${viewport.height}. Modal sets max-h-[90vh] + overflow-y-auto, so user must scroll inside the modal — confirm the submit button is reachable.`,
              evidence: shotPath(deviceName, 'auth-modal', '01-modal-open-login.png'),
            })
          }
          if (modalBox.x < 0 || modalBox.x + modalBox.width > viewport.width + 4) {
            findings.push({
              severity: 'HIGH',
              area: 'AuthModal layout',
              device: deviceName,
              description: `Modal horizontally cropped: x=${Math.round(modalBox.x)} width=${Math.round(modalBox.width)} viewport w=${viewport.width}`,
            })
          }
        }

        // Switch to register tab
        const registerTab = page.locator('button', { hasText: 'Registrarse' }).first()
        await expect(registerTab).toBeVisible()
        await registerTab.click()
        await page.waitForTimeout(300)

        const nameField = page.locator('input[placeholder="Tu nombre completo"]')
        const nameVisible = await nameField.isVisible().catch(() => false)
        if (!nameVisible) {
          findings.push({
            severity: 'HIGH',
            area: 'AuthModal register tab',
            device: deviceName,
            description: 'Switching to "Registrarse" did not reveal the name field.',
          })
        } else {
          wins.push(`[${deviceName}] AuthModal tab switch login→register reveals name field.`)
        }
        await page.screenshot({ path: shotPath(deviceName, 'auth-modal', '02-modal-register-tab.png'), fullPage: false })

        const identifier = page.locator('input[placeholder*="ejemplo@correo.com"]')
        const password = page.locator('input[placeholder="Tu contraseña"]')

        await nameField.fill('QA Test User')
        await identifier.fill('qa@example.com')
        await password.fill('test-do-not-submit')

        const idType = await identifier.getAttribute('type')
        const idInputMode = await identifier.getAttribute('inputmode')
        findings.push({
          severity: 'LOW',
          area: 'AuthModal email/phone field',
          device: deviceName,
          description: `Identifier field type="${idType ?? 'text'}", inputmode="${idInputMode ?? 'null'}". Field accepts BOTH email and phone, so neither pure type="email" nor "tel" is right — current text/null is acceptable. Consider adding autocomplete="username" for password-manager autofill.`,
        })

        await page.screenshot({ path: shotPath(deviceName, 'auth-modal', '03-modal-register-filled.png'), fullPage: false })

        // Switch back to login — form should clear
        await page.locator('button', { hasText: 'Iniciar Sesión' }).first().click()
        await page.waitForTimeout(250)
        const idAfter = await identifier.inputValue().catch(() => '')
        if (idAfter !== '') {
          findings.push({
            severity: 'LOW',
            area: 'AuthModal tab switch',
            device: deviceName,
            description: `Form did not clear on tab switch register→login (identifier still "${idAfter}"). Per AuthModal.handleTabChange this should reset.`,
          })
        }

        // Close modal
        const closeBtn = page.locator('.glass-modal button').filter({ has: page.locator('svg') }).first()
        await closeBtn.click()
        await page.waitForTimeout(700)

        const opacityRaw = await page.locator('.glass-modal').first()
          .evaluate((el) => getComputedStyle(el).opacity).catch(() => '1')
        if (parseFloat(opacityRaw) > 0.2) {
          findings.push({
            severity: 'MEDIUM',
            area: 'AuthModal close',
            device: deviceName,
            description: `After clicking close, modal still has opacity=${opacityRaw}. Expected near 0.`,
          })
        }

        const scrollAfter = await page.evaluate(() => window.scrollY)
        const drift = Math.abs(scrollAfter - scrollBefore)
        if (drift > 100) {
          findings.push({
            severity: 'MEDIUM',
            area: 'AuthModal close',
            device: deviceName,
            description: `Page scroll RESET to ${scrollAfter} after closing modal (was ${scrollBefore}). User loses their reading position when dismissing the auth modal — frustrating UX. Likely body-scroll-lock side effect on modal open without saving/restoring scrollTop.`,
          })
        } else if (drift > 20) {
          findings.push({
            severity: 'LOW',
            area: 'AuthModal close',
            device: deviceName,
            description: `Page scroll drifted by ${drift}px after closing modal (before=${scrollBefore}, after=${scrollAfter}).`,
          })
        } else {
          wins.push(`[${deviceName}] AuthModal close preserves scroll position (drift=${drift}px).`)
        }

        await page.screenshot({ path: shotPath(deviceName, 'auth-modal', '04-modal-closed.png'), fullPage: false })
      } finally {
        await ctx.close()
      }
    })

    // ────────────────────────────────────────────────────────
    // 4) FAQ accordion
    // ────────────────────────────────────────────────────────
    test(`FAQ accordion: first item open by default, toggle works`, async () => {
      const { ctx, page } = await newCtx(deviceConfig)
      try {
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
        await dismissEmergencyBanner(page)

        const faqHeading = page.locator('h2', { hasText: 'Preguntas Frecuentes' }).first()
        await faqHeading.scrollIntoViewIfNeeded()
        await page.waitForTimeout(500)
        await page.screenshot({ path: shotPath(deviceName, 'faq', '01-faq-default.png'), fullPage: false })

        const firstQuestionBtn = page.locator('button', { hasText: '¿La evaluación inicial es gratuita?' }).first()
        await expect(firstQuestionBtn).toBeVisible()

        const firstAnswer = page.locator('text=ofrecemos una evaluación técnica inicial sin costo').first()
        const firstAnswerVisible = await firstAnswer.isVisible().catch(() => false)
        if (!firstAnswerVisible) {
          findings.push({
            severity: 'MEDIUM',
            area: 'FAQ',
            device: deviceName,
            description: 'First FAQ item should be open by default (per CLAUDE.md & FAQAccordion source) but its answer text is not visible.',
          })
        } else {
          wins.push(`[${deviceName}] FAQ first item open by default — answer text visible.`)
        }

        const qBox = await firstQuestionBtn.boundingBox()
        recordTap('FAQ question button (q1)', deviceName, qBox)

        // Tap closed item 2
        const secondQ = page.locator('button', { hasText: '¿Atienden emergencias de noche' }).first()
        await secondQ.scrollIntoViewIfNeeded()
        await secondQ.click()
        await page.waitForTimeout(500)

        const secondAnswer = page.locator('text=Contamos con servicio de emergencias 24 horas').first()
        const secondVisible = await secondAnswer.isVisible().catch(() => false)
        if (!secondVisible) {
          findings.push({
            severity: 'HIGH',
            area: 'FAQ',
            device: deviceName,
            description: 'Tapping a closed FAQ item did not reveal its answer.',
          })
        }
        await page.screenshot({ path: shotPath(deviceName, 'faq', '02-faq-second-open.png'), fullPage: false })

        // Single-open check
        const firstAnswerStill = await firstAnswer.isVisible().catch(() => false)
        if (firstAnswerStill) {
          findings.push({
            severity: 'LOW',
            area: 'FAQ',
            device: deviceName,
            description: 'Both FAQ items appear open simultaneously after opening item 2. Implementation is single-open — likely a layout artifact.',
          })
        } else {
          wins.push(`[${deviceName}] FAQ is single-open: opening item 2 collapses item 1.`)
        }

        // Toggle item 2 closed
        await secondQ.click()
        await page.waitForTimeout(500)
        const secondAfterCollapse = await secondAnswer.isVisible().catch(() => false)
        if (secondAfterCollapse) {
          findings.push({
            severity: 'MEDIUM',
            area: 'FAQ',
            device: deviceName,
            description: 'Tapping an open FAQ item did not collapse it.',
          })
        } else {
          wins.push(`[${deviceName}] FAQ item toggles closed on second tap.`)
        }
        await page.screenshot({ path: shotPath(deviceName, 'faq', '03-faq-toggled-closed.png'), fullPage: false })

        // Open item 3 — confirm not clipped
        const thirdQ = page.locator('button', { hasText: '¿Qué zonas o municipios cubren' }).first()
        await thirdQ.click()
        await page.waitForTimeout(600)
        const thirdAnswerEl = page.locator('text=Cubrimos El Seibo y un radio de 60 km').first()
        const thirdBox = await thirdAnswerEl.boundingBox()
        if (thirdBox && thirdBox.height < 10) {
          findings.push({
            severity: 'HIGH',
            area: 'FAQ',
            device: deviceName,
            description: `Third FAQ answer is clipped — bounding box height only ${thirdBox.height}px.`,
          })
        }
      } finally {
        await ctx.close()
      }
    })

    // ────────────────────────────────────────────────────────
    // 5) WhatsApp deep-link encoding (sticky thumb bar)
    // ────────────────────────────────────────────────────────
    test(`Sticky thumb bar WhatsApp deep-link decodes to Spanish "Hola Neno" greeting`, async () => {
      const { ctx, page } = await newCtx(deviceConfig)
      try {
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
        await dismissEmergencyBanner(page)
        await page.waitForTimeout(600)

        const waLink = page.locator('a[href*="wa.me/18092514329"]').first()
        await expect(waLink).toBeVisible({ timeout: 5000 })

        const href = await waLink.getAttribute('href')
        if (!href) {
          findings.push({
            severity: 'CRITICAL',
            area: 'Sticky thumb bar',
            device: deviceName,
            description: 'WhatsApp link missing from sticky thumb bar.',
          })
          return
        }

        const decoded = await page.evaluate((h: string) => new URL(h).searchParams.get('text') ?? '', href)

        if (!decoded.includes('Hola Neno')) {
          findings.push({
            severity: 'HIGH',
            area: 'Sticky thumb bar WhatsApp',
            device: deviceName,
            description: `Decoded WhatsApp text does not contain "Hola Neno". Got: "${decoded}"`,
          })
        } else {
          wins.push(`[${deviceName}] sticky bar WhatsApp message decodes to Spanish greeting: "${decoded.slice(0, 90)}..."`)
        }

        const waBox = await waLink.boundingBox()
        recordTap('sticky thumb bar WhatsApp', deviceName, waBox)

        // Scroll to bottom so sticky bar is in the same viewport position as a real user would
        // see when actually tapping it (and so visibility-filtered locators resolve correctly).
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
        await page.waitForTimeout(400)

        // Locate the sticky bar's tel link by its sibling text "LLAMAR" — multiple tel links exist
        // on the page (nav, hero CTA, etc.); we need the one inside the fixed-position thumb bar.
        const callLink = page.locator('a[href^="tel:+18092514329"]', { hasText: 'LLAMAR' }).first()
        const callBox = await callLink.boundingBox()
        recordTap('sticky thumb bar Llamar', deviceName, callBox)
        if (callBox && callBox.height > 0 && callBox.height < 44) {
          findings.push({
            severity: 'HIGH',
            area: 'Sticky thumb bar Llamar button',
            device: deviceName,
            description: `LLAMAR tap target is only ${Math.round(callBox.height)}px tall — below the 44px iOS HIG / Material minimum. Likely caused by the emoji "📞" not honoring line-height the way the SVG WhatsAppIcon does (the WhatsApp button is 52px). Recommend swapping the emoji for a proper Phone icon (e.g. lucide-react <Phone />) or adding explicit minHeight: 44.`,
            evidence: shotPath(deviceName, 'whatsapp', '01-sticky-bar.png'),
          })
        }

        await page.screenshot({ path: shotPath(deviceName, 'whatsapp', '01-sticky-bar.png'), fullPage: false })
      } finally {
        await ctx.close()
      }
    })
  })
}

// ────────────────────────────────────────────────────────
// Write the markdown report after all tests run
// ────────────────────────────────────────────────────────
test.afterAll(async () => {
  fs.mkdirSync(REPORT_DIR, { recursive: true })

  const counts: Record<string, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, INFO: 0 }
  for (const f of findings) counts[f.severity] = (counts[f.severity] ?? 0) + 1

  const flows: Record<string, string[]> = {
    'MobileQuoteCard': [],
    'Booking page': [],
    'AuthModal': [],
    'FAQ accordion': [],
    'WhatsApp deep-link': [],
  }
  for (const f of findings) {
    const area = f.area.toLowerCase()
    let bucket = 'WhatsApp deep-link'
    if (area.includes('quote') || area.includes('mobilequote')) bucket = 'MobileQuoteCard'
    else if (area.includes('booking')) bucket = 'Booking page'
    else if (area.includes('auth')) bucket = 'AuthModal'
    else if (area.includes('faq')) bucket = 'FAQ accordion'
    else if (area.includes('sticky') || area.includes('whatsapp')) bucket = 'WhatsApp deep-link'
    const evidence = f.evidence
      ? `\n  - screenshot: \`${path.relative(path.resolve(__dirname, '..'), f.evidence).replace(/\\/g, '/')}\``
      : ''
    flows[bucket].push(`- **[${f.severity}]** *(${f.device})* ${f.description}${evidence}`)
  }

  const today = new Date().toISOString().split('T')[0]

  const tapRows = tapMeasurements.length
    ? tapMeasurements
        .map((t) => `| ${t.element} (${t.device}) | ${t.width}px | ${t.height}px | ${t.ok ? 'YES' : 'NO (<44px)'} |`)
        .join('\n')
    : '| _none recorded_ | | | |'

  const md = `# Mobile Forms & Modals QA Report

**Date:** ${today}
**Devices:** iPhone 14 Pro, Pixel 7
**Server:** http://localhost:3000
**Scope:** Interactive flows — MobileQuoteCard, /booking, AuthModal, FAQ, WhatsApp deep-links

## Summary
- Critical: ${counts.CRITICAL}
- High: ${counts.HIGH}
- Medium: ${counts.MEDIUM}
- Low: ${counts.LOW}
- Info: ${counts.INFO}

Total findings: ${findings.length}

## Findings by flow

### MobileQuoteCard
${flows.MobileQuoteCard.length ? flows.MobileQuoteCard.join('\n') : '_No issues found._'}

### Booking page
${flows['Booking page'].length ? flows['Booking page'].join('\n') : '_No issues found._'}

### AuthModal
${flows.AuthModal.length ? flows.AuthModal.join('\n') : '_No issues found._'}

### FAQ accordion
${flows['FAQ accordion'].length ? flows['FAQ accordion'].join('\n') : '_No issues found._'}

### WhatsApp deep-link
${flows['WhatsApp deep-link'].length ? flows['WhatsApp deep-link'].join('\n') : '_No issues found._'}

## Tap target measurements
| Element | Width | Height | OK (>=44px)? |
| ------- | ----- | ------ | --- |
${tapRows}

## What works great
${wins.length ? wins.map((w) => `- ${w}`).join('\n') : '_No wins recorded — see findings._'}
`

  const out = path.join(REPORT_DIR, 'forms.md')
  fs.writeFileSync(out, md, 'utf8')
  // eslint-disable-next-line no-console
  console.log(`\n[forms QA] report written: ${out}`)
})
