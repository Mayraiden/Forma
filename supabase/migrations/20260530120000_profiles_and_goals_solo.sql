-- Forma: profiles + goals solo MVP foundation + RLS
-- Apply: Supabase SQL Editor (Run) OR `pnpm exec supabase db push`
-- After apply: `pnpm gen:types`

-- ---------------------------------------------------------------------------
-- 1. PROFILES
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Public user layer for Forma. id = auth.users.id';

-- Backfill existing auth users (email + OAuth)
insert into public.profiles (id, display_name, avatar_url)
select
  u.id,
  coalesce(
    u.raw_user_meta_data ->> 'display_name',
    u.raw_user_meta_data ->> 'full_name',
    u.raw_user_meta_data ->> 'name',
    split_part(u.email, '@', 1)
  ),
  coalesce(
    u.raw_user_meta_data ->> 'avatar_url',
    u.raw_user_meta_data ->> 'picture'
  )
from auth.users u
on conflict (id) do update
set
  display_name = coalesce(public.profiles.display_name, excluded.display_name),
  avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
  updated_at = now();

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;

create trigger profiles_updated_at
before update on public.profiles
for each row
execute function public.handle_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'display_name',
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    ),
    coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'picture'
    )
  )
  on conflict (id) do update
  set
    display_name = coalesce(public.profiles.display_name, excluded.display_name),
    avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated"
on public.profiles
for select
to authenticated
using (true);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- 2. GOALS — new columns
-- ---------------------------------------------------------------------------

alter table public.goals
  add column if not exists mode text not null default 'solo',
  add column if not exists timing_type text not null default 'open_ended',
  add column if not exists starts_at date not null default current_date,
  add column if not exists ends_at date,
  add column if not exists timezone text not null default 'UTC';

alter table public.goals drop constraint if exists goals_mode_check;
alter table public.goals
  add constraint goals_mode_check
  check (mode in ('solo', 'coop', 'competitive'));

alter table public.goals drop constraint if exists goals_timing_type_check;
alter table public.goals
  add constraint goals_timing_type_check
  check (timing_type in ('fixed_range', 'open_ended', 'manual'));

alter table public.goals drop constraint if exists goals_status_check;
alter table public.goals
  add constraint goals_status_check
  check (status in ('draft', 'pending', 'active', 'completed', 'failed', 'archived'));

alter table public.goals drop constraint if exists goals_fixed_range_dates_check;
alter table public.goals
  add constraint goals_fixed_range_dates_check
  check (
    timing_type <> 'fixed_range'
    or (starts_at is not null and ends_at is not null and ends_at >= starts_at)
  );

-- Point owner FK at profiles (same uuid as auth.users)
alter table public.goals drop constraint if exists goals_user_id_fkey;

alter table public.goals
  add constraint goals_user_id_fkey
  foreign key (user_id) references public.profiles (id) on delete cascade;

-- ---------------------------------------------------------------------------
-- 3. GOAL_MEMBERS
-- ---------------------------------------------------------------------------

create table if not exists public.goal_members (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'member',
  member_status text not null default 'accepted',
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  unique (goal_id, user_id)
);

alter table public.goal_members drop constraint if exists goal_members_role_check;
alter table public.goal_members
  add constraint goal_members_role_check
  check (role in ('owner', 'member'));

alter table public.goal_members drop constraint if exists goal_members_status_check;
alter table public.goal_members
  add constraint goal_members_status_check
  check (member_status in ('invited', 'accepted', 'declined', 'quit', 'eliminated'));

-- Backfill owner membership for existing goals
insert into public.goal_members (goal_id, user_id, role, member_status)
select g.id, g.user_id, 'owner', 'accepted'
from public.goals g
where not exists (
  select 1
  from public.goal_members gm
  where gm.goal_id = g.id and gm.user_id = g.user_id
);

create index if not exists goal_members_user_id_idx on public.goal_members (user_id);
create index if not exists goal_members_goal_id_idx on public.goal_members (goal_id);

-- ---------------------------------------------------------------------------
-- 4. GOAL_LOGS — user_id + log_date
-- ---------------------------------------------------------------------------

alter table public.goal_logs
  add column if not exists user_id uuid references public.profiles (id) on delete cascade,
  add column if not exists log_date date;

