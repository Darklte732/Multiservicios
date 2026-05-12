-- ─────────────────────────────────────────────────────────────────────────────
-- MultiServicios El Seibo — Drop Customer/Technician Account Schema
--
-- Context: the site is a marketing landing page. All customer interaction
-- happens by phone or WhatsApp with Neno. There are no end-user accounts.
-- This migration drops the tables that were only ever used by the now-deleted
-- /customer-dashboard, /dashboard, /account-creation, and /service-complete
-- account-related surfaces.
--
-- Tables kept:
--   ms_leads, ms_call_analysis, ms_prompt_versions, ms_weekly_insights
--     (Ana's lead capture + admin dashboard data — service-role only)
--
-- This is DESTRUCTIVE — data is irrecoverable after running. Pre-launch
-- only; do NOT run in any environment with real customer data.
-- ─────────────────────────────────────────────────────────────────────────────

BEGIN;

DROP TABLE IF EXISTS public.notifications              CASCADE;
DROP TABLE IF EXISTS public.service_warranties         CASCADE;
DROP TABLE IF EXISTS public.availability_slots         CASCADE;
DROP TABLE IF EXISTS public.service_codes              CASCADE;
DROP TABLE IF EXISTS public.service_requests           CASCADE;
DROP TABLE IF EXISTS public.customer_profiles          CASCADE;
DROP TABLE IF EXISTS public.electrician_profiles       CASCADE;
DROP TABLE IF EXISTS public.users                      CASCADE;

-- Sanity check — should return zero rows for any of the dropped tables.
-- Run this in SQL editor after applying:
--   SELECT tablename FROM pg_tables WHERE schemaname = 'public'
--     AND tablename IN ('users','customer_profiles','electrician_profiles',
--                       'notifications','service_warranties','availability_slots',
--                       'service_codes','service_requests');

COMMIT;
