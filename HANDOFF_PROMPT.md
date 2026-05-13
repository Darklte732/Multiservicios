# Handoff Prompt — Paste This Into a New Claude Session

Copy everything between the `===` lines and paste into a new Claude/Cowork conversation to resume work.

===

I'm continuing work on a Facebook page growth project for **MultiServicios El Seibo**, an electrician business in El Seibo, Dominican Republic, run by Neno Báez. A previous Claude session built the strategy and started the live setup.

**Project location:** `C:\Users\Ronel\Downloads\MULTISERVICIOS_WEBAPP`
**Facebook page (admin access):** https://www.facebook.com/profile.php?id=61557111028440
**Current page name:** "BaezMultiservicios" (needs rename)
**Real phone:** **(809) 251-4329** (NOT 555-0123 — that's a placeholder in CLAUDE.md)
**Website:** https://multiservicios.app

## ⚠️ Critical constraints

1. **AUDIENCE LANGUAGE: SPANISH ONLY.** 100% of clients are Hispanic and only speak Spanish. Every customer-facing post, message, ad, reply, and bio MUST be in Caribbean/Dominican Spanish. Never publish English to the page. The English in reference docs is for me (the user) — not for customers.

2. **Anthropic policy blocks site-level approvals on Facebook.** Each browser action requires manual approval popup. The "approved sites" allowlist will not accept facebook.com. Plan around this — either heavily batch actions or have me execute manually with your written instructions.

3. **Page is using "new Pages experience"** (profile-style layout) — Hours and Phone fields don't exist as standard form inputs. Phone is embedded in bio. Hours are managed via Business Suite or by going through Personal Details routing.

## What's already done

**LIVE on the page:**
- ✅ Spanish bio published (currently has WRONG phone "555-0123" — needs immediate fix to 251-4329)
- ✅ Profile photo, cover photo, Spanish language setting, El Seibo location, WhatsApp button, website link, welcome post, Electrician category
- ✅ Page Health rating: "Good" per Facebook's meter
- ✅ FAQ automation (already enabled in Business Suite)

**Deliverables in workspace folder (all up-to-date with real phone 809-251-4329 and Spanish-only rule):**
- `FACEBOOK_README.md` — master overview
- `FACEBOOK_GROWTH_STRATEGY.md` — strategy, pillars, KPIs, language rule
- `FACEBOOK_30_DAY_CALENDAR.md` — 30 Spanish posts + 13 Reel briefs ready to schedule
- `FACEBOOK_SETUP_MANUAL.md` — page setup click-by-click
- `FACEBOOK_AUTOMATION_CONFIG.md` — auto-replies, 10 FAQ buttons, 5 saved replies (all Spanish)
- `FACEBOOK_ADS_PLAYBOOK.md` — 4 ad campaigns with Spanish creative
- `FACEBOOK_PROGRESS_REVIEW.md` — status report from previous session
- `DO_THIS_NOW.md` — single-page 20-minute manual execution checklist
- `HANDOFF_PROMPT.md` — this file

## What's still pending (live actions to execute)

Priority order:

1. 🚨 **URGENT — Fix bio phone:** The live bio has placeholder (809) 555-0123 — must be changed to (809) 251-4329. Full Spanish bio text is in `DO_THIS_NOW.md` Step 1.

2. **Rename page for SEO:** "BaezMultiservicios" → "MultiServicios El Seibo - Electricista Neno Báez" (Facebook reviews 1-3 days, can't change again for 60 days). See Step 2.

3. **Configure Messenger auto-reply (greeting):** Spanish content in `FACEBOOK_AUTOMATION_CONFIG.md` Part 1 and `DO_THIS_NOW.md` Step 3. UI has a quirk — toggle ON FIRST, then check Messenger box, then paste message, then save (the prior session got blocked by a form-state reset bug).

4. **Configure Away message:** Same UI quirk. See Step 4.

5. **Custom keyword auto-DM:** See Step 5.

6. **Schedule first 7 posts in Business Suite Planner:** Spanish copy ready for Days 1-7. See Step 6.

7. **Add backup admin to page** (Settings → Page roles).

8. **Invite Neno's contacts to like the page** (cap 200/day).

After those: Meta Pixel install on multiservicios.app website, domain verification, then launch first $5/day Click-to-WhatsApp ad campaign.

## Tech stack & web app context

The website (multiservicios.app) is built with Next.js 15 App Router + Supabase. It already has an AI voice agent (Ana) for inbound call handling and a booking flow. Read `CLAUDE.md` for full project context — but **the phone number `(809) 555-0123` throughout `CLAUDE.md` is a PLACEHOLDER.** The real number is `(809) 251-4329`.

## What I want you to do

Please:
1. Read `DO_THIS_NOW.md` first — that's the immediate-action checklist
2. Read `FACEBOOK_README.md` for context
3. Tell me: do you want to drive the live Facebook setup with my manual approvals (slow, ~50 prompts), or write me an even-faster version of `DO_THIS_NOW.md` that I execute myself?

Either way, **never publish English text to anything customer-facing.** Spanish only.

===

That's it — paste it into a new Claude conversation to pick up exactly where this left off.
