# Supabase Migration Notes

## `20260512000000_secure_users_rls.sql` — RLS Lockdown

### What this migration does

Enables `ROW LEVEL SECURITY` and `FORCE ROW LEVEL SECURITY` on every sensitive
table in the `public` schema (`users`, `customer_profiles`, `electrician_profiles`,
`service_requests`, `service_warranties`, `notifications`, `availability_slots`,
`service_codes`, `customers`), then **drops all existing policies** on those
tables. The result: anon-role and authenticated-role clients have **zero**
access. Only the `service_role` key (used server-side in `/api/auth/*`,
`/api/admin/*`, and `/api/cron/*`) can read or write these tables, because
service-role bypasses RLS by design.

This is the defense-in-depth half of the Finding #3 remediation. The other
half — moving auth to server-side bcrypt — is handled in parallel by the auth
agent. After both are merged, `password_hash` is unreachable from the browser
even if every other layer fails.

---

### How to apply

Choose ONE of these:

**(a) Supabase CLI — recommended**
```bash
# from the project root
supabase db push
```
This applies any new files in `supabase/migrations/` to the linked project.

**(b) Supabase Dashboard — easiest, no setup**
1. Open `https://supabase.com/dashboard/project/ncnbwaxtugvswavbrpck`.
2. Sidebar → **SQL Editor** → **New query**.
3. Paste the entire contents of `supabase/migrations/20260512000000_secure_users_rls.sql`.
4. Click **Run**. You should see a "Success" toast.
5. Run the verification queries at the bottom of the file (also commented in
   the SQL itself).

**(c) `psql` direct**
```bash
psql "$DATABASE_URL" -f supabase/migrations/20260512000000_secure_users_rls.sql
```

---

### Idempotency

The migration is safe to run multiple times. Every DDL statement is wrapped in
an `IF EXISTS` guard, and the policy-drop loops are no-ops if no policies are
left to drop.

---

### Rollback

To reverse this migration, you would need to add explicit anon-role SELECT/
INSERT/UPDATE/DELETE policies to each table. **We strongly recommend against
this** — the whole point of the change is that the anon client should never
touch these tables. If something breaks, fix the breakage by moving the read
to a server-side API route (see "Known breakages" below), not by reopening
anon access.

---

### Known breakages — anon client reads that this migration WILL break

The browser bundle currently reads several tables via the anon client. After
this migration those reads return empty arrays / permission errors. Each needs
to be moved to a server-side `/api/*` route that uses
`SUPABASE_SERVICE_ROLE_KEY` and verifies the requesting user's session.

| Table | File | Lines | What it does | Fix |
|---|---|---|---|---|
| `users` | `src/lib/supabase.ts` | 101, 116 | `db.getUser(id)`, `db.getUserByPhone(phone)` join with profiles | Move to `/api/users/me` (returns the session user only). |
| `users` | `src/store/auth.ts` | 107, 121, 160, 193, 248, 301, 309 | All current login/register/refresh logic | Already being migrated by the auth agent to `/api/auth/login` and `/api/auth/register`. |
| `customer_profiles` | `src/store/auth.ts` | 213 | Creates profile on register | Handled by `/api/auth/register` (auth agent). |
| `electrician_profiles` | `src/store/auth.ts` | 228 | Creates profile on tech register | Handled by `/api/auth/register` (auth agent). |
| `electrician_profiles` | `src/lib/supabase.ts` | 219 | `db.getAvailableElectricians()` | Move to `/api/electricians/available` server route. |
| `service_requests` | `src/lib/supabase.ts` | 137, 168, 179 | `db.getServiceRequests / createServiceRequest / updateServiceRequest` | Move to `/api/service-requests` (GET/POST/PATCH, filtered server-side by session user). |
| `service_warranties` | `src/lib/supabase.ts` | 192, 207 | `db.getServiceWarranties / createServiceWarranty` | Move to `/api/warranties`. |
| `notifications` | `src/lib/supabase.ts` | 239, 255, 267 | `db.getNotifications / markNotificationAsRead / createNotification` | Move to `/api/notifications` (GET/POST/PATCH). |
| `notifications` | `src/contexts/NotificationContext.tsx` | 63, 104, 144 | Live notification inbox + mark-read | Move reads to `/api/notifications`. For realtime, see "Realtime caveat" below. |
| `notifications` | `src/components/notifications/NotificationDemo.tsx` | 28 | Test-only insert | Delete or move to `/api/dev/notifications-test`. Dev-only. |

#### Realtime caveat

`src/contexts/NotificationContext.tsx` and `src/lib/supabase.ts` lines 277–300
also subscribe to Supabase realtime on `service_requests` and `notifications`.
With FORCE RLS and zero policies, realtime payloads will be filtered to empty
for the anon role. Two options:

1. **Drop realtime** and replace with polling via the new `/api/notifications`
   endpoint (simplest, recommended for now).
2. **Add a narrow realtime-only SELECT policy** scoped to the recipient's row.
   This requires the app to first issue a Supabase Auth `signInAnonymously()`
   or a custom JWT so realtime can match `auth.uid()` against `user_id` — not
   trivial with the current custom-auth pattern.

Until one of those is done, the bell icon will silently stop updating live.
That's acceptable for a security hotfix; queue the migration of the reads as
a follow-up task.

#### Tables NOT touched by this migration

- `ms_leads`, `ms_call_analysis`, `ms_prompt_versions`, `ms_weekly_insights` —
  these are already only accessed by server-side routes that use the service
  role (verified in `src/app/api/elevenlabs/webhook/route.ts`,
  `src/app/api/cron/weekly-improvement/route.ts`,
  `src/app/api/admin/improve-prompt/route.ts`, `src/lib/selfHeal.ts`). They
  should still be locked down — add a follow-up migration if RLS is not
  already enabled on them.

