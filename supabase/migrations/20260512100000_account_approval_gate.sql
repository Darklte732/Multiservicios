-- ─────────────────────────────────────────────────────────────────────────────
-- MultiServicios El Seibo — Account Approval Gate
--
-- Adds a manual approval workflow on top of `public.users`. New accounts
-- registered through `/api/auth/register` are inserted with
-- `approval_status = 'pending'` (set explicitly in code, NOT by the column
-- default). The `/api/auth/login` route refuses any user whose
-- `approval_status` is `'pending'` or `'rejected'` and returns a friendly
-- Spanish message the client surfaces to the user.
--
-- Neno (admin) approves or rejects pending accounts from the /admin page,
-- which calls the new `/api/admin/users/*` endpoints (bearer-token guarded
-- via `ADMIN_API_TOKEN`).
--
-- Backfill model: this migration adds the column with a DEFAULT of
-- `'approved'`. That means EVERY existing row becomes `'approved'` and can
-- continue to log in. Only rows inserted AFTER the migration go through
-- the gate, because the register route explicitly writes `'pending'`.
--
-- Idempotent — all ADD COLUMN and CREATE INDEX statements use IF NOT EXISTS.
-- Safe to run multiple times.
-- ─────────────────────────────────────────────────────────────────────────────

-- ═════════════════════════════════════════════════════════════════════════════
-- 1. approval_status column (NOT NULL, CHECK-constrained, default 'approved')
-- ═════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS approval_status TEXT
  NOT NULL
  DEFAULT 'approved'
  CHECK (approval_status IN ('pending', 'approved', 'rejected'));

-- ═════════════════════════════════════════════════════════════════════════════
-- 2. Audit-trail columns (NULL by default)
-- ═════════════════════════════════════════════════════════════════════════════

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ NULL;

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS approved_by UUID NULL;

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ NULL;

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT NULL;

-- ═════════════════════════════════════════════════════════════════════════════
-- 3. Partial index on pending rows — fast admin-queue queries
-- ═════════════════════════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_users_approval_status
  ON public.users(approval_status)
  WHERE approval_status = 'pending';

-- ═════════════════════════════════════════════════════════════════════════════
-- Documentation comment
-- ═════════════════════════════════════════════════════════════════════════════

COMMENT ON COLUMN public.users.approval_status IS
  'Account approval gate. New signups via /api/auth/register insert with ''pending''; existing rows backfilled to ''approved'' by the column default. Login is blocked unless this column equals ''approved''.';

-- ═════════════════════════════════════════════════════════════════════════════
-- Verification queries (paste into the Supabase SQL Editor after running)
-- ═════════════════════════════════════════════════════════════════════════════
--
-- 1. Confirm the columns exist with the right types/defaults:
--
--    SELECT column_name, data_type, is_nullable, column_default
--    FROM information_schema.columns
--    WHERE table_schema = 'public' AND table_name = 'users'
--      AND column_name IN (
--        'approval_status','approved_at','approved_by',
--        'rejected_at','rejection_reason'
--      )
--    ORDER BY column_name;
--
-- 2. Confirm the CHECK constraint is in place:
--
--    SELECT conname, pg_get_constraintdef(oid)
--    FROM pg_constraint
--    WHERE conrelid = 'public.users'::regclass AND contype = 'c';
--
-- 3. Confirm every existing row was backfilled as 'approved':
--
--    SELECT approval_status, COUNT(*)
--    FROM public.users
--    GROUP BY approval_status;
--    -- Expected: 'approved' = total, 'pending' = 0, 'rejected' = 0
--    -- (until the next signup lands).
--
-- 4. Confirm the partial index exists:
--
--    SELECT indexname, indexdef
--    FROM pg_indexes
--    WHERE schemaname = 'public' AND tablename = 'users'
--      AND indexname = 'idx_users_approval_status';
--
-- ═════════════════════════════════════════════════════════════════════════════
-- End of migration
-- ═════════════════════════════════════════════════════════════════════════════
