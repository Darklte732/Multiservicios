# DESIGN.md — MultiServicios El Seibo

This is the project's **design source of truth**. If two docs disagree about a token, class, or pattern, this file wins. Update it whenever you ship a new component, a new color, a new motion pattern, or a change to a design rule.

For the **why** behind the redesign (the original CRO brief), see `CLAUDE_CODE_HANDOFF.md` if you have access — that document is canonical for *intent*. This file is canonical for *implementation*.

---

## Table of contents

0. [Source of truth](#0-source-of-truth)
1. [Brand](#1-brand)
2. [Color tokens](#2-color-tokens)
3. [Typography](#3-typography)
4. [Spacing & radii](#4-spacing--radii)
5. [Shadows & glows](#5-shadows--glows)
6. [Buttons & CTAs](#6-buttons--ctas)
7. [Cards & containers](#7-cards--containers)
8. [Components catalog](#8-components-catalog)
9. [Iconography](#9-iconography)
10. [Imagery](#10-imagery)
11. [Motion](#11-motion)
12. [Responsive](#12-responsive)
13. [Voice & copy](#13-voice--copy)
14. [Map (special case)](#14-map-special-case)
15. [Anti-patterns](#15-anti-patterns)

---

## 0. Source of truth

| File | Role |
|---|---|
| **`DESIGN.md`** (this file) | Canonical reference. Engineers read this first. |
| `src/app/globals.css` | All `:root` CSS variables + all custom utility classes. The values in §2–§7 of this doc are pulled from here verbatim. |
| `tailwind.config.ts` | Tailwind extensions (custom colors, fontFamily, animations, keyframes, plugins). Custom plugin generates the design-system utility classes (`.dark-card`, `.btn-electric`, etc.). |
| `src/app/layout.tsx` | Google Fonts `<link>` for Bebas Neue + Barlow Condensed. |
| `next.config.ts` | CSP rules. The design depends on `style-src https://fonts.googleapis.com`, `font-src https://fonts.gstatic.com`, `frame-src https://www.openstreetmap.org`. Don't tighten these without a fallback plan. |
| `src/components/redesign/*` | The five CRO components that embody §8. Read these to see the patterns in action. |
| `CLAUDE.md` | Project-level engineering notes. Has a brief design block — treat it as a pointer to this file. |

**Update rules**

- New CSS variable → add to §2 / §3 / §5 with its purpose.
- New utility class → add to §6 / §7 with code excerpt + when-to-use.
- New component → add to §8 with file path, prop contract, and what NOT to do.
- New WhatsApp surface → add to the table in §13.
- New anti-pattern discovered in code review → add to §15 with the canonical replacement.

---

## 1. Brand

**Audience.** Customers in El Seibo and the Eastern Dominican Republic — residential homeowners, commercial small-business owners (colmados, comercios), and emergency callers. Not bilingual office professionals; not US-based remote buyers.

**Voice.** Confident, direct, local. Caribbean Spanish (Dominican). Not formal Castilian. We say `¡Hola Neno!`, not `Estimado señor`. We say `apagón`, not `corte de energía`.

**Owner identity.** This is **Neno Báez's** business, not a faceless brand. The site mentions Neno by name on every customer-facing page. The pre-populated WhatsApp templates greet him directly (`¡Hola Neno!`). Don't redesign in a way that hides who's actually doing the work.

**Spanish-only content rule.** Every visible string is in Spanish. The five keywords below must never be paraphrased — they're load-bearing for SEO + voice consistency:

1. `electricistas de confianza`
2. `garantía escrita de 1 año`
3. `cotización gratis`
4. `Neno Báez`
5. `El Seibo`

If a translation tool ever rewrites those, revert the change.

---

## 2. Color tokens

All colors live in `:root` in `src/app/globals.css` and as Tailwind extensions in `tailwind.config.ts`. Use the CSS variables (or Tailwind utility classes that map to them) — never hardcode hex.

### Background scale (navy)

| Token | Hex | Tailwind | Use |
|---|---|---|---|
| `--navy-950` | `#0A0F1E` | `bg-navy-950` | Page background. The default. |
| `--navy-900` | `#0D1224` | `bg-navy-900` | Alt section background (zebra striping between sections). |
| `--navy-800` | `#111827` | `bg-navy-800` | Secondary section background, modal backgrounds. |
| `--navy-700` | `#1A2035` | `bg-navy-700` | Card surfaces (`.dark-card`, `.service-card-dark`). |
| `--navy-600` | `#1E2845` | `bg-navy-600` | Card hover state, image placeholder background. |

> Black-tinted color `#0A0A0B` appears in CRO redesign components (HeroCollage, CTA white card, sticky thumb bar) — these come from the handoff doc and are intentionally darker than `--navy-950`. **Don't migrate them to `--navy-950`.** It's a deliberate cue that the section is more "premium / press-release" rather than "main page."

### Brand accent (electric yellow)

| Token | Hex | Tailwind | Use |
|---|---|---|---|
| `--electric` | `#EAB308` | `text-electric`, `bg-electric` | The primary brand color. Buttons, accent words in headings, icons, eyebrow labels. |
| `--electric-bright` | `#F5C518` | (no util) | Used as the brighter end of `linear-gradient(135deg, #EAB308, #F5C518)` on `.btn-electric`. |
| `--electric-hover` | `#CA9A07` | (no util) | Hover-end of the button gradient. |

The handoff doc sometimes references `#F5B800`. That's the **CRO redesign accent** specifically used in the new redesign components. It's slightly more saturated than `#EAB308`. They are **NOT interchangeable** — pick one based on context:

- Existing core utility classes (`.btn-electric`, `.electric-badge`, FAQ icon, etc.): `#EAB308`.
- CRO redesign components inline (HeroCollage floating card, CoverageMap markers, StickyThumbBar, etc.): `#F5B800`.

This split is historical. A future cleanup PR may unify them. Until it does, **match the surrounding code's choice** when you edit a file.

### Status colors

| Token | Hex | Tailwind | Use |
|---|---|---|---|
| `--emergency` | `#EF4444` | `text-red-400`, `bg-red-500` | Emergency CTA button, "AHORA" availability badge, emergency banner gradient. |
| `--emergency-dark` | `#450A0A` | `bg-emergency-dark` | Emergency banner border/shadow accent. |
| `--whatsapp` | `#25D366` | `bg-whatsapp` (also `.btn-whatsapp` gradient) | WhatsApp green. **Brand-locked** — never tint. |
| Success green | `#22c55e` | `text-green-400`, `bg-green-500` | "Disponible ahora" pulsing dot, "EN PROGRESO" live job indicator, "DISPONIBLES" trust pill. |
| Star yellow | `#eab308` | (literal) | Used inline for `★★★★★` glyphs. Same hex as `--electric` — kept literal because the rating is a separate semantic from the brand accent. |

### Text colors

| Token / value | Use |
|---|---|
| `#ffffff` (Tailwind `text-white`) | Primary text on dark backgrounds. |
| `#cfcfd6` | Body copy, paragraph text on dark surfaces. |
| `#8a8a92` | Muted secondary text, supporting copy, eyebrow labels. |
| `#5a5a62` | Faint tertiary text, very low-emphasis labels (e.g., the `EL SEIBO · REP. DOM.` overline on the white CTA card). |
| `#0A0A0B` | Text on the white CTA card and on white floating cards. |

These four greys (`#cfcfd6`, `#8a8a92`, `#5a5a62`, `#0A0A0B`) come from the handoff doc and **are not yet in CSS variables**. §15 flags this as an anti-pattern to converge.

### Border conventions

| RGBA | When |
|---|---|
| `rgba(255,255,255,0.06)` | Subtle card border, default. |
| `rgba(255,255,255,0.08)` | Slightly stronger card border (used on most CRO redesign cards). |
| `rgba(255,255,255,0.10)` | Quote card, glass surfaces. |
| `rgba(255,255,255,0.12)` | Authority badge border, slightly more emphasis. |

### Tint convention (alpha hex suffix)

The handoff doc and CRO redesign use a `${color}1a` / `${color}33` / `${color}55` notation for tinted backgrounds. The trailing 2 hex chars are alpha:

| Suffix | Decimal | Use |
|---|---|---|
| `1a` | 0.10 | Faint tint background for icon tile, accent surface. |
| `22` | 0.13 | Coverage glow inner. |
| `33` | 0.20 | Authority badge subtle bg, marker outer ring. |
| `55` | 0.33 | Marker glow ring, button shadow. |
| `aa` | 0.67 | Strong overlay, gradient fade. |
| `dd` | 0.87 | Near-opaque gradient end. |

Don't replace these with `rgba()` unless you preserve the exact alpha — most of the design uses these specific stops because they read as "almost transparent / barely-tinted" at small sizes.

### Ambient glow (page-level decorative blobs)

Every dark section has 1–2 large `radial-gradient(circle, <accent>1a, transparent 60%)` blobs absolutely positioned off-canvas. See `.ambient-glow-tl` and `.ambient-glow-tr` in `globals.css`. Don't drop these — they're load-bearing for the dark aesthetic.

---

## 3. Typography

### Font stack

| CSS variable | Family | Loaded from | Use |
|---|---|---|---|
| `--font-display` | `"Bebas Neue", "Barlow Condensed", sans-serif` | Google Fonts via `<link>` in `layout.tsx` | All `<h1>` / hero numbers / `01–04` step numbers / big stats. Always upper-case-feeling. |
| `--font-sub` | `"Barlow Condensed", sans-serif` | Google Fonts | Eyebrow labels, button text, badge text, navigation labels — anything that needs condensed caps. |
| `--font-body` | `var(--font-geist-sans), system-ui, sans-serif` | Next.js default | Body copy, paragraph text. |

`Inter` is also available for body (handoff doc references it) but the project ships with Geist Sans as the default body font. Don't switch — Geist is what's loaded.

### CSP requirement

Bebas Neue + Barlow Condensed are external fonts. The CSP in `next.config.ts` MUST allow:

```
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
font-src  'self' https://fonts.gstatic.com
```

If you tighten the CSP without these, the entire design's typography falls back to Impact / system-ui and the hero looks broken. Tested as recently as the latest commit.

### How to apply the fonts

Don't use Tailwind's `font-` utility classes for the display fonts (the project's Tailwind config doesn't extend them with Bebas/Barlow). Use **inline style with CSS variables**:

```tsx
<h1
  className="text-white"
  style={{ fontFamily: 'var(--font-display)' }}
>
  ELECTRICISTAS<br />
  <span className="text-electric">DE CONFIANZA</span>
</h1>

<span
  className="text-xs font-extrabold tracking-[0.2em] text-electric"
  style={{ fontFamily: 'var(--font-sub)' }}
>
  COBERTURA
</span>
```

Body copy uses Geist Sans by default — no inline style needed unless you want to override.

### Type scale

| Surface | Spec | Implementation |
|---|---|---|
| Hero h1 (desktop, 1440px) | Bebas, ~132px, lh 0.88, ls −0.02em | `style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(4rem, 10.5vw, 8.25rem)', lineHeight: 0.88, letterSpacing: '-0.02em' }}` |
| Hero h1 (mobile) | Bebas, 64px, lh 0.92 | Same clamp; lower bound is `4rem`. |
| Section h2 (Services "¿Qué necesitas hoy?") | Bebas, 80px desktop / 48px mobile | `clamp(3rem, 6.5vw, 5rem)` |
| Section h2 (other sections) | Bebas, 64px desktop / 36px mobile | `clamp(2.25rem, 5vw, 4rem)` |
| Step number `01–04` | Bebas, 64px | `fontFamily: 'var(--font-display)', fontSize: 64` |
| Big stat (1 AÑO, 4.9, 1,000+) | Bebas, 32–120px (varies by surface) | Inline px |
| Trust strip stat (15 min / 1,000+) | Bebas, ~56px | `.trust-number` class — `clamp(2.5rem, 4.5vw, 3.75rem)` |
| Eyebrow (`SERVICIOS`, `COBERTURA`, `EN VIVO`) | Barlow, 12px, weight 800, letter-spacing 0.2em, color `--electric` | `text-xs font-extrabold tracking-[0.2em]` + inline `fontFamily: 'var(--font-sub)'` |
| Body | Geist Sans, 13–22px depending on surface | Default body, no inline style |

### Hero headline class (legacy)

`.hero-headline` is defined in `globals.css` with `clamp(4.5rem, 11vw, 9rem)`. The new CRO hero uses inline clamp values that are slightly tighter (`clamp(4rem, 10.5vw, 8.25rem)` to match the handoff's 132px target). Both exist in the codebase. **Prefer the inline clamp** for new work — it matches the handoff spec exactly.

`.section-headline` is a similar legacy class. Avoid it for new sections — use the inline clamp pattern shown above so the section can hit its specific target size from the handoff doc.

---

## 4. Spacing & radii

### Tailwind extensions (`tailwind.config.ts`)

```ts
spacing: {
  "18": "4.5rem",   // 72px — section-internal gap
  "88": "22rem",    // 352px — hero illustration sizing
  "128": "32rem",   // 512px — coverage glow blob
}
borderRadius: {
  "4xl": "2rem",    // 32px — large surface (rare)
  "5xl": "3rem",    // 48px — pill-cluster (rare)
}
```

### Standard padding patterns

| Surface | Pattern |
|---|---|
| Page wrapper bottom | `pb-32 lg:pb-0` (mobile only — clears the sticky thumb bar; desktop has none) |
| Section vertical | `py-20 lg:py-24` (most sections) or `py-24 lg:py-[100px]` (services) or `py-16 lg:py-[60px]` (guarantee, final CTA) |
| Section horizontal (CRO redesign) | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-[60px]` (the `60px` matches the handoff doc's desktop horizontal padding) |
| Section horizontal (everywhere else) | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` |

### Radii scale

The design uses a **specific** radii scale, not a Tailwind-default scale. Use the matching one for the surface — these are not random.

| Pixels | Tailwind (custom) | Use |
|---|---|---|
| `10px` | `rounded-[10px]` | Phone CTA pills, small labels. |
| `12px` | `rounded-[12px]` | Buttons (`btn-*`), input fields, quote-pill, authority-badge, glass info card. |
| `14px` | `rounded-[14px]` | Mobile menu items, mobile-quote step buttons, sticky thumb bar buttons. |
| `16px` | `rounded-2xl` (Tailwind = 16) | Standard card radius (`.dark-card`, photo wrappers, recent jobs cards). |
| `18px` | `rounded-[18px]` | Testimonial cards, how-it-works step cards. |
| `20px` | `rounded-[20px]` or `rounded-[20px]` | `.service-card-dark`, coverage map container, sticky thumb bar wrapper, mobile spotlight testimonial. |
| `22px` | `rounded-[22px]` | Quote card (`.quote-card`). |
| `24px` | `rounded-3xl` (Tailwind = 24) | Guarantee band. |
| `28px` | `rounded-[28px]` | White CTA card (`.cta-white-card`). |
| `9999px` | `rounded-full` | Pills, avatars, status dots. |

---

## 5. Shadows & glows

Defined in `:root`:

```css
--glow-sm: 0 0 15px rgba(234,179,8,0.35);
--glow-md: 0 0 30px rgba(234,179,8,0.45);
--glow-lg: 0 0 60px rgba(234,179,8,0.55);
--card-shadow: 0 4px 32px rgba(0,0,0,0.5);
```

Tailwind also exposes `shadow-glow-sm/md/lg`, `shadow-card`, `shadow-card-hover`, `shadow-emergency` from `tailwind.config.ts`.

### Per-context recommendations

| Context | Shadow |
|---|---|
| Default card | `shadow-card` (defined in Tailwind) |
| Card hover | `shadow-card-hover` (also defined) |
| Button glow | `0 6px 20px rgba(245,184,0,0.33)` (CRO inline) or `shadow-glow-sm` |
| White floating card on hero | `0 20px 60px rgba(0,0,0,0.5)` |
| Yellow floating card on hero | `0 20px 60px rgba(245,184,0,0.55)` (yellow drop matches the card itself) |
| Sticky thumb bar | `0 20px 60px rgba(0,0,0,0.6)` |
| Emergency button | `shadow-emergency` |

---

## 6. Buttons & CTAs

### Primary button — `.btn-electric`

```tsx
<button className="btn-electric">Reservar Ahora</button>
```

Generated by the Tailwind plugin (`tailwind.config.ts` lines 181–201). Yellow gradient `linear-gradient(135deg, #EAB308, #F5C518)`, navy text, 12px radius, `0.875rem 1.75rem` padding. Hover: gradient shifts darker, lifts 2px, glow stronger.

When a CRO redesign component needs a slightly different shape (e.g., the inline quote form uses a 13px font with `!px-5 !py-3.5`), override with `!important` Tailwind utilities:

```tsx
<button className="btn-electric !px-5 !py-3.5 text-sm" style={{ fontFamily: 'var(--font-sub)' }}>
  RECIBIR COTIZACIÓN
</button>
```

### Outline button — `.btn-outline-electric`

Used for secondary actions (`Ver Galería`, `Entrar`, `Hablar con un técnico`). Transparent bg, 2px yellow border.

### Emergency button — `.btn-emergency`

Red gradient, only used for emergency / 24-7 CTAs. Don't substitute it for the regular electric button just for emphasis — it carries semantic urgency.

### WhatsApp button — `.btn-whatsapp`

Green gradient, white text. Pair with the `<WhatsAppIcon />` component, never with `lucide-react`'s `MessageCircle` (that's reserved for non-WhatsApp chat surfaces).

### CRO redesign CTAs

| Class | Use |
|---|---|
| `.cta-stack-btn.is-whatsapp` | White-card final CTA — green WhatsApp button |
| `.cta-stack-btn.is-phone` | White-card final CTA — black phone button |
| `.cta-stack-btn.is-quote` | White-card final CTA — yellow "Cotizar en 30 seg" button |

### Pills & badges

| Class | Use |
|---|---|
| `.electric-badge` | Solid yellow pill with navy text. For eyebrow labels above headlines (`📸 Portafolio`, `⚡ Servicios`). |
| `.electric-badge-outline` | Yellow border + transparent. For trust chips (`Asegurado RD$500k`, `15+ Años`). |
| `.live-pill` | Green availability pill (`DISPONIBLES AHORA · RESPUESTA EN 15 MINUTOS`) — for the hero. |
| `.authority-badge` | Outline white text with subtle border. For certification chips (`CDEEE`, `PRO-CONSUMIDOR`). |
| `.availability-dot.is-now` | Red dot + `AHORA` label, on the emergency service card. |
| `.availability-dot.is-today` | Green dot + `HOY` label, on standard service cards. |
| `.trust-badge` | Generic flex-row trust chip (`🏛️ Licencia CDEEE`). |

---

## 7. Cards & containers

| Class | Use |
|---|---|
| `.dark-card` | Default card. Navy-700 bg, 16px radius, hover lifts 2px + electric border glow. Use for any rectangular content panel. |
| `.dark-card-accent` | Variant with a 3px electric top border. Use to emphasize a card in a row (e.g., the highlighted plan in a price comparison). |
| `.service-card-dark` | Service card. 20px radius, 280px min-height, hover lifts 4px + glow. Used in `/booking`. |
| `.service-card-dark.featured-emergency` | Red-bordered variant for emergency service. |
| `.service-card-dark.coming-soon` | 0.65 opacity, hover disabled. Use for "Próximamente" services. |
| `.testimonial-card` | Testimonial. 16px radius, has a serif quote mark `"` decoration top-left in electric at 0.15 opacity. |
| `.stat-card` | Number + label centered card. 16px radius. |
| `.quote-card` | The inline 3-step quote card. 22px radius, glassy gradient background, 14px backdrop blur, big shadow. |
| `.coming-strip` | Dashed-border strip listing upcoming services. |
| `.guarantee-band` | Yellow-tinted gradient band with the `1 AÑO DE GARANTÍA` mega-copy. |
| `.cta-white-card` | The white final CTA card with a yellow radial glow in the upper-right corner. |

### Floating card pattern

The hero photo collage has 3 absolutely-positioned floating cards that overhang the photo grid edges. Their parent **must** have `overflow: visible` (don't clip them). See `src/components/redesign/HeroCollage.tsx`.

| Class / pattern | Use |
|---|---|
| `.float-card-light` | White card, dark text. The 4.9★ rating card. |
| `.float-card-electric` | Yellow card, black text. The 1,000+ jobs counter. |
| `.float-card-live` | Glassy dark card. The `EN PROGRESO` live job. |

### Glass legacy

`.glass-base`, `.glass-blue`, `.glass-green`, `.glass-red`, `.glass-purple`, `.glass-electric`, `.glass-success`, `.glass-input`, `.glass-button`, `.glass-nav`, `.glass-modal` — these predate the CRO redesign and are still in use on legacy pages (booking, dashboards). Don't add new glass surfaces; the CRO redesign uses `.dark-card`, `.quote-card`, and the float-card variants instead.

---

## 8. Components catalog

### `src/components/redesign/HeroCollage.tsx`
- 720px tall photo collage with 3 absolutely-positioned floating cards (rating, jobs counter, EN PROGRESO).
- `<HeroCollage className="hidden lg:block" />` — desktop only.
- Parent **must NOT** have `overflow: hidden` (cards intentionally overhang via negative offsets `top: 30, left: -20`).
- Photo sources: `/41a4fd06-...jpeg`, `/cf629f37-...jpeg`, `/4ca1b64b-...jpeg`, `/db2d6452-...jpeg` (in order top-left, bottom-left, top-right, bottom-right).

### `src/components/redesign/CoverageMap.tsx`
- Replaces the legacy `<ServiceAreaMap />`.
- Desktop: 1fr / 1.5fr split (text left, map right). Mobile: stacked, smaller map.
- Map = OSM iframe + dark filter + custom dot overlays + `3 técnicos en ruta` glass card + `© OpenStreetMap` attribution.
- See §14 for the full map contract — do NOT change the iframe URL, the filter, the `pointerEvents: none`, or the `aspect-[11/8]`.
- Accepts an `id` prop so the home page can anchor `#cobertura` to it.

### `src/components/redesign/TestimonialsRedesign.tsx`
- Replaces the legacy `<TestimonialsSection />`.
- Desktop: 1.5fr / 2fr split with a 4.9-stars summary block on the left and a 2×2 testimonial grid on the right (Rosa M., Juan P., Carmen L., Pedro R.).
- Mobile: single Rosa M. spotlight in a yellow-tinted gradient card.

### `src/components/redesign/MobileQuoteCard.tsx`
- Mobile-only inline 3-step state machine: service → urgency → phone.
- Rendered inside the hero on small viewports (`md:hidden`); desktop hero uses `<DesktopInlineQuote />` from `page.tsx` instead.
- On submit, redirects to `/booking?service=...&urgency=...&phone=...`. Empty phone is dropped from the URL.
- `<AnimatePresence mode="wait">` for the step transitions.

### `src/components/redesign/StickyThumbBar.tsx`
- `position: fixed` mobile-only thumb-zone CTA bar (WhatsApp + Llamar).
- Always visible at every scroll position. Page wrapper needs `pb-32 lg:pb-0` so content doesn't overlap.
- Uses `<WhatsAppIcon />` (NOT `MessageCircle`).

### `src/components/icons/WhatsAppIcon.tsx`
- Brand-correct WhatsApp glyph. Uses `currentColor` so it inherits text color.
- Import path: `@/components/icons/WhatsAppIcon`.
- Use it on **every** WhatsApp link, including the hero CTA, sticky thumb bar, footer, booking page, confirmation page, service-complete page, and the floating button.

### `LogoMark` (inline in `src/app/page.tsx`)
- 44×44 yellow gradient tile with a hand-drawn lightning bolt SVG path (verbatim from the handoff). Don't substitute an emoji.
- Path: `M19 3 L7 18 L14 18 L12 29 L25 13 L17 13 L19 3 Z`
- Pair with the wordmark "MULTI**SERVICIOS**" (second word in `--electric`) and the subline `El Seibo · Rep. Dom.`.

### `ServiceCard` (inline in `src/app/page.tsx`)
- Home page service card. Has the availability dot (`AHORA` for emergency, `HOY` for others), a 52×52 yellow-tinted icon tile, name, "Desde RD$X,XXX" pricing label, description, and a full-width `VER SERVICIO →` outline footer.
- Different from the booking page's `ServiceCard` (`src/app/booking/page.tsx`), which has a hover photo carousel and a priority badge.

### `FAQAccordion` (`src/components/FAQAccordion.tsx`)
- First item is open by default.
- Smooth Framer Motion expand/collapse via `AnimatePresence`.
- Yellow circular `+` / `–` icon toggles on the right.

### `EmergencyBanner` (`src/components/EmergencyBanner.tsx`)
- Red pulsing strip at the top of every page. Dismissible.
- Persists dismiss in localStorage under the key `multiservicios:emergencyBannerDismissed` (SSR-safe).

---

## 9. Iconography

### Lucide React (general UI)
Use `lucide-react` for all UI/structural icons: navigation, form fields, status indicators, etc. Common ones: `Phone`, `MapPin`, `Clock`, `ArrowRight`, `ChevronDown`, `CheckCircle`, `Star`, `Calendar`, `Wrench`, `ShieldCheck`, `Award`.

```tsx
import { Phone } from 'lucide-react'
<Phone className="h-5 w-5 text-electric" />
```

### Custom WhatsApp brand glyph
**Always** use `<WhatsAppIcon />` (from `@/components/icons/WhatsAppIcon`) on WhatsApp links — never `MessageCircle`. The icon is a verbatim copy of the official WhatsApp brand SVG so the link reads as native to anyone scanning the page.

### Emoji as functional icons (approved set)

The handoff doc explicitly allows emoji as placeholder icons in specific contexts. Approved set:

| Emoji | Use |
|---|---|
| 📍 | Location (utility bar address, coverage city list, recent jobs barrio). |
| 🕐 | Hours of operation (utility bar). |
| ⚡ | Electricity / urgency / "ahora mismo". |
| 🚨 | Emergency service. |
| 🔧 | Mantenimiento. |
| 🔩 | Reparación (legacy — newer code uses ⚡). |
| 🔌 | Instalación. |
| ☀️ | Solar (coming soon). |
| 🔋 | Generador (coming soon). |
| ❄️ | Climatización (coming soon). |
| 💬 | (avoid — use `<WhatsAppIcon />` instead). |
| 📞 | Phone CTA in mobile thumb bar. |
| 🇩🇴 | Country flag in the +1 phone prefix. |
| 🔒 | "Sin spam" disclaimer in quote forms. |
| ✓ | "Sin compromiso" / bullet checkmark — prefer Lucide `CheckCircle` for checkmarks if you want a real icon. |

Don't introduce new emoji outside this list.

### LogoMark bolt SVG

The lightning bolt in the brand logo is a verbatim hand-drawn path. Don't substitute it for `lucide-react`'s `Zap`, even though it looks similar. The path lives inline in `LogoMark` in `src/app/page.tsx`:

```tsx
<path d="M19 3 L7 18 L14 18 L12 29 L25 13 L17 13 L19 3 Z" />
```

---

## 10. Imagery

### Where photos come from
**Local `/public/*.jpeg` only.** Don't use Unsplash, don't use external CDNs, don't use stock photo services. The project's photos are real photos of Neno's actual work — substituting stock imagery breaks the brand's "this is real" promise.

If you need a new photo, ask. Don't fabricate.

### Image roster

| Photo | Used for |
|---|---|
| `/41a4fd06-d34c-42a6-b234-46fa1debd1df.jpeg` | Residential install (hero collage top-left, Instalación service). |
| `/cf629f37-1d13-4d7b-8774-7a5ce95bf946.jpeg` | Tablero principal (hero collage bottom-left, panel installs). |
| `/4ca1b64b-7b5f-4145-b7de-099d7806492f.jpeg` | Commercial panel (hero collage top-right, Comercial portfolio). |
| `/db2d6452-ebcc-4f8a-8588-9df01d849b74.jpeg` | Finished install (hero collage bottom-right, Acabados). |
| `/2394664b-563a-48aa-900e-7ff62152b422.jpeg` | Sistema de respaldo (Reparación service). |
| `/43a0a5cf-6fea-49e8-b174-7382d6ebfa5d.jpeg` | Iluminación LED (Instalación). |
| `/6bb20545-9b5b-43f9-b5f8-d7bbb4bcbd5b.jpeg` | Mantenimiento (preventivo). |
| `/7108a911-e716-4416-a620-97be93f4c140.jpeg` | Reparación pro (recent jobs strip). |
| `/7c810f87-294b-4352-a3f6-7b9ace4d39c3.jpeg` | Instalación total (recent jobs strip). |
| `/ae496ec7-f200-41db-9e1d-54aa3de8fccd.jpeg` | Cableado completo (industrial). |
| `/b420cfaa-cec4-47a5-a363-d8bebabcef4d.jpeg` | Sistema domótico comercial (recent jobs strip). |
| `/cf856cdc-a1e1-40ef-b079-eeab55418c17.jpeg` | Conexiones seguras. |
| `/neno-baez-electrician.jpeg` | Neno's portrait — confirmation page technician avatar. |

### `next/image` usage pattern

Always use `next/image` with `fill` + `sizes`:

```tsx
import Image from 'next/image'

<div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
  <Image
    src="/41a4fd06-d34c-42a6-b234-46fa1debd1df.jpeg"
    alt="Instalación residencial"
    fill
    sizes="(min-width: 1024px) 320px, 100vw"
    className="object-cover"
    priority   // only for above-the-fold images
  />
</div>
```

### Aspect ratios per surface

| Surface | Aspect |
|---|---|
| Hero collage photo (top-left, bottom-right) | 4:3 (300h × ~400w) |
| Hero collage photo (bottom-left, top-right) | 16:11 (240h × ~360w) |
| Coverage map container | `aspect-[11/8]` (1.375 — matches the OSM bbox lon/lat ratio so markers project correctly) |
| Recent jobs card photo | 220×110 (mobile horizontal scroll) |
| Service card carousel (booking) | `aspect-video` (16:9) |
| Gallery grid | `aspect-square` |
| Confirmation page technician avatar | 64×64 circle |

---

## 11. Motion

### Framer Motion patterns

**Section fade-in** (used on every section):

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ delay: i * 0.08 }}
>
```

**Card hover/tap** (cards, buttons that act like cards):

```tsx
<motion.div whileHover={{ y: -6 }} whileTap={{ scale: 0.97 }}>
```

For lighter cards, use `whileHover={{ y: -4 }}`.

**State machine transitions** (mobile 3-step quote, FAQ accordion):

```tsx
<AnimatePresence mode="wait">
  {step === 1 && (
    <motion.div
      key="step-1"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      ...
    </motion.div>
  )}
</AnimatePresence>
```

**Hero entry** — staggered with delays:

```tsx
<motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
<motion.p  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
<motion.div initial={{ opacity: 0 }}      animate={{ opacity: 1 }}      transition={{ delay: 0.25 }}>
```

### CSS keyframes (defined in `globals.css` + Tailwind config)

| Keyframe | Use |
|---|---|
| `electricPulse` | The pulsing scale on `.btn-electric` hover ring. |
| `glowPulse` | Box-shadow pulse on the floating WhatsApp button. |
| `emergencyPulse` | Background-position shimmer on the emergency banner. |
| `float`, `floatPulse` | Vertical float on hero illustrations. |
| `progressShine` | Diagonal sheen on the progress bar fill. |
| `textShimmer` | Yellow gradient sweep on `.gradient-text-electric` (4s linear, infinite). |
| `slideRight` | Used on emergency banner first appearance. |
| `badgeBounce` | Bounce on first badge render. |

### `gradient-text-electric` is BANNED on accent words

The legacy class animates a gradient sweep across yellow text. The CRO redesign uses **solid `text-electric`** for accent words (e.g., "DE CONFIANZA" in the hero h1). Don't apply the shimmer to new accent words — see §15.

### Anchor scroll behavior

Sticky header is `h-16 lg:h-20` (64–80px). Every `id`-anchored section needs `scroll-mt-24` (96px) so jump-to-anchor doesn't hide the heading under the header:

```tsx
<section id="servicios" className="scroll-mt-24 ...">
```

### GSAP

Installed as a dependency but unused. Don't add new GSAP usage; stay in framer-motion-land for consistency.

---

## 12. Responsive

### Breakpoints (Tailwind defaults)

| Token | Width | Use |
|---|---|---|
| `sm` | 640px | Phones in landscape, small tablets. |
| `md` | 768px | Tablet portrait. **Switch from MobileQuoteCard to DesktopInlineQuote at this breakpoint.** |
| `lg` | 1024px | Tablet landscape, small laptops. **Show HeroCollage, hide sticky thumb bar, switch to desktop nav, switch to multi-column section layouts.** |
| `xl` | 1280px | Standard desktop. **Show emergency phone in main nav cluster (`hidden xl:block`).** |

### Mobile-first defaults

Write base styles for mobile (390px wide is our reference). Layer in `md:`, `lg:`, `xl:` overrides for larger viewports. Most CRO redesign components start with a single-column stack and switch to multi-column at `lg`.

### Mobile-only / desktop-only patterns

| Surface | Visibility |
|---|---|
| Top utility bar | `hidden md:block` (desktop only — too much info for mobile) |
| Main nav links cluster | `hidden lg:flex` |
| Mobile hamburger button | `lg:hidden` |
| Emergency phone in nav | `hidden xl:block` |
| HeroCollage | `hidden lg:block` |
| DesktopInlineQuote | `hidden md:block` |
| MobileQuoteCard | `md:hidden` |
| Sticky thumb bar | `lg:hidden` (only mobile + tablet) |
| Floating WhatsApp button | `hidden lg:block` (desktop only — mobile uses the sticky thumb bar) |
| Recent jobs strip | `lg:hidden` (mobile only — not in desktop spec) |
| Authority bar (CDEEE / Pro-Consumidor) | `hidden lg:flex` (desktop hero only) |

### Page wrapper bottom padding

The sticky thumb bar covers the bottom of the viewport on mobile. Add `pb-32 lg:pb-0` to the **outermost page wrapper** so the last section doesn't get clipped under the bar.

```tsx
<div className="min-h-screen bg-navy-950 text-white overflow-x-hidden pb-32 lg:pb-0">
```

---

## 13. Voice & copy

### Spanish-only

Every visible string is in Spanish. Even tooltips. Even error messages where possible. Never let an English fallback leak through.

### The 5 keywords (do not paraphrase)

See §1. Treat them as locked strings.

### Phone display format

Always `+1 (809) 251-4329` for display. Always `tel:+18092514329` for `<a href>`. The owner's number — see CLAUDE.md for context.

### WhatsApp templates

Every WhatsApp link uses `https://wa.me/18092514329` and pre-populates a message via `?text=...`. The opener is **always** `¡Hola Neno!` so Neno can identify a fresh website lead at a glance.

| Surface | File | Pre-populated message |
|---|---|---|
| Floating WhatsApp button | `src/components/WhatsAppButton.tsx` | `¡Hola Neno! Vi tu sitio web y me gustaría más información sobre tus servicios eléctricos. ¿Está disponible?` |
| Sticky mobile thumb bar | `src/components/redesign/StickyThumbBar.tsx` | (same) |
| Home guarantee band "HABLAR CON UN TÉCNICO" | `src/app/page.tsx` (`WHATSAPP_OPENER_GENERIC`) | (same) |
| Home final CTA "WHATSAPP DIRECTO" | `src/app/page.tsx` (`WHATSAPP_OPENER_QUOTE`) | `¡Hola Neno! Vi tu sitio web y necesito una cotización para un servicio eléctrico. ¿Puede ayudarme?` |
| Booking — "¿Prefieres WhatsApp?" panel | `src/app/booking/page.tsx` | (matches generic opener) |
| Booking — service-specific button (after step 2) | `src/app/booking/page.tsx` (`buildWhatsAppHref`) | `¡Hola Neno! Vi tu sitio web y necesito un servicio de [SERVICE] [(urgency)]. Mi número es [PHONE]. ¿Está disponible?` |
| Confirmation page | `src/app/confirmation/page.tsx` | `¡Hola Neno! Tengo una cita confirmada para [SERVICE] el [DATE]. Quería confirmar los detalles.` |
| Service-complete feedback button | `src/app/service-complete/page.tsx` | `¡Hola Neno! Quería compartir mi comentario sobre el servicio que recibí.` |

### Pricing rule

Display prices as ranges or "Desde RD$X,XXX". Never show exact prices for non-fixed services. Emergency service uses the fixed `Tarifa fija RD$2,000` because it IS fixed.

---

## 14. Map (special case)

The coverage map (`src/components/redesign/CoverageMap.tsx`) is a constrained visual element. Several non-obvious choices keep it working — don't break them.

### Iframe URL

```
https://www.openstreetmap.org/export/embed.html?bbox=-69.6%2C18.35%2C-68.5%2C19.15&layer=mapnik
```

Bounding box: lon `-69.6` to `-68.5` (range 1.1), lat `18.35` to `19.15` (range 0.8). Aspect ratio 1.375. **Don't add `&marker=...`** — that adds a default red OSM pin that overlaps our custom yellow El Seibo dot.

### Dark filter (don't change)

```
filter: invert(0.92) hue-rotate(180deg) saturate(0.7) brightness(0.95) contrast(0.95);
```

This filter is what makes the OSM beige tile palette match the site's dark navy aesthetic. The values were tuned by the designer; don't tweak.

### Locked iframe (don't break)

```tsx
<iframe
  ...
  tabIndex={-1}
  aria-hidden="true"
  style={{ ..., pointerEvents: 'none' }}
/>
```

The iframe is a static backdrop. The user **cannot pan or zoom**. If they could, the OSM bbox would change, and our percent-based marker projection would no longer line up with the visible cities.

### Container aspect ratio

```tsx
<div className="relative aspect-[11/8] w-full overflow-hidden">
```

`aspect-[11/8]` (1.375) matches the bbox aspect ratio. If the container ever drifts to a different aspect (e.g., a fixed `h-[380px]` at a different column width), OSM letterboxes the rendered map and markers misalign.

### Marker projection math

```tsx
function project(p: { lon: number; lat: number }) {
  const x = ((p.lon - -69.6) / 1.1) * 100;     // % from left
  const y = (1 - (p.lat - 18.35) / 0.8) * 100; // % from top
  return { x, y };
}
```

These constants come from the bbox. If the bbox ever changes, update the constants in lockstep.

### Cities

| Lon | Lat | Name | Mobile? | Main? |
|---|---|---|---|---|
| -69.0421 | 18.7641 | El Seibo · Base | yes | **yes** |
| -69.0397 | 18.9886 | Miches | yes | – |
| -68.7079 | 18.6156 | Higüey | yes | – |
| -69.2575 | 18.7625 | Hato Mayor | yes | – |
| -69.3056 | 18.4539 | San Pedro | desktop only | – |
| -69.3819 | 19.0606 | Sabana de la Mar | desktop only | – |

### CSP requirement

`next.config.ts` must have `frame-src 'self' https://www.openstreetmap.org`. Without it, the iframe is silently blocked and the map renders as an empty dark box. (Tested: this happened during QA before the CSP was widened.)

---

## 15. Anti-patterns

These are violations identified in the codebase audit. **Don't introduce new instances.** When you see one in code you're editing, fix it as a drive-by.

### 15.1 Hardcoded grays not in tokens

| Hex | Where | Canonical replacement |
|---|---|---|
| `#cfcfd6` | Body copy on dark surfaces (used inline ~30+ times) | Promote to a CSS variable `--text-muted: #cfcfd6` and use `style={{ color: 'var(--text-muted)' }}` or a Tailwind extension. |
| `#8a8a92` | Secondary text (used inline ~20+ times) | Same — `--text-dim: #8a8a92`. |
| `#5a5a62` | Faint tertiary text | `--text-faint: #5a5a62`. |
| `#0A0A0B` | Text on white CTA card, BG of HeroCollage and CTA components | `--bg-deep: #0A0A0B` (it's intentionally darker than `--navy-950`). |

A future PR should declare these as `:root` variables and migrate inline usage. **Don't migrate them in a feature PR** — it's a separate cleanup task.

### 15.2 Shimmer gradient on accent words

`.gradient-text-electric` was used on the hero h1 accent (`de Confianza`) and the services h2 accent (`hoy?`). The handoff doc spec says **solid yellow** (`color: var(--electric)` / `text-electric`) — the shimmer is reserved for decorative micro-elements, not headline accent words. Use `text-electric` for accent words.

### 15.3 `MessageCircle` on WhatsApp links

Lucide React's `MessageCircle` is a generic chat icon. Using it on a WhatsApp link makes the link feel non-native. Always use `<WhatsAppIcon />` from `@/components/icons/WhatsAppIcon`.

`MessageCircle` is allowed on **non-WhatsApp** chat surfaces (e.g., `TechnicianDashboard.tsx` uses it for in-app notifications/messages — that's correct).

### 15.4 Unsplash / external photo CDNs

The original handoff used Unsplash placeholders. The shipped site uses local `/public/*.jpeg` (real photos of Neno's work). **Don't reintroduce Unsplash.** If you need a new image, source it locally.

### 15.5 Fixed `h-[Npx]` on the coverage map

The coverage map needs `aspect-[11/8]` to keep the marker projection aligned. A fixed height (like the previous `h-[200px] lg:h-[380px]`) lets the column width drift the aspect ratio and desyncs the markers. Don't revert this.

### 15.6 Interactive iframe on the coverage map

The OSM iframe is locked (`pointerEvents: 'none'` + `tabIndex={-1}`). **Don't enable interaction** — markers desync the moment the user pans. If a future feature genuinely needs an interactive map, switch to a real map library (Leaflet, MapLibre) that handles markers in sync with map state.

### 15.7 Translating the 5 keywords

If a translation tool, a non-Spanish-speaking contributor, or an AI agent rewrites any of the 5 locked keywords, revert the change. They're locked for SEO + voice.

### 15.8 ElevenLabs widget remount

The `<ElevenLabsWidget />` component exists in the repo (`src/components/ElevenLabsWidget.tsx`) but is intentionally **not rendered anywhere** in the current codebase — the script-load timeout was causing console errors. Don't remount it without first fixing the timeout. The component file is kept so it's easy to re-enable later.

### 15.9 Z-index sprawl

There's no formal z-index hierarchy. Currently:
- `.whatsapp-float`: `60`
- `.custom-cursor-dot`: `10000`
- `.coming-soon-overlay-dark`: `10`
- Sticky thumb bar: `40`
- Sticky main header: `50`

A future PR should formalize: `40` sticky chrome, `50` modals, `60` toast/floating CTAs, `10000` reserved (cursor effects). For now, when you add a new layered element, pick a value consistent with the closest existing peer.

---

*Last reviewed: 2026-05-08. Update this doc whenever you change a token, ship a new component, or add a design rule.*