---

### Going forward — checklist for new tables

Any new `public.*` table that contains user data must:

1. `ALTER TABLE public.<name> ENABLE ROW LEVEL SECURITY;`
2. `ALTER TABLE public.<name> FORCE ROW LEVEL SECURITY;`
3. Be accessed ONLY from server-side API routes that use
   `SUPABASE_SERVICE_ROLE_KEY` and authorize the requesting user before
   returning data.
4. NOT have any policies that grant the `anon` role access — unless the table
   is genuinely public (e.g., a public-services listing).

Treat the anon key as a connection string, not an authorization token.

---

## `20260512100000_account_approval_gate.sql` — Manual approval queue

### What this migration does

Adds an `approval_status` column (`'pending' | 'approved' | 'rejected'`) plus
four audit-trail columns (`approved_at`, `approved_by`, `rejected_at`,
`rejection_reason`) to `public.users`, and a partial index on the pending
subset so the admin queue query is O(pending) rather than O(users).

### Backfill behavior

`approval_status` is added with `NOT NULL DEFAULT 'approved'`. Every existing
row therefore gets `'approved'` automatically — **no existing test user is
locked out** by this migration. They continue to log in exactly as before.

The gate only kicks in for NEW signups: the `/api/auth/register` route
explicitly inserts `approval_status: 'pending'`, overriding the default.
Login is blocked for any row where `approval_status` is `'pending'` or
`'rejected'`; only `'approved'` (or `undefined` from a pre-migration row)
clears the gate.

If you want to lock down ALL existing accounts as part of going live, run
this one-shot after applying the migration:

```sql
-- DESTRUCTIVE — only run if you want to require Neno to approve everyone.
UPDATE public.users SET approval_status = 'pending'
WHERE approval_status = 'approved';
```

By default we do NOT do this — existing test rows stay usable.

### How to apply

Same options as the RLS migration (Supabase CLI `supabase db push`, the SQL
Editor in the Dashboard, or `psql -f`). The migration is idempotent —
`ADD COLUMN IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS` mean it is safe
to re-run.

### Verification

The SQL file ends with four verification queries:
1. `information_schema.columns` lookup for the five new columns
2. CHECK constraint inspection on `public.users`
3. Distribution of `approval_status` (expect everyone `'approved'` initially)
4. Partial index lookup in `pg_indexes`

### Surface area in the app

- `/api/auth/register` writes `approval_status: 'pending'` and returns
  `{ pending_approval: true, message }` to the client.
- `/api/auth/login` returns `403 { error: 'pending_approval' | 'rejected' }`
  when blocked; the response strips `approval_status` on success.
- `/api/admin/users/pending` (GET, bearer-guarded) lists up to 100 pending
  users, newest first, with only `id,name,phone,email,user_type,created_at`.
- `/api/admin/users/[id]/approval` (POST, bearer-guarded) sets the row to
  approved or rejected with full audit-trail bookkeeping.
- The `/admin` page renders a "Solicitudes de cuenta pendientes" panel above
  the stats grid; the rejection flow uses `window.prompt()` to collect an
  optional reason (kept simple for MVP — can swap for a modal later).

---

## Account schema teardown (2026-05-13)

### What this migration does

`supabase/migrations/20260513000000_drop_unused_tables.sql` issues a single
`BEGIN; DROP TABLE IF EXISTS ... CASCADE; COMMIT;` against the eight tables
that backed the customer/technician portal:

- `public.notifications`
- `public.service_warranties`
- `public.availability_slots`
- `public.service_codes`
- `public.service_requests`
- `public.customer_profiles`
- `public.electrician_profiles`
- `public.users`

The whole customer-portal surface (`/customer-dashboard`, `/dashboard`,
`/account-creation`, `AuthModal`, `SettingsModal`, the notification bell, the
`/api/auth/*` and `/api/admin/users/*` routes, and the matching `db.*`
helpers in `src/lib/supabase.ts`) was deleted in the same commit, so nothing
left in the codebase reads or writes these tables.

The two earlier 2026-05-12 migrations (RLS lockdown + approval gate) were
deleted from the repo as part of the same teardown — they were never applied
to the live project, and the tables they touched are being dropped anyway.

### Tables kept

`ms_leads`, `ms_call_analysis`, `ms_prompt_versions`, `ms_weekly_insights` —
Ana's lead capture, call analysis, prompt versioning, and the weekly
insights surface for `/admin`. All four are service-role only.

### How to apply

This migration is **destructive and irreversible**. Apply only after
confirming there is no production data on the listed tables. Pre-launch,
there is none — that's the precondition for this teardown.

**Supabase Dashboard (recommended for one-shot destructive runs):**
1. Open `https://supabase.com/dashboard/project/ncnbwaxtugvswavbrpck`.
2. Sidebar → **SQL Editor** → **New query**.
3. Paste the entire contents of
   `supabase/migrations/20260513000000_drop_unused_tables.sql`.
4. Click **Run**. The transaction commits atomically.
5. Run the verification query at the bottom of the file — it should return
   zero rows.

**Or via CLI:**
```bash
supabase db push
```

### Rollback

There is none. The dropped tables held customer/technician account data,
service requests, and warranties — all of which were pre-launch test rows
with no business value. If we ever rebuild a customer portal we will design
a fresh schema, not restore this one.

### After applying

The remaining `public` schema should contain only:

```
ms_leads
ms_call_analysis
ms_prompt_versions
ms_weekly_insights
```

(plus whatever Supabase auth + storage extension tables exist by default).
