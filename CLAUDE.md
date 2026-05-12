# CLAUDE.md — MultiServicios El Seibo

> Full context for AI-assisted development. Keep this file updated as the project evolves.

---

## Project Overview

**MultiServicios El Seibo** is a marketing landing page for Neno Báez, an electrician in El Seibo, Dominican Republic. Built with Next.js 15 App Router. Primary conversion is a direct phone call or WhatsApp message to Neno — there are no customer/technician accounts, no voice agent, and no admin dashboard. PostHog captures product analytics; that is the only backend dependency the live site relies on.

**Live domain:** `multiservicios.app`
**GitHub:** `github.com/Darklte732/Multiservicios`
**Branch:** `master`

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 15.5.12 |
| Language | TypeScript | 5.x |
| UI | React | 19.0.0 |
| Styling | Tailwind CSS + custom plugin | 3.4.x |
| Animation | Framer Motion | 12.x |
| Animation | GSAP | 3.x |
| Icons | Lucide React | 0.523 |
| Database | Supabase (PostgreSQL + Realtime) | 2.50.2 |
| State | Zustand (with localStorage persistence) | 5.x |
| Toasts | react-hot-toast | 2.5.2 |
| 3D | Three.js + React Three Fiber | 0.178 / 9.1 |

---

## Design System

### Color Palette
```
navy-950: #0A0F1E  — page background
navy-900: #0D1224  — alt section bg
navy-800: #111827  — secondary sections
navy-700: #1A2035  — card surfaces
navy-600: #1E2845  — card hover

electric: #EAB308        — primary accent (yellow)
electric-bright: #F5C518 — hero headings
electric-hover: #CA9A07  — button hover

emergency: #EF4444       — emergency CTA
emergency-dark: #450A0A  — emergency section bg
whatsapp: #25D366        — WhatsApp button
```

### Fonts
- **Display:** Bebas Neue — loaded via Google Fonts, used via `var(--font-display)` or `fontFamily: 'var(--font-display)'` inline style
- **Sub-heading:** Barlow Condensed — `var(--font-sub)`
- **Body:** Geist Sans (Next.js default)

### Key CSS Utility Classes (defined in `globals.css`)
```
.dark-nav              — sticky translucent dark navbar
.dark-card             — card with navy-700 bg, border, hover glow
.service-card-dark     — service card with absolute positioning
.featured-emergency    — red border variant for emergency cards
.btn-electric          — yellow gradient CTA button
.btn-emergency         — red gradient emergency button
.btn-outline-electric  — transparent with yellow border
.btn-whatsapp          — green WhatsApp button
.electric-badge        — solid yellow pill label
.electric-badge-outline — yellow bordered pill
.testimonial-card      — dark testimonial card
.emergency-banner      — pulsing red top strip
.whatsapp-float        — fixed bottom-right WhatsApp button
.gradient-text-electric — animated yellow gradient text
.section-primary/secondary/tertiary — alternating dark backgrounds
.process-step-number   — yellow circle for numbered steps
.stat-card / .stat-number — statistics display
.input-dark            — dark form input
.bento-grid            — 4-col responsive grid for service cards
.progress-track / .progress-fill — progress bar
```

### Custom Tailwind Animations
- `electric-pulse` — yellow glow pulse
- `glow-pulse` — box-shadow pulse
- `badge-bounce` — bounce
- `float` — up/down float
- `emergency-pulse` — red pulsing

---

## Directory Structure

```
src/
├── app/
│   ├── layout.tsx              — Root layout: fonts, metadata, ErrorBoundary, Toaster
│   ├── globals.css             — Full design system CSS (~1100 lines)
│   ├── page.tsx                — Home page (hero, services, about, process, testimonials, FAQ, CTA)
│   ├── booking/page.tsx        — Booking: service selection → call-to-book flow
│   ├── confirmation/page.tsx   — Booking confirmed: service code, next steps
│   ├── pre-service/page.tsx    — Pre-service info for customer
│   ├── gallery/page.tsx        — Work portfolio with lightbox
│   ├── service-complete/       — Post-service feedback form (WhatsApp rating capture)
│   └── [privacy-policy, cookie-policy, terms-of-service]
│
├── components/
│   ├── EmergencyBanner.tsx     — Dismissible red top banner
│   ├── WhatsAppButton.tsx      — Fixed floating WhatsApp CTA
│   ├── Footer.tsx              — Site footer
│   ├── FAQAccordion.tsx        — Animated FAQ (Framer Motion, first item open by default)
│   ├── TestimonialsSection.tsx — 3-card review grid (El Seibo, Hato Mayor)
│   ├── ServiceAreaMap.tsx      — Coverage zone visualization
│   ├── CalendlyEmbed.tsx       — Calendly integration (selectedService: string | null prop)
│   ├── SEO.tsx                 — Structured data (LocalBusiness schema)
│   ├── ErrorBoundary.tsx       — Catches React render errors
│   ├── ui/ImageLightbox.tsx    — Full-screen gallery lightbox
│   └── redesign/               — Mobile CRO components (HeroCollage, CoverageMap, StickyThumbBar, etc.)
│
├── lib/
│   ├── analytics.ts            — PostHog `capture` wrapper
│   ├── site-branding.ts        — Logo path + brand constants
│   └── local-business-jsonld.ts — LocalBusiness structured data
├── types/index.ts              — ServiceType + service translations (no user/account types)
├── data/services.ts            — Service definitions
└── utils/cn.ts                 — classname utility
```

