-- ─────────────────────────────────────────────────────────────────────────────
-- MultiServicios El Seibo — Drop Ana voice-agent schema
--
-- Context: the ElevenLabs voice agent ("Ana") has been removed. All customer
-- contact now happens directly via phone call or WhatsApp. The tables that
-- only fed the now-deleted /api/elevenlabs/webhook, /api/cron/weekly-improvement,
-- and /admin dashboard are no longer in use.
--
-- DESTRUCTIVE — irreversible. Pre-launch only.
-- ─────────────────────────────────────────────────────────────────────────────

BEGIN;

DROP TABLE IF EXISTS public.ms_weekly_insights CASCADE;
DROP TABLE IF EXISTS public.ms_call_analysis   CASCADE;
DROP TABLE IF EXISTS public.ms_prompt_versions CASCADE;
DROP TABLE IF EXISTS public.ms_leads           CASCADE;

COMMIT;
