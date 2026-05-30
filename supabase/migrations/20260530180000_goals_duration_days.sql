-- Goals: duration in days (start = creation date, end computed)
alter table public.goals
  add column if not exists duration_days integer;

alter table public.goals drop constraint if exists goals_duration_days_check;
alter table public.goals
  add constraint goals_duration_days_check
  check (duration_days is null or duration_days > 0);

update public.goals
set duration_days = (ends_at - starts_at) + 1
where ends_at is not null
  and duration_days is null;
