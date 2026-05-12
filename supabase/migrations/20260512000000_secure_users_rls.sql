-- ─────────────────────────────────────────────────────────────────────────────
-- MultiServicios El Seibo — Security Hardening (RLS lockdown)
--
-- Finding #3 remediation from the May 2026 security audit. Defense-in-depth
-- for the migration to server-side bcrypt auth.
--
-- Model: server-side service-role for all DB access; no direct anon-client DB
-- reads or writes for sensitive tables. The Next.js /api/auth/*, /api/admin/*,
-- and /api/cron/* routes hold SUPABASE_SERVICE_ROLE_KEY.
--
-- Rule: any NEW table containing user data MUST follow the same pattern:
--   ALTER TABLE ... ENABLE ROW LEVEL SECURITY;
--   ALTER TABLE ... FORCE ROW LEVEL SECURITY;
--   (no policies = no anon access)
--
-- The anon key is retained only for:
--   - Supabase realtime subscriptions on tables that opt in via explicit policy
--   - Bootstrap of the Supabase JS client in the browser (no data reads)
--
-- This migration is IDEMPOTENT — safe to run multiple times.
-- ─────────────────────────────────────────────────────────────────────────────

-- ═════════════════════════════════════════════════════════════════════════════
-- 1. users — STRICT LOCKDOWN
-- ═════════════════════════════════════════════════════════════════════════════
-- The users table contains password_hash. NEVER allow anon to read/write.
-- All access must go through the /api/auth/* routes which use service_role.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
    EXECUTE 'ALTER TABLE public.users ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.users FORCE ROW LEVEL SECURITY';
  END IF;
END $$;

-- Drop ALL pre-existing policies on public.users (defensive — names may vary
-- across past migrations / Supabase Dashboard edits). After this block, the
-- table has zero policies, so anon/authenticated roles have zero access.
-- Service role bypasses RLS automatically.
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'users'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.users', pol.policyname);
  END LOOP;
END $$;

COMMENT ON TABLE public.users IS
  'Strict RLS: service-role-only access. The Next.js /api/auth/login and /api/auth/register routes use SUPABASE_SERVICE_ROLE_KEY. The anon-key client must never touch this table directly.';

-- ═════════════════════════════════════════════════════════════════════════════
-- 2. customer_profiles — STRICT LOCKDOWN
-- ═════════════════════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'customer_profiles') THEN
    EXECUTE 'ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.customer_profiles FORCE ROW LEVEL SECURITY';
  END IF;
END $$;

DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'customer_profiles'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.customer_profiles', pol.policyname);
  END LOOP;
END $$;

COMMENT ON TABLE public.customer_profiles IS
  'Strict RLS: service-role-only access. Created by /api/auth/register on signup. The anon-key client must never touch this table directly.';

-- ═════════════════════════════════════════════════════════════════════════════
-- 3. electrician_profiles — STRICT LOCKDOWN
-- ═════════════════════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'electrician_profiles') THEN
    EXECUTE 'ALTER TABLE public.electrician_profiles ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.electrician_profiles FORCE ROW LEVEL SECURITY';
  END IF;
END $$;

DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'electrician_profiles'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.electrician_profiles', pol.policyname);
  END LOOP;
END $$;

COMMENT ON TABLE public.electrician_profiles IS
  'Strict RLS: service-role-only access. Created by /api/auth/register on technician signup. The anon-key client must never touch this table directly.';

-- ═════════════════════════════════════════════════════════════════════════════
-- 4. service_requests — STRICT LOCKDOWN
-- ═════════════════════════════════════════════════════════════════════════════
-- All reads/writes must go through server-side API routes that filter by the
-- logged-in user's id (verified server-side). Anon role has zero access.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'service_requests') THEN
    EXECUTE 'ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.service_requests FORCE ROW LEVEL SECURITY';
  END IF;
END $$;

DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'service_requests'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.service_requests', pol.policyname);
  END LOOP;
END $$;

COMMENT ON TABLE public.service_requests IS
  'Strict RLS: service-role-only access. Customer and technician views must be served via /api/* routes that filter by session user id. The anon-key client must never touch this table directly.';

-- ═════════════════════════════════════════════════════════════════════════════
-- 5. service_warranties — STRICT LOCKDOWN
-- ═════════════════════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'service_warranties') THEN
    EXECUTE 'ALTER TABLE public.service_warranties ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.service_warranties FORCE ROW LEVEL SECURITY';
  END IF;
END $$;

DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'service_warranties'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.service_warranties', pol.policyname);
  END LOOP;
END $$;

COMMENT ON TABLE public.service_warranties IS
  'Strict RLS: service-role-only access. The anon-key client must never touch this table directly.';

-- ═════════════════════════════════════════════════════════════════════════════
-- 6. notifications — STRICT LOCKDOWN
-- ═════════════════════════════════════════════════════════════════════════════
-- NOTE: The current browser code in src/contexts/NotificationContext.tsx reads
-- notifications via the anon client and subscribes to realtime INSERTs on this
-- table. After this migration, those reads will FAIL until the code is moved
-- to a /api/notifications route OR a narrow SELECT policy is added.
-- See MIGRATION_NOTES.md for the breakage list.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'notifications') THEN
    EXECUTE 'ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.notifications FORCE ROW LEVEL SECURITY';
  END IF;
END $$;

DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'notifications'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.notifications', pol.policyname);
  END LOOP;
END $$;

COMMENT ON TABLE public.notifications IS
  'Strict RLS: service-role-only access. Browser notification reads should be served via /api/notifications. Realtime subscriptions require an explicit policy (intentionally not added — see MIGRATION_NOTES.md).';

-- ═════════════════════════════════════════════════════════════════════════════
-- 7. availability_slots — STRICT LOCKDOWN
-- ═════════════════════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'availability_slots') THEN
    EXECUTE 'ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.availability_slots FORCE ROW LEVEL SECURITY';
  END IF;
END $$;

DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'availability_slots'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.availability_slots', pol.policyname);
  END LOOP;
END $$;

COMMENT ON TABLE public.availability_slots IS
  'Strict RLS: service-role-only access. The anon-key client must never touch this table directly.';

-- ═════════════════════════════════════════════════════════════════════════════
-- 8. service_codes — STRICT LOCKDOWN
-- ═════════════════════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'service_codes') THEN
    EXECUTE 'ALTER TABLE public.service_codes ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.service_codes FORCE ROW LEVEL SECURITY';
  END IF;
END $$;

DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'service_codes'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.service_codes', pol.policyname);
  END LOOP;
END $$;

COMMENT ON TABLE public.service_codes IS
  'Strict RLS: service-role-only access. Service codes (MS-YYYY-XXXXX) are minted and validated server-side only. The anon-key client must never touch this table directly.';

-- ═════════════════════════════════════════════════════════════════════════════
-- 9. customers (legacy table — same lockdown if it exists)
-- ═════════════════════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'customers') THEN
    EXECUTE 'ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY';
    EXECUTE 'ALTER TABLE public.customers FORCE ROW LEVEL SECURITY';

    -- Drop all existing policies
    PERFORM 1; -- placeholder
  END IF;
END $$;

DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'customers'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.customers', pol.policyname);
  END LOOP;
END $$;

-- ═════════════════════════════════════════════════════════════════════════════
-- Verification queries (paste into the Supabase SQL Editor after running)
-- ═════════════════════════════════════════════════════════════════════════════
--
-- 1. Confirm all sensitive tables have RLS enabled AND forced:
--
--    SELECT tablename, rowsecurity, forcerowsecurity
--    FROM pg_tables
--    WHERE schemaname = 'public'
--      AND tablename IN (
--        'users','customer_profiles','electrician_profiles',
--        'service_requests','service_warranties','notifications',
--        'availability_slots','service_codes','customers'
--      )
--    ORDER BY tablename;
--    -- Expected: rowsecurity = true AND forcerowsecurity = true for every row.
--
-- 2. Confirm there are NO policies on the locked tables (zero policies = zero
--    anon/authenticated access; service_role bypasses RLS):
--
--    SELECT schemaname, tablename, policyname, roles, cmd
--    FROM pg_policies
--    WHERE schemaname = 'public'
--      AND tablename IN (
--        'users','customer_profiles','electrician_profiles',
--        'service_requests','service_warranties','notifications',
--        'availability_slots','service_codes','customers'
--      );
--    -- Expected: zero rows returned.
--
-- 3. From a client using the ANON key, every one of these MUST fail with an
--    empty result or a permission error:
--
--    const { data, error } = await supabase
--      .from('users')
--      .select('password_hash')
--      .limit(1)
--    // → data: [] or error
--
--    const { data, error } = await supabase
--      .from('users')
--      .insert({
--        phone: '+18095550000',
--        name: 'Hacker',
--        user_type: 'admin',
--        password_hash: 'x',
--        is_active: true,
--      })
--    // → error: "new row violates row-level security policy"
--
--    const { data, error } = await supabase
--      .from('service_requests')
--      .select('*')
--      .limit(1)
--    // → data: [] (zero rows because no policy grants access)
--
-- ═════════════════════════════════════════════════════════════════════════════
-- End of migration
-- ═════════════════════════════════════════════════════════════════════════════
