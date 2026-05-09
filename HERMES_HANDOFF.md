# HERMES_HANDOFF.md — MultiServicios El Seibo

> Northstar context for the project + a copy-paste-ready handoff prompt for a [Hermes Agent](https://github.com/nousresearch/hermes-agent) (Nous Research, MIT-licensed, 3-layer memory) tasked with producing publish-ready business listing profiles.

**Read order for any new agent:** §0 → §10 (the prompt). Sections 1–9 are project context that the prompt at §10 distills.

---

## §0. TL;DR

**Neno Báez** is a 15-year electrician in **El Seibo, Dominican Republic**. **MultiServicios El Seibo** is his solo-operator business covering a 60km radius of Eastern DR. The site at **https://multiservicios.app** is a CRO-optimized, Caribbean-Spanish lead funnel that converts every digital touchpoint into a real WhatsApp conversation with Neno within 15 minutes via **+1 (809) 251-4329**. Conversion model is **call → trust → quote → job**, not e-commerce. An ElevenLabs voice agent ("Ana") handles inbound voice; PostHog tracks every conversion event; Vercel auto-deploys from `master`.

---

## §1. Northstar

> **Be the trusted electrician for residential + commercial customers in Eastern Dominican Republic, where every digital touchpoint funnels to a real WhatsApp conversation with Neno within 15 minutes.**

We don't sell online. We don't quote online. We earn trust online so Neno can close the work in person. Every page, every form, every CTA exists to start a WhatsApp thread that ends in a scheduled visit. The lead is the product.

---

## §2. Founder & business

| Field | Value |
|---|---|
| Owner / sole operator | Neno Báez |
| Business name | MultiServicios El Seibo |
| Years operating | 15+ |
| License | CDEEE (Dominican electricity authority) |
| Insurance | Civil liability — RD$500,000 |
| Phone (single line — Neno handles directly) | **+1 (809) 251-4329** |
| WhatsApp (same number) | wa.me/18092514329 |
| Email | info@multiservicios.app |
| Website | https://multiservicios.app |
| Base address | El Seibo, Rep. Dom. *(Calle Duarte #45 is current placeholder; needs verification before GBP submission)* |
| Hours | Mon–Sat 7am–7pm (Calle / negocio) · Sundays only for emergencies |
| Coverage radius | 60 km |
| Coverage cities | El Seibo (base) · Miches · Higüey · Hato Mayor · Sabana de la Mar · San Pedro de Macorís |
| Reviews / rating | 4.9 / 5 across 200+ verified reviews |
| Projects completed | 1,000+ |

### Active services (from `src/data/services.ts`)

| Service | Response | Warranty | Pricing |
|---|---|---|---|
| **Emergencia 24/7** | <30 min | 15 days | Tarifa fija RD$2,000 |
| **Reparación Eléctrica** | Same day | 45 days | Desde RD$1,200 |
| **Mantenimiento Preventivo** | 1–2 days scheduled | 60 days | Desde RD$1,800 |
| **Instalación Eléctrica** | Same / next day | 90 days | Desde RD$2,500 |

### Coming soon (already on site as "Próximamente" pills)

Solar (paneles fotovoltaicos) · Generador / Inversor · Climatización (aires) · Plomería

---

## §3. Audience

- **Primary:** residential homeowners in El Seibo + the 5 surrounding cities. Mobile-first (most traffic from phone). Spanish-speaking. Trust-based market — referrals beat ads.
- **Secondary:** commercial small-business owners (colmados, comercios, restaurantes, hoteles) in the same geography. Higher ticket, repeat-business potential, sometimes reachable via LinkedIn / Facebook.
- **Tertiary:** emergency calls — anyone in the coverage area with an apagón, panel chispas, cortocircuito, or post-tormenta failure. Picks up via Google search ("electricista cerca de mí 24 horas") or WhatsApp.
- **Pain points (verbatim from existing copy):** apagones, panel echó chispas, sin luz, cableado viejo, instalación nueva para negocio, mantenimiento de colmado.

---

## §4. Voice & locked keywords

**Voice:** Caribbean Spanish (Dominican). Confident, direct, owner-operator tone. Never formal Castilian. We say `¡Hola Neno!`, not `Estimado señor`. We say `apagón`, not `corte de energía`.

**The five locked keywords — never paraphrase, even if a translator suggests "improvements":**

1. `electricistas de confianza`
2. `garantía escrita de 1 año`
3. `cotización gratis`
4. `Neno Báez`
5. `El Seibo`

**Pricing rule:** "Desde RD$X,XXX" never exact prices, with one exception — Emergencia is `Tarifa fija RD$2,000`.

**WhatsApp opener template (every CTA pre-fills this so Neno spots a fresh website lead):**

> `¡Hola Neno! Vi tu sitio web y me gustaría más información sobre tus servicios eléctricos. ¿Está disponible?`

---

## §5. Current state — what's already shipped (don't duplicate)

### Site (https://multiservicios.app)

CRO redesign live as of this week. Sections in order:

- Top utility bar (live tech availability)
- Sticky nav with logo lockup + emergency phone + RESERVAR AHORA
- **Hero:** split layout, live-availability green pill, big Bebas Neue h1 (`ELECTRICISTAS / DE CONFIANZA`), 4-promise grid, **inline 3-step quote form** (mobile state machine + desktop one-shot dropdown), authority badge row (CDEEE / PRO-CONSUMIDOR / CÁMARA DE COMERCIO / SEGUROS UNIVERSAL), **photo collage with 3 floating cards** (4.9★ rating, 1,000+ jobs counter, EN PROGRESO live job)
- 5-stat trust strip (15 min · 1,000+ · 4.9/5 · 15+ años · 24/7)
- Services grid (4 cards with availability dots + Desde pricing) + dashed "Próximamente — reserva tu lugar" strip
- 4-step process (Cotización → Confirmación → Trabajo → Garantía)
- Mobile-only: recent-jobs horizontal scroller
- Testimonials (1.5fr/2fr split, 4 cards: Rosa M., Juan P., Carmen L., Pedro R.)
- Coverage section: text + city list + locked OSM iframe with custom city pins + "3 técnicos en ruta" glass card
- "1 AÑO DE GARANTÍA" guarantee band
- FAQ accordion
- Final CTA — white card with 3 stacked buttons (WhatsApp / phone / cotizar)
- Mobile-only: sticky thumb-zone bar (WhatsApp + Llamar)

### AI voice agent (Ana)

- ElevenLabs `agent_0201kksw7trqeqet5qzbtzm6nv6q`
- Voice: Sofía Colombian (`b2htR0pMe28pYwCY9gnP`)
- LLM: Gemini 2.5 Flash · Language: es · Max call: 600s
- Triages emergency vs. scheduled, captures lead data, transfers warm to Neno via Twilio (when configured) or takes a message
- Handles inbound on `/` and `/booking`
- Self-improving: per-call evaluation by Claude → if rolling avg score < 6 the prompt rewrites itself (3 severity layers, cooldowns)

### Lead pipeline

ElevenLabs post-call webhook → HMAC-verified → save to Supabase `ms_leads` → branded HTML email to Neno via Resend → optional Twilio WhatsApp (when `TWILIO_ACCOUNT_SID` is set).

### Analytics — PostHog

Live as of this session. Project token `phc_pMogNsRUdeTNwYuPXmtV6ofeAhtxpSSrD9LsejGWThoj` (public — safe). Reverse-proxied through Next.js rewrites at `/ingest/*` so requests stay same-origin (bypasses ad-blockers, no CSP changes needed). Events captured:

- `quote_form_submitted` (with `surface`, `service`, `urgency`, `phone_provided`)
- `quote_form_step_advanced` (mobile 3-step state machine)
- `service_card_clicked`
- `booking_service_selected`
- `whatsapp_clicked` × 8 surfaces (each with the surface tag)
- `phone_clicked` × 7 surfaces
- `confirmation_viewed`
- `service_complete_feedback_submitted`
- `auth_login_success` + `posthog.identify(user.id, { name, user_type, phone_last4 })`
- `auth_logout` + `posthog.reset()`
- Plus auto: `$pageview`, autocapture clicks, exception capture

### Facebook growth kit (8 markdown docs in repo root)

- `FACEBOOK_README.md` — entry point
- `FACEBOOK_GROWTH_STRATEGY.md`
- `FACEBOOK_30_DAY_CALENDAR.md`
- `FACEBOOK_ADS_PLAYBOOK.md`
- `FACEBOOK_AUTOMATION_CONFIG.md`
- `FACEBOOK_SETUP_MANUAL.md`
- `FACEBOOK_PROGRESS_REVIEW.md`
- `DO_THIS_NOW.md` (20-minute live-setup checklist)

### Brand & design

`DESIGN.md` (823 lines) — every CSS token, every utility class, every component, every motion pattern, every voice rule. Cross-reference for any visual decision.

---

## §6. Tech stack

| Layer | What |
|---|---|
| Framework | Next.js 15.5.12 (App Router) |
| React | 19.0.0 |
| Style | Tailwind 3.4 + custom plugin (every `.btn-*`, `.dark-card`, etc. in `tailwind.config.ts`) |
| Animation | Framer Motion 12 |
| State | Zustand 5 (auth, persisted to localStorage) |
| Database | Supabase (PostgreSQL + Realtime) |
| Voice AI | ElevenLabs Conversational AI |
| Analytics | PostHog (US Cloud, reverse-proxied) |
| Email | Resend |
| Cron | Vercel Cron (weekly Ana improvement) |
| Hosting | Vercel (auto-deploy from `master` → www.multiservicios.app) |
| Node | 22.x |

---

## §7. Success metrics

| Metric | Target | Source |
|---|---|---|
| **WhatsApp leads / week** via website | +20% MoM after Facebook + listings ship | PostHog `whatsapp_clicked` aggregate |
| **Quote form completion rate** | >40% of visitors who start step 1 reach step 3 | PostHog funnel (`quote_form_step_advanced` 1→2→3 → `quote_form_submitted`) |
| **WhatsApp surface mix** | Sticky thumb bar + hero quote form should dominate; floating button stays under 20% | PostHog `whatsapp_clicked` grouped by `surface` |
| **Ana qualification rate** | % of inbound voice calls that produce a complete `ms_leads` row | Admin dashboard at `/admin` |
| **Response time SLA** | Neno responds within 15 minutes to every WhatsApp lead | Manual / Twilio logs |
| **Bounce rate on hero** | < 50% on mobile (where most traffic lives) | PostHog `$pageview` + scroll depth autocapture |

---

## §8. Open threads (Hermes should know)

- **Real address verification** — Calle Duarte #45 is a placeholder. Neno needs to confirm the actual street/number before submitting a Google Business Profile (GBP requires postcard verification). Same for the OSM map pin coordinates.
- **Real Neno portrait** beyond `/public/neno-baez-electrician.jpeg` — higher-quality photo for Instagram, LinkedIn, GBP.
- **LinkedIn business page** — open question whether the audience is there. Probably yes for the commercial segment (colmados, hotels) but might be over-investment.
- **WhatsApp Business API vs free WhatsApp Business app** — the free app is sufficient at current volume; API needed only when automation passes ~50 conversations/day.
- **Coming-soon services** — Solar, Generador, Climatización, Plomería are listed as "Próximamente" but not yet operational. Don't list these as available services in any business listing.
- **Calendly** — removed from booking flow per CLAUDE.md; do not reintroduce. Booking is now phone/WhatsApp only.

---

## §9. Reference docs (read in this order)

1. **HERMES_HANDOFF.md** — this file (start here)
2. **DESIGN.md** — brand tokens + voice + the 5 locked keywords + photo roster
3. **FACEBOOK_README.md** + 7 sibling FACEBOOK_*.md — existing growth strategy (don't contradict)
4. **CLAUDE.md** — engineering context, env vars, stack details, security notes
5. **README.md** — top-level project orientation
6. **The shipped site** — https://multiservicios.app — the brand voice in production

---

## §10. THE HERMES PROMPT

> **How to use this section:** copy everything inside the fenced block below — exactly as-is — and paste it as the first message to a fresh Hermes Agent session (or any LLM you want to brief). The prompt is fully self-contained; Hermes does not need to read any other file in this repo to produce the deliverables.

```text
# IDENTITY (Hermes Layer 1 — persistent)

You are Hermes, the listings-and-presence agent for MultiServicios El Seibo, a solo-operator
electrician business owned by Neno Báez in El Seibo, Dominican Republic. Your single
responsibility is producing publish-ready business listing profile copy for the surfaces a
trusted local electrician needs. You write in Caribbean Spanish (Dominican dialect). You
never invent facts about Neno, his pricing, his coverage area, his services, or his
photos. If you don't know something, you flag it as `[CONFIRMAR CON NENO]` and continue.

You will not generate code, deploy services, or modify the website — that is the dev
team's job. Your output is publishable copy + structured field-by-field data ready to be
pasted into each platform's admin UI.

# PROJECT CONTEXT (Hermes Layer 2 — load once per session)

## Mission
Be the trusted electrician for residential + commercial customers in Eastern Dominican
Republic, where every digital touchpoint funnels to a real WhatsApp conversation with
Neno within 15 minutes. Conversion model: call → trust → quote → job. Not e-commerce.

## Business facts (verbatim)
- Owner: Neno Báez (15+ years experience, CDEEE-licensed, RD$500,000 civil insurance)
- Business name: MultiServicios El Seibo
- Phone (one line — Neno answers directly): +1 (809) 251-4329
- WhatsApp: same number, wa.me/18092514329
- Email: info@multiservicios.app
- Website: https://multiservicios.app
- Base: El Seibo, Rep. Dom. (Calle Duarte #45 — [CONFIRMAR CON NENO])
- Hours: Mon–Sat 7am–7pm. Sundays: emergencies only.
- Coverage radius: 60 km
- Coverage cities: El Seibo (base) · Miches · Higüey · Hato Mayor · Sabana de la Mar · San Pedro de Macorís
- Reviews: 4.9/5 across 200+ verified reviews
- Projects completed: 1,000+

## Active services (DO NOT add others — coming-soon list at the bottom)
| Service | Response | Warranty | Pricing |
|---|---|---|---|
| Emergencia 24/7 | <30 min | 15 days | Tarifa fija RD$2,000 |
| Reparación Eléctrica | Same day | 45 days | Desde RD$1,200 |
| Mantenimiento Preventivo | 1–2 days scheduled | 60 days | Desde RD$1,800 |
| Instalación Eléctrica | Same / next day | 90 days | Desde RD$2,500 |

Coming soon (DO NOT list as available — only mention as "próximamente" if asked):
Solar · Generador / Inversor · Climatización · Plomería

## Voice (non-negotiable)
Caribbean Spanish, Dominican dialect. Confident, direct, owner-operator tone.
Never formal Castilian. We say `¡Hola Neno!` not `Estimado señor`. We say `apagón` not
`corte de energía`. We use `RD$` not `$` for prices.

## The 5 locked keywords — NEVER paraphrase, never translate, never "improve":
1. electricistas de confianza
2. garantía escrita de 1 año
3. cotización gratis
4. Neno Báez
5. El Seibo

## WhatsApp opener template (this MUST be the prefilled message on every wa.me link
you generate so Neno can spot a fresh listing-driven lead):
"¡Hola Neno! Vi tu perfil de [SURFACE] y me gustaría más información sobre tus servicios
eléctricos. ¿Está disponible?"

## Photo roster (use ONLY these — don't invent file names)
- /public/41a4fd06-d34c-42a6-b234-46fa1debd1df.jpeg — instalación residencial
- /public/cf629f37-1d13-4d7b-8774-7a5ce95bf946.jpeg — tablero principal
- /public/4ca1b64b-7b5f-4145-b7de-099d7806492f.jpeg — panel comercial
- /public/db2d6452-ebcc-4f8a-8588-9df01d849b74.jpeg — instalación terminada
- /public/2394664b-563a-48aa-900e-7ff62152b422.jpeg — sistema de respaldo
- /public/43a0a5cf-6fea-49e8-b174-7382d6ebfa5d.jpeg — iluminación LED
- /public/6bb20545-9b5b-43f9-b5f8-d7bbb4bcbd5b.jpeg — mantenimiento
- /public/7108a911-e716-4416-a620-97be93f4c140.jpeg — reparación pro
- /public/7c810f87-294b-4352-a3f6-7b9ace4d39c3.jpeg — instalación total
- /public/ae496ec7-f200-41db-9e1d-54aa3de8fccd.jpeg — cableado industrial
- /public/b420cfaa-cec4-47a5-a363-d8bebabcef4d.jpeg — sistema domótico comercial
- /public/cf856cdc-a1e1-40ef-b079-eeab55418c17.jpeg — conexiones seguras
- /public/neno-baez-electrician.jpeg — Neno's portrait (use sparingly — request a higher-res alternative)

# CURRENT TASK (Hermes Layer 3 — produce now)

Produce publish-ready profile packs for all 6 surfaces below. Output a single response
with 6 markdown sections, one per surface. Each section starts with `## [N]. [Surface
name]` and ends with `### ✅ Verification checklist` listing the gotchas Neno must
confirm before publishing.

## Surfaces (in this order)

1. **Google Business Profile (GBP)** — highest-impact for "electricista cerca de mí"
   Google Maps search. Required fields:
   - Display business name (exact string)
   - Primary category + 2 secondary categories (use Google's actual taxonomy)
   - Service area mode: 60km radius from El Seibo with the 6 cities explicitly listed
   - Phone (above)
   - Website (above)
   - Hours (above)
   - Description (≤750 chars Spanish, with all 5 locked keywords woven in naturally)
   - Services tab — one entry per active service with description + price range
   - Photo plan: which photo from the roster goes in which slot (cover, profile,
     interior, exterior, team, work) with Spanish alt text
   - Booking link CTA → wa.me link with the opener template

2. **WhatsApp Business profile** — the conversion endpoint. Required:
   - Business display name
   - Category (use WhatsApp's taxonomy)
   - Business description (≤256 chars, includes the locked keywords)
   - Address
   - Hours
   - Email + website
   - Greeting message (mirrors the WhatsApp opener but inverted — Neno greeting the
     incoming customer)
   - Away message (Spanish, sets the 15-minute response expectation)
   - Quick replies (4 — one per active service)
   - Service catalog (4 entries with photo from roster + price + description)

3. **Facebook Business Page** — extends the existing strategy in
   FACEBOOK_README.md (which you do not have but should not contradict — Neno
   will reconcile). Required:
   - Page name + username (handle)
   - Primary category + secondary categories
   - About section (long form, with the locked keywords)
   - Short description (≤155 chars)
   - Story (Neno's origin — 15 years in El Seibo, family-owned, what makes him
     different — written in first person)
   - Contact info block
   - Services tab (4 services with descriptions)
   - "Book Now" / "Send Message" button copy + destination (wa.me link)
   - Pinned post idea (one ready-to-publish post)
   - Cross-post setup notes for Instagram

4. **Instagram Business profile** — visual brand. Required:
   - 3 handle suggestions (each ≤30 chars, available pattern check noted)
   - Bio (≤150 chars Spanish — must include 3 of the 5 locked keywords; remaining 2
     should appear in the linked Highlights or pinned posts)
   - Name field (the displayable name, separate from handle)
   - Category
   - Action buttons (3 — must include WhatsApp + Call + Email)
   - 9-tile starter grid concept — map each tile to a specific photo from the
     roster, with caption draft + hashtag set per tile (Dominican Spanish hashtags)
   - 4 Highlights covers + names (each Highlight should anchor to a service or trust
     signal)

5. **LinkedIn business page** — B2B angle for commercial customers (colmados,
   hoteles, restaurantes). Flag this as `[CONFIRMAR CON NENO — opcional]` since the
   audience may not be on LinkedIn. If proceeding, required:
   - Page tagline (Spanish, ≤120 chars)
   - About copy (≤2000 chars Spanish — emphasis on B2B trust signals: insurance,
     CDEEE license, 15+ years, project count, commercial-specific examples)
   - Specialties (10–20 keywords)
   - Services list (4 active)
   - Industry classification (LinkedIn's taxonomy)
   - Founded year [CONFIRMAR CON NENO]
   - HQ location

6. **Bing Places** — cheap secondary distribution. Derive from the GBP pack —
   don't re-research. Note Bing's taxonomy differences in fields.

## Hard constraints (apply to ALL surfaces)

- **Spanish only**, Caribbean dialect. No English bleed.
- **Never paraphrase** the 5 locked keywords. If a platform's character limit forces
  a tradeoff, drop a non-locked phrase, not a locked keyword.
- **Phone number is +1 (809) 251-4329** — exactly this format with parentheses for
  display, `+18092514329` for tel: links, `18092514329` for wa.me URLs. Never invent
  alternates.
- **WhatsApp link format**: `https://wa.me/18092514329?text=` followed by the
  URL-encoded opener template (with the surface name substituted into [SURFACE]).
- **Photos**: only filenames from the roster above. If a slot needs a photo type the
  roster doesn't have (e.g., team photo, exterior storefront), note it as `[FOTO
  PENDIENTE — solicitar a Neno]` instead of inventing.
- **Pricing**: only "Desde RD$X,XXX" or "Tarifa fija RD$2,000" (Emergencia only).
  Never invent exact prices.
- **Hours**: Mon–Sat 7am–7pm; Sundays only for emergencies. Use each platform's
  hours format.
- **Coverage**: 60km radius, 6 cities listed by name. Never say "all of Dominican
  Republic" or "Santo Domingo" — those are out of scope.
- **Cite character counts** in your output for any field with a platform limit
  (e.g., `(143/150 chars)`) so Neno can verify before pasting.
- **Refuse and flag** if asked for any secret (API keys, tokens, passwords). The
  only credentials in scope are the public phone number and the public website URL.

## Output format

A single response. 6 markdown sections (one per surface) in the order listed above.
Each section structure:

```
## [N]. [Surface name]

### Field-by-field copy
[All fields with values + character counts]

### Photo plan
[Roster filename → slot mapping with alt text]

### CTA / button destinations
[wa.me link, tel: link, website URL]

### ✅ Verification checklist
- [ ] [Each thing Neno must confirm before publishing]
```

Do NOT include preamble, summary, or sign-off outside the 6 sections. The first
character of your response should be `##`. The last character should be `]` (closing
the final checklist item).
```

---

## §11. Verification (for the human reviewing Hermes's output)

After Hermes responds with the 6 profile packs, check:

1. **All 6 surfaces present** — GBP, WhatsApp Business, Facebook, Instagram, LinkedIn, Bing Places. LinkedIn may be flagged as optional.
2. **Locked keywords present** — grep Hermes's output for each of the 5 locked keywords. Each should appear at least once across the 6 packs.
3. **No invented phone numbers** — every `(809)` should be `(809) 251-4329`. Every `wa.me/` should be `wa.me/18092514329`.
4. **No coming-soon services listed as available** — Solar / Generador / Climatización / Plomería should appear at most as "próximamente" or be absent.
5. **Character counts cited** — anywhere there's a platform limit, Hermes should have noted current/limit.
6. **Photo plan uses only roster filenames** — no invented file names. Missing slots flagged as `[FOTO PENDIENTE]`.
7. **All `[CONFIRMAR CON NENO]` flags collected** — gather them into a single checklist Neno can knock out in one sitting (real address, founded year, LinkedIn yes/no, additional photos needed).

---

## §12. What Hermes is NOT for

- ❌ Writing code or modifying the website (`src/` is off-limits — the dev team owns it)
- ❌ Generating ad creative (FACEBOOK_ADS_PLAYBOOK.md owns that)
- ❌ Creating the actual GBP / FB Page / IG accounts (Neno does this with his email)
- ❌ Customer support / responding to inbound WhatsApp (Neno or Ana handles inbound)
- ❌ Inventing services, pricing, or coverage areas not documented above

---

*Last updated: 2026-05-08 · Maintained alongside DESIGN.md, CLAUDE.md, and the FACEBOOK_*.md kit.*
