# CLAUDE.md — MultiServicios El Seibo

> Full context for AI-assisted development. Keep this file updated as the project evolves.

---

## Project Overview

**MultiServicios El Seibo** is a professional electrical services platform for Neno Báez, an electrician in El Seibo, Dominican Republic. Built with Next.js 15 App Router. Serves three audiences: customers booking services, Neno managing jobs, and an AI voice assistant (Ana) handling inbound calls and WhatsApp prequalification.

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
| AI Voice | ElevenLabs Conversational AI | Widget embed |
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
│   ├── layout.tsx              — Root layout: providers, fonts, ElevenLabs script, metadata
│   ├── globals.css             — Full design system CSS (~1100 lines)
│   ├── page.tsx                — Home page (hero, services, about, process, testimonials, FAQ, CTA)
│   ├── booking/page.tsx        — Booking: service selection → call-to-book flow
│   ├── confirmation/page.tsx   — Booking confirmed: service code, next steps
│   ├── pre-service/page.tsx    — Pre-service info for customer
│   ├── gallery/page.tsx        — Work portfolio with lightbox
│   ├── customer-dashboard/     — Protected: customer service history, warranties
│   ├── dashboard/              — Protected: technician job management
│   ├── account-creation/       — Account creation via service code
│   ├── service-complete/       — Post-service feedback form
│   └── [privacy-policy, cookie-policy, terms-of-service, notifications-test]
│
├── components/
│   ├── AuthModal.tsx           — Login/register modal (defaultTab: 'login' | 'register')
│   ├── ElevenLabsWidget.tsx    — AI voice widget (agentId optional, falls back to env var)
│   ├── EmergencyBanner.tsx     — Dismissible red top banner
│   ├── WhatsAppButton.tsx      — Fixed floating WhatsApp CTA
│   ├── Footer.tsx              — Site footer
│   ├── FAQAccordion.tsx        — Animated FAQ (Framer Motion, first item open by default)
│   ├── TestimonialsSection.tsx — 3-card review grid (El Seibo, Hato Mayor, Miches)
│   ├── ServiceAreaMap.tsx      — Coverage zone visualization
│   ├── CalendlyEmbed.tsx       — Calendly integration (selectedService: string | null prop)
│   ├── SEO.tsx                 — Structured data (LocalBusiness schema)
│   ├── ErrorBoundary.tsx       — Catches React render errors
│   ├── CustomerDashboard.tsx   — Customer service history + warranties
│   ├── TechnicianDashboard.tsx — Tech job management + earnings
│   ├── ui/ImageLightbox.tsx    — Full-screen gallery lightbox
│   └── notifications/         — NotificationBell, NotificationDemo
│
├── store/auth.ts               — Zustand auth store (persistent via localStorage)
├── contexts/NotificationContext.tsx — Real-time notifications via Supabase
├── hooks/useOptimizedAuth.ts   — Memoized auth selector
├── lib/supabase.ts             — Supabase client + all DB utilities
├── lib/serviceCode.ts          — Service code generation (MS-YYYY-XXXXX format)
├── types/index.ts              — All TypeScript interfaces
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
| `/service-complete` | Public | Post-service feedback |
| `/customer-dashboard` | Auth: customer | Service history, warranties |
| `/dashboard` | Auth: technician | Job management, earnings |
| `/account-creation` | Public | Register with service code |
| `/notifications-test` | Dev only | Test notification system |

---

## Authentication System

### Store: `src/store/auth.ts`
Zustand store with localStorage persistence.

```typescript
// How to use auth in components:
const { status, logout } = useAuthStore()
const isAuthenticated = status === 'authenticated'  // ← use this pattern, NOT isAuthenticated directly

// AuthModal props:
<AuthModal isOpen={bool} onClose={fn} defaultTab="login" | "register" />
// ↑ prop is 'defaultTab', NOT 'initialMode' or 'defaultMode'
```

**Status values:** `'loading' | 'authenticated' | 'unauthenticated'`

**Auth flow (server-side, bcrypt):**
1. User submits phone/email + password + user type
2. Store POSTs plaintext (over TLS) to `/api/auth/login` (`src/app/api/auth/login/route.ts`)
3. The route uses `SUPABASE_SERVICE_ROLE_KEY` to read `users`, then `verifyPassword` from `src/lib/password.ts` (bcryptjs, rounds=12)
4. If login returns 404 `user_not_found`, the store falls through to `/api/auth/register`, which bcrypt-hashes the password and inserts the user + matching profile row
5. The anon Supabase client no longer queries `users` for auth — the browser only sees the response (with `password_hash` stripped)
6. **Backward-compat:** legacy SHA-256 hex hashes (`isLegacyHash`) still verify on first login post-deploy, and the login route auto-rehashes the row to bcrypt — write happens server-side via the service-role key
7. There is no mock-auth fallback — failures fail closed with a friendly Spanish message
8. Session expires after 24 hours (client-side timer in the store)

**User types:** `customer` | `technician` | `admin`

### Account approval gate

