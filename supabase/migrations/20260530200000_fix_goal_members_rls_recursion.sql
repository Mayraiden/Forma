-- Fix infinite recursion: goal_members policies must not self-query under RLS.
-- Use security definer helpers to check membership without re-entering policies.

create or replace function public.is_goal_member(p_goal_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.goal_members gm
    where gm.goal_id = p_goal_id
      and gm.user_id = auth.uid()
      and gm.member_status = 'accepted'
  );
$$;

create or replace function public.is_goal_owner(p_goal_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.goal_members gm
    where gm.goal_id = p_goal_id
      and gm.user_id = auth.uid()
      and gm.role = 'owner'
  );
$$;

grant execute on function public.is_goal_member(uuid) to authenticated;
grant execute on function public.is_goal_owner(uuid) to authenticated;

-- goals
drop policy if exists "goals_select_members" on public.goals;
create policy "goals_select_members"
on public.goals
for select
to authenticated
using (user_id = auth.uid() or public.is_goal_member(id));

drop policy if exists "goals_update_owner" on public.goals;
create policy "goals_update_owner"
on public.goals
for update
to authenticated
using (user_id = auth.uid() or public.is_goal_owner(id))
with check (user_id = auth.uid() or public.is_goal_owner(id));

drop policy if exists "goals_delete_owner" on public.goals;
create policy "goals_delete_owner"
on public.goals
for delete
to authenticated
using (user_id = auth.uid() or public.is_goal_owner(id));

-- goal_members
drop policy if exists "goal_members_select_same_goal" on public.goal_members;
create policy "goal_members_select_same_goal"
on public.goal_members
for select
to authenticated
using (public.is_goal_member(goal_id));

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

-- goal_logs
drop policy if exists "goal_logs_select_members" on public.goal_logs;
create policy "goal_logs_select_members"
on public.goal_logs
for select
to authenticated
using (public.is_goal_member(goal_id));

drop policy if exists "goal_logs_insert_own_active_goal" on public.goal_logs;
create policy "goal_logs_insert_own_active_goal"
on public.goal_logs
for insert
to authenticated
with check (
  user_id = auth.uid()
  and public.is_goal_member(goal_id)
  and exists (
    select 1
    from public.goals g
    where g.id = goal_logs.goal_id
      and g.status = 'active'
  )
);
