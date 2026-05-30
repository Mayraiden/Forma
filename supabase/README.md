# Supabase migrations

## One-time setup (CLI)

If `db push` says *Cannot find project ref*:

```bash
pnpm exec supabase init          # if no supabase/config.toml
pnpm exec supabase link --project-ref lbpfbzbbqjnkpesdqfjd
pnpm exec supabase login         # if not authenticated
```

Project ref = subdomain from `NEXT_PUBLIC_SUPABASE_URL` or `.env.local` → `NEXT_PUBLIC_SUPABASE_PROJECT_ID`.

## Apply migration

```bash
pnpm exec supabase db push
```

**Or Dashboard:** paste `migrations/20260530120000_profiles_and_goals_solo.sql` into SQL Editor → Run.

## After apply

```bash
pnpm gen:types
```

## What the first migration includes

- `profiles` + trigger on `auth.users` (email + Google OAuth)
- Backfill profiles for existing users
- `goals` columns: `mode`, `timing_type`, `starts_at`, `ends_at`, `timezone`
- `goal_members` + backfill owners for existing goals
- `goal_logs`: `user_id`, `log_date`, unique per day
- RLS on `profiles`, `goals`, `goal_members`, `goal_logs`

See `.cursor/project_planning/goals-solo-mvp.md` and `profiles.md`.
