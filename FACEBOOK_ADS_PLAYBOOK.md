# Facebook Ads Playbook — Lead-Gen for MultiServicios El Seibo

This is your repeatable system to turn ad spend into booked jobs.

**Where to do this:** Meta Ads Manager → https://www.facebook.com/adsmanager

---

## ⚠️ Pre-flight checklist (do FIRST, in order)

Don't skip these or you'll waste ad spend:

1. **Page is fully optimized** — see `FACEBOOK_SETUP_MANUAL.md`
2. **Auto-replies configured** — see `FACEBOOK_AUTOMATION_CONFIG.md` (so leads don't hit a wall)
3. **Meta Pixel installed** on multiservicios.app — track conversions
4. **Domain verified** in Business Manager (Settings → Domains → Add `multiservicios.app`)
5. **Conversions API (CAPI)** set up — iOS-safe tracking, doubles signal quality
6. **Payment method added** in Ads Manager (credit card for billing)
7. **First 5–10 organic posts published** — Meta penalizes ads on empty pages
8. **WhatsApp Business is connected** to the page (action button works)
9. **At least 1 admin backup** on the page (in case account gets restricted)

Once those 9 items are checked, you're ready.

---

## Campaign 1 — Click-to-WhatsApp (the workhorse)

**Why this campaign first:** Highest ROI for local services. Skips the website entirely. Sends people from ad → WhatsApp conversation with you (or with Ana, the AI).

### Settings

**Objective:** Engagement → Messages
**Performance goal:** Maximize number of conversations
**Messaging app:** WhatsApp
**Pixel/CAPI:** ON

### Audience

**Location:**
- Drop a pin on El Seibo, Dominican Republic
- Radius: **30 km** (covers El Seibo, Miches, Hato Mayor, Los Llanos, parts of Sabana de la Mar)
- Set "People living in this location" (not "people recently in")

**Age:** 25–65
**Gender:** All
**Languages:** Spanish

**Detailed targeting (interests):**
- Home improvement
- DIY (do it yourself)
- Real estate
- Property
- Solar power (high-intent, often correlates with electrical work)
- Air conditioning
- Generators

**Behaviors:**
- Engaged with electricity-related content
- Small business owners
- Frequent travelers (often own multiple properties)

**Detailed targeting expansion:** ON (let Meta find lookalikes)

### Budget

**Start:** $5/day, run for 7 days = $35
**If results are good after 7 days** (cost per conversation < $2): scale to $10/day
**If still good after 14 days:** scale to $15–20/day

**Don't increase by more than 20% every 3 days** — Meta's algorithm needs time to re-optimize.

### Creative — 3 ads in rotation

#### Ad 1 — Reel of Neno fixing a panel
**Format:** Single video (Reel-style, vertical 9:16, 15–30 sec)
**Hook (first 1.5 sec):** Close-up of burning panel, dramatic music. Text: "Si tu panel hace ESTO, llámame."
**Body:** Quick cuts of: Neno arriving in truck → diagnosing → installing new panel → satisfied customer.
**End card:** Logo + "📲 (809) 251-4329 — Emergencias 24/7"

**Primary text (caption above the ad):**
```
🚨 ¿Tu panel eléctrico te da problemas? No esperes a que se queme.

⚡ Electricista licenciado en El Seibo. 15+ años de experiencia.
✅ Emergencias 24/7
✅ Garantía hasta 90 días
✅ Evaluación GRATIS

Cubrimos El Seibo, Miches, Hato Mayor, Los Llanos, Sabana de la Mar y Bayaguana.

Escríbenos al WhatsApp 👇
```

**Headline:** Electricista en El Seibo - Emergencias 24/7
**Description:** Garantía hasta 90 días. Evaluación gratis.
**CTA button:** Send WhatsApp (Enviar WhatsApp)

#### Ad 2 — Carousel of before/afters
**Format:** Carousel, 5 cards
**Card 1 cover:** Big yellow "ANTES Y DESPUÉS" with Neno's photo
**Cards 2–4:** Real before/after photos of jobs
**Card 5:** "📲 (809) 251-4329" + Send WhatsApp button

**Primary text:**
```
Trabajos reales que hicimos esta semana en El Seibo y zonas cercanas.

Si tu instalación eléctrica necesita atención, escríbenos. Te visitamos sin compromiso. Evaluación gratis si contratas.

📲 (809) 251-4329
```

#### Ad 3 — Static image, testimonial-driven
**Format:** Single image (1080×1080)
**Image:** Photo of Neno smiling next to a customer at a finished job site, big yellow "⭐⭐⭐⭐⭐" overlay, customer quote text:
> "Llegó rápido, trabajó limpio, y me explicó todo. Lo recomiendo a quien sea." — Doña Carmen, El Seibo

**Primary text:**
```
✨ "Llegó rápido, trabajó limpio, y me explicó todo. Lo recomiendo a quien sea." — Doña Carmen, El Seibo

Servicio eléctrico de confianza en El Seibo y la zona.

⚡ 15+ años de experiencia
✅ Garantía por escrito
✅ Emergencias 24/7

📲 WhatsApp: (809) 251-4329
```

### Pre-filled WhatsApp message (the conversion lever)

When someone clicks the WhatsApp CTA, this message auto-populates so they just hit send:
```
Hola Neno, vi su anuncio en Facebook y necesito un electricista. Mi situación es:
```

This works because:
- Customer doesn't have to think what to write
- Includes ad-source attribution (you know it came from Facebook)
- Opens the conversation naturally

### KPIs to track (weekly)
- **Cost per WhatsApp conversation:** target <$2 (good), <$1 (great)
- **Conversation → booked job rate:** target 20–40%
- **Cost per booked job:** target <$15 (good), <$8 (great)
- **CTR (click-through rate):** target >2.5%

### When to pause an ad
- CTR drops below 1%
- Cost per conversation goes above $5
- Frequency above 3.5 (people seeing the ad too often → fatigue)
- 5+ days without conversions

When you pause, swap in a new creative. The audience doesn't need to change, just refresh the visual.

---

## Campaign 2 — Page Likes / Awareness

**Why:** Builds your follower base (social proof). Low cost. Foundation for retargeting.

### Settings
**Objective:** Awareness → Page likes
**Performance goal:** Maximize new page likes

### Audience
Same geo (30 km El Seibo), age 25–65, Spanish.
Broader interests: Home, family, DIY, real estate. Detailed targeting expansion ON.

### Budget
**$3/day for 30 days = $90**

### Creative — 1 ad
**Format:** Carousel, 5 cards
- Card 1: Brand intro — "MultiServicios El Seibo" + tagline
- Card 2: Photo of Neno + 15+ years
- Card 3: Coverage map
- Card 4: 5-star reviews collage
- Card 5: WhatsApp CTA

**Goal:** 1,000 page likes in 30 days. Used as warm audience for Campaign 3 retargeting.

---

## Campaign 3 — Lead Form (instant lead capture)

**Why:** For non-emergency leads. Captures name, phone, problem in 30 sec. They never leave Facebook.

### Settings
**Objective:** Leads
**Performance goal:** Lead form completions
**Form type:** Instant Form
**Form name:** El Seibo Lead Capture

### Form fields
1. **Name** (auto-filled from FB profile)
2. **Phone** (auto-filled)
3. **¿Qué problema tienes?** (dropdown)
   - Emergencia
   - Reparación
   - Instalación nueva
   - Mantenimiento / inspección
   - Iluminación
   - Otro
4. **¿En qué zona estás?** (dropdown — your 6 cities)
5. **Privacy policy URL:** https://multiservicios.app/privacy-policy

### Form intro screen
**Headline:** ⚡ Electricista en El Seibo - Te respondemos en minutos
**Body:** Déjanos tus datos y te llamamos para coordinar. Evaluación gratis si contratas. Sin compromiso.

### Form completion screen
**Headline:** ¡Gracias! Te llamamos pronto.
**Body:** Mientras tanto, agréganos en WhatsApp para respuesta más rápida.
**CTA:** View Website → multiservicios.app
**Or:** Send WhatsApp → (809) 251-4329

### Audience
Same as Campaign 1 (30 km El Seibo, 25–65).

### Budget
**$5/day for 14 days = $70** (test phase). Scale if cost per lead is good.

### KPIs
- Cost per lead: target <$3
- Lead → booked job rate: target 25–40% (you'll need to call them within 1 hour)

### Critical: lead automation
**Set up Zapier (or n8n) to:**
1. Watch Meta Lead Ads inbox
2. On new lead → POST to your Supabase `service_requests` table via REST API
3. Send Neno a WhatsApp notification with the lead details
4. Send the customer an auto-WhatsApp via your business number

The lead is COLD in 5 minutes. Get to them in <60 seconds and your conversion doubles.

---

## Campaign 4 — Retargeting (after 60 days)

**Why:** People who visited multiservicios.app and didn't book are 5x more likely to convert than cold traffic.

### Audiences to create
1. **Website visitors last 30 days** (Pixel)
2. **Engaged with FB page last 30 days**
3. **Watched 50%+ of any video ad**
4. **Lookalike of converted customers (1%)** — once you have 100+ leads in Supabase

### Creative
Different from cold ads. Use:
- Direct testimonials
- Urgency: "Esta semana solamente — cita rápida disponible"
- Specific: "¿Aún no contrataste a tu electricista? Aquí estamos."

### Budget
$5/day across all retargeting audiences combined.

---

## Spend ramp plan (first 90 days)

| Week | Total daily spend | Allocation |
|---|---|---|
| 1 | $13/day | $5 WhatsApp + $3 Likes + $5 Lead form |
| 2–4 | $13/day | Same — gather data |
| 5–8 | $25/day | Scale winners + add retargeting |
| 9–12 | $40/day | Refine, kill losers, double down |

**Total 90-day investment:** ~$2,000–2,500 USD
**Expected return (conservative):** 80+ booked jobs at $50–500 average = $4,000–40,000 revenue

**The math works because:** electrical jobs have high ticket sizes. Even if 90% of leads don't convert, the 10% who do pay for everything 5x over.

---

## Creative refresh schedule

**Every 14 days, replace 1 of your 3 active creatives.**

Sources for new creative:
- Real jobs that week (before/after photos)
- New customer testimonials
- Reels you posted organically that performed well (boost the best)
- Trending Dominican audio + your B-roll

**Never let an ad run beyond 30 days without refresh.** Frequency creep kills CTR.

---

## Compliance — don't get banned

Meta's ad policy is strict for trades. Watch out for:

❌ **Don't use:** "Best electrician in DR", "Cheapest", "Guaranteed lowest price" — Meta auto-rejects superlative claims.

❌ **Don't use:** specific prices in copy. Your business model is "free evaluation, on-site quote" — keep ads aligned with that.

❌ **Don't show:** scary/dangerous content (electrocutions, fires, gore). Meta restricts. Use mild "if your panel is doing X, call us" framing.

❌ **Don't target:** by religion, political affiliation, health condition. Use property/home interests only.

✅ **Do use:** specific facts ("15 years", "1,000 jobs", "CDEEE licensed", "200+ reviews"). Specifics convert and don't trigger compliance flags.

✅ **Do use:** "evaluation gratis si contratas" — this offer is compliant and converts.

---

## Tracking & reporting cadence

### Weekly (Sunday review, 30 min)
- Open Ads Manager
- Compare last 7 days to previous 7
- Identify winning creative (highest CTR, lowest CPL)
- Pause anything below threshold
- Plan next week's creative refresh

### Monthly (1st of month, 90 min)
- Generate full month performance report
- Calculate cost per booked job (cross-reference with Supabase)
- Decide budget for next month
- Refresh audience targeting based on which segments converted best

---

## Emergency: account got restricted

If you wake up to "Account restricted" notification:
1. Don't panic.
2. Don't create a new account — that compounds the issue.
3. Go to: https://www.facebook.com/accountquality
4. Read the specific reason for restriction
5. Submit appeal (one-time, choose words carefully)
6. Wait 1–7 days for review

**Common causes & fixes:**
- "Suspicious activity" → usually login from new device. Confirm it was you.
- "Policy violation" → review the flagged ad. Often it's a single word ("guaranteed", "best"). Edit and resubmit.
- "Payment issue" → re-verify card.

**While restricted:** Your organic page still works. Keep posting, keep engaging. Just no ads until lifted.

---

## ✅ Final checklist before launch

- [ ] Pre-flight 9 items all checked
- [ ] Payment method added in Ads Manager
- [ ] Pixel firing on multiservicios.app (verify with Pixel Helper extension)
- [ ] Domain verified
- [ ] Custom audiences created (page engagers, video watchers, website visitors)
- [ ] Lead form built and tested
- [ ] WhatsApp button works on the page
- [ ] Auto-replies configured (so leads don't hit a wall)
- [ ] At least 5 organic posts published in the last 14 days
- [ ] Daily budget set to start small ($5–13/day)
- [ ] Spend cap set on the campaign (so you don't get a surprise bill)

When all checked → launch Campaign 1. Wait 7 days before judging. Trust the data, not feelings.