---

## Routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Landing page |
| `/booking` | Public | Service selection → call-to-book |
| `/pre-service` | Public | Pre-service questionnaire |
| `/confirmation` | Public | Booking confirmed + service code |
| `/gallery` | Public | Work portfolio |
| `/service-complete` | Public | Post-service feedback (WhatsApp rating capture) |

---

## Database (Supabase)

**Project URL:** `https://ncnbwaxtugvswavbrpck.supabase.co`

The live site does not read or write Supabase. The Supabase JS client is still in `package.json` and `.env.example` carries the project URL + anon key, but no server route or browser bundle in `src/` currently imports `@supabase/supabase-js`. Safe to remove on the next dependency pass.

The Ana-era tables (`ms_leads`, `ms_call_analysis`, `ms_prompt_versions`, `ms_weekly_insights`) were dropped on 2026-05-12 — see `supabase/migrations/20260512200000_drop_ms_tables.sql`. The earlier customer/technician tables were dropped on 2026-05-13 — see `supabase/migrations/20260513000000_drop_unused_tables.sql`.

---

## Environment Variables

```bash
# .env.local (gitignored — never commit)
NEXT_PUBLIC_SUPABASE_URL=https://ncnbwaxtugvswavbrpck.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# .env (committed — public config only)
NEXT_PUBLIC_APP_URL=https://multiservicios.app
NEXT_PUBLIC_APP_NAME=MultiServicios El Seibo
NEXT_PUBLIC_BUSINESS_PHONE=+18092514329
NEXT_PUBLIC_BUSINESS_WHATSAPP=+18092514329
NEXT_PUBLIC_BUSINESS_EMAIL=info@multiservicios.app
NEXT_PUBLIC_BUSINESS_ADDRESS=El Seibo, República Dominicana

# PostHog product analytics — independent of Supabase. Empty value disables silently.
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.posthog.com
```

---

## Business Details (for content accuracy)

| Field | Value |
|---|---|
| Business name | MultiServicios El Seibo |
| Owner/technician | Neno Báez |
| Experience | 15+ years |
| License | CDEEE (Dominican electricity authority) |
| Insurance | Civil liability policy |
| Rating | 4.9/5 (200+ reviews) |
| Projects | 1,000+ completed |
| Base | El Seibo, Rep. Dom. |
| Coverage | El Seibo and Hato Mayor (~35 km serviceable footprint, ~30 km apart) |
| Emergency | 24/7 including holidays, <30 min response |
| Regular hours | Mon-Sat 8am–6pm |

### Services & Guarantees
| Service | Response | Guarantee |
|---|---|---|
| Emergency | <30 min | 15 days |
| Repair | Same day / 24h | 45 days |
| Maintenance | 1–2 days scheduled | 60 days |
| Installation | Same/next day | 90 days |

**Pricing policy:** Never display specific prices on site. Evaluation is free if service is contracted. Neno quotes on-site.

---

## Common Patterns & Gotchas

### Framer Motion `useInView` for counters
```tsx
// MUST use these options or counters won't fire in overflow-hidden containers
const inView = useInView(ref, { once: true, amount: 0, margin: '0px 0px -80px 0px' })
```

### Display font on headings
```tsx
// Always use inline style for display font — Tailwind class alone won't work
<h1 style={{ fontFamily: 'var(--font-display)' }}>...</h1>
```

### Service card clicks → call-to-book flow
The booking page uses `AnimatePresence` with `selectedService` state. Clicking a card sets state, which triggers the step 2 "call to book" view. No Calendly — removed intentionally.

### CalendlyEmbed prop name
```tsx
<CalendlyEmbed selectedService={selected.id} />  // ← 'selectedService', NOT 'url' or 'serviceName'
```

### Auth store usage
```tsx
// CORRECT:
const { status, logout } = useAuthStore()
const isAuthenticated = status === 'authenticated'

// WRONG (doesn't exist):
const { isAuthenticated } = useAuthStore()
```

### `.next` cache corruption (Windows)
If you see `EPERM` errors or all `/_next/static/` files return 404:
```bash
taskkill //F //IM node.exe
rm -rf .next
npm run dev
```
Never run `npm run build` while dev server is running on Windows.

---

## Scripts

```bash
npm run dev      # development server (localhost:3000)
npm run build    # production build (stop dev server first on Windows!)
npm start        # serve production build
npm run lint     # ESLint
```

---

## Security Notes

### What's in place
- `.env.local` is gitignored — API keys never committed
- Next.js 15.5.12 — all known CVEs patched as of March 2026
- Supabase anon key is intentionally public (protected by Row Level Security)

### Known issues to fix before production
1. **Dev dependencies** — `flatted`, `glob`, `minimatch` have known CVEs; run `npm audit fix` before launch (dev-only, not production risk)

### Never commit
- `.env.local`
- Any file with `sk_`, `service_role`, or full JWT tokens

---

## Deployment (Vercel)

- Auto-deploys from `master` branch
- All `NEXT_PUBLIC_*` vars must be set in Vercel dashboard
- Domain: `multiservicios.app`

---

## Planned Features (Coming Soon)

| Feature | Status |
|---|---|
| Solar panel services | Coming soon (card on home page) |
| Generator/inverter services | Coming soon |
| Air conditioning | Coming soon |
| Plumbing | Coming soon |