update public.goal_logs gl
set
  user_id = g.user_id,
  log_date = coalesce(gl.completed_at::date, gl.created_at::date, current_date)
from public.goals g
where gl.goal_id = g.id
  and (gl.user_id is null or gl.log_date is null);

alter table public.goal_logs
  alter column user_id set not null,
  alter column log_date set not null;

alter table public.goal_logs drop constraint if exists goal_logs_goal_user_date_key;
alter table public.goal_logs
  add constraint goal_logs_goal_user_date_key
  unique (goal_id, user_id, log_date);

create index if not exists goal_logs_goal_id_log_date_idx
  on public.goal_logs (goal_id, log_date);

-- ---------------------------------------------------------------------------
-- 5. RLS — GOALS
-- ---------------------------------------------------------------------------

alter table public.goals enable row level security;

drop policy if exists "goals_select_members" on public.goals;
create policy "goals_select_members"
on public.goals
for select
to authenticated
using (
  exists (
    select 1
    from public.goal_members gm
    where gm.goal_id = goals.id
      and gm.user_id = auth.uid()
  )
);

drop policy if exists "goals_insert_owner" on public.goals;
create policy "goals_insert_owner"
on public.goals
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "goals_update_owner" on public.goals;
create policy "goals_update_owner"
on public.goals
for update
to authenticated
using (
  exists (
    select 1
    from public.goal_members gm
    where gm.goal_id = goals.id
      and gm.user_id = auth.uid()
      and gm.role = 'owner'
  )
)
with check (
  exists (
    select 1
    from public.goal_members gm
    where gm.goal_id = goals.id
      and gm.user_id = auth.uid()
      and gm.role = 'owner'
  )
);

drop policy if exists "goals_delete_owner" on public.goals;
create policy "goals_delete_owner"
on public.goals
for delete
to authenticated
using (
  exists (
    select 1
    from public.goal_members gm
    where gm.goal_id = goals.id
      and gm.user_id = auth.uid()
      and gm.role = 'owner'
  )
);

-- ---------------------------------------------------------------------------
-- 6. RLS — GOAL_MEMBERS
-- ---------------------------------------------------------------------------

alter table public.goal_members enable row level security;

drop policy if exists "goal_members_select_same_goal" on public.goal_members;
create policy "goal_members_select_same_goal"
on public.goal_members
for select
to authenticated
using (
  exists (
    select 1
    from public.goal_members gm
    where gm.goal_id = goal_members.goal_id
      and gm.user_id = auth.uid()
  )
);

drop policy if exists "goal_members_insert_self_owner" on public.goal_members;
create policy "goal_members_insert_self_owner"
on public.goal_members
for insert
to authenticated
with check (
  user_id = auth.uid()
  and role = 'owner'
  and member_status = 'accepted'
  and exists (
    select 1
    from public.goals g
    where g.id = goal_id
      and g.user_id = auth.uid()
  )
);

drop policy if exists "goal_members_update_own" on public.goal_members;
create policy "goal_members_update_own"
on public.goal_members
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 7. RLS — GOAL_LOGS
-- ---------------------------------------------------------------------------

alter table public.goal_logs enable row level security;

drop policy if exists "goal_logs_select_members" on public.goal_logs;
create policy "goal_logs_select_members"
on public.goal_logs
for select
to authenticated
using (
  exists (
    select 1
    from public.goal_members gm
    where gm.goal_id = goal_logs.goal_id
      and gm.user_id = auth.uid()
  )
);

drop policy if exists "goal_logs_insert_own_active_goal" on public.goal_logs;
create policy "goal_logs_insert_own_active_goal"
on public.goal_logs
for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.goal_members gm
    where gm.goal_id = goal_logs.goal_id
      and gm.user_id = auth.uid()
      and gm.member_status = 'accepted'
  )
  and exists (
    select 1
    from public.goals g
    where g.id = goal_logs.goal_id
      and g.status = 'active'
  )
);

drop policy if exists "goal_logs_delete_own" on public.goal_logs;
create policy "goal_logs_delete_own"
on public.goal_logs
for delete
to authenticated
using (user_id = auth.uid());