New accounts created via `/api/auth/register` insert with `approval_status='pending'` and cannot log in until Neno approves them. The `/api/auth/login` route returns `403 { error: 'pending_approval' | 'rejected', message }` for blocked accounts and a friendly Spanish message that the AuthModal surfaces via the Zustand store's `error` field (no new auth status value — the union stays `loading | authenticated | unauthenticated`). Neno reviews and acts on the queue from `/admin`, which renders a "Solicitudes de cuenta pendientes" panel above the stats grid; Aprobar/Rechazar buttons call the bearer-token-guarded `/api/admin/users/pending` (GET) and `/api/admin/users/[id]/approval` (POST) routes. The migration that adds the column (`supabase/migrations/20260512100000_account_approval_gate.sql`) defaults existing rows to `'approved'` so the rollout doesn't lock anyone out — only NEW signups go through the gate.

---

## Database (Supabase)

**Project URL:** `https://ncnbwaxtugvswavbrpck.supabase.co`

### Key Tables
- `users` — all users (customers + technicians)
- `customer_profiles` — contact prefs, property type
- `electrician_profiles` — specializations, rating, availability
- `service_requests` — appointments/jobs with full lifecycle
- `service_warranties` — warranty records per service
- `notifications` — real-time notification inbox
- `availability_slots` — technician scheduling
- `service_codes` — MS-YYYY-XXXXX service codes

### Key Utilities in `lib/supabase.ts`
```typescript
getUser(id), getUserByPhone(phone)
getServiceRequests(filters), createServiceRequest(data), updateServiceRequest(id, updates)
getServiceWarranties(customerId), createServiceWarranty(data)
getNotifications(userId), markNotificationAsRead(id)
subscribeToServiceRequests(userId, callback)  // real-time
subscribeToNotifications(userId, callback)    // real-time
```

---

## Environment Variables

```bash
# .env.local (gitignored — never commit)
NEXT_PUBLIC_SUPABASE_URL=https://ncnbwaxtugvswavbrpck.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=agent_0201kksw7trqeqet5qzbtzm6nv6q

# .env (committed — public config only)
NEXT_PUBLIC_APP_URL=https://multiservicios.app
NEXT_PUBLIC_APP_NAME=MultiServicios El Seibo
NEXT_PUBLIC_BUSINESS_PHONE=+18095550123
NEXT_PUBLIC_BUSINESS_WHATSAPP=+18095550123
NEXT_PUBLIC_BUSINESS_EMAIL=info@multiservicios.app
NEXT_PUBLIC_BUSINESS_ADDRESS=El Seibo, República Dominicana
```

---

## ElevenLabs AI Agent (Ana)

**Agent ID:** `agent_0201kksw7trqeqet5qzbtzm6nv6q`
**Account email:** nationalliferegcenter@gmail.com
**Voice:** Sofía — Colombian accent, young, conversational (`b2htR0pMe28pYwCY9gnP`)
**LLM:** Gemini 2.5 Flash
**Language:** Spanish (`es`)
**Max call duration:** 600 seconds (10 min)

**What Ana does:**
- Greets inbound callers/web visitors in Caribbean Spanish
- Triages: emergency vs. scheduled service
- Collects: name, location, phone, problem description
- Answers FAQs: pricing policy (no prices given), coverage zone, hours, guarantees
- Closes: "Neno te llama en los próximos minutos"

**Widget placement:** Bottom-right, branded navy bg + yellow buttons
**Pages active:** `/` (home) and `/booking`

**ElevenLabsWidget component usage:**
```tsx
<ElevenLabsWidget />  // uses NEXT_PUBLIC_ELEVENLABS_AGENT_ID by default
<ElevenLabsWidget agentId="custom-id" />  // override if needed
```

**Manage agent:** https://elevenlabs.io/app/conversational-ai

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
| Coverage | 60 km radius: Miches (25km), Hato Mayor (30km), Los Llanos (35km), Sabana de la Mar (40km), Bayaguana (50km) |
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

### Utility Scripts (not committed)
- `scripts/update_agent.py` — Updates ElevenLabs agent prompt via API (contains API key, never commit)

---

## Security Notes

### What's in place
- `.env.local` is gitignored — API keys never committed
- Next.js 15.5.12 — all known CVEs patched as of March 2026
- Supabase anon key is intentionally public (protected by Row Level Security)

### Known issues to fix before production
1. ~~**Password hashing**~~ — DONE: moved to server-side bcryptjs (rounds=12) via `/api/auth/{login,register}`. Legacy SHA-256 hashes auto-rehash on first successful login.
2. **No CSP headers** — add Content-Security-Policy in `next.config.ts`
3. **Supabase RLS** — Row Level Security policies need to be enabled on all tables
4. **Dev dependencies** — `flatted`, `glob`, `minimatch` have known CVEs; run `npm audit fix` before launch (dev-only, not production risk)

### Never commit
- `.env.local`
- `scripts/update_agent.py` (contains ElevenLabs API key)
- Any file with `sk_`, `service_role`, or full JWT tokens

---

## Deployment (Vercel)

- Auto-deploys from `master` branch
- All `NEXT_PUBLIC_*` vars must be set in Vercel dashboard
- `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` must be set for Ana widget to work in production
- Domain: `multiservicios.app`

---

## Planned Features (Coming Soon)

| Feature | Status |
|---|---|
| ElevenLabs WhatsApp integration | Planning — Ana handles inbound WhatsApp |
| Solar panel services | Coming soon (card on home page) |
| Generator/inverter services | Coming soon |
| Air conditioning | Coming soon |
| Plumbing | Coming soon |
| Real phone number replace | Pending — placeholder `(809) 555-0123` throughout |
