-- Admin roster management: delete access, and the graduation-based
-- archive/purge lifecycle.
--
-- Lifecycle: a class's graduation date is assumed to be June 1 of
-- grad_class_year (schools don't give us an exact date, only the year).
-- A profile auto-archives 90 days after that date, and is permanently
-- deleted 365 days after that date (whether or not an admin looked at the
-- archive). Admins can also delete a profile immediately at any time.

alter table athlete_profile add column archived_at timestamptz;

-- Admins can permanently delete a profile. Cascades to guardian_consent,
-- performance_metrics, academic_profile, media_and_contacts, and
-- recruiting_interest_log via the existing "on delete cascade" FKs.
create policy "admins can delete athlete profile" on athlete_profile
  for delete using (
    exists (select 1 from school_admins where user_id = auth.uid())
  );

create or replace function graduation_date(grad_year int)
returns date
language sql
immutable
as $$
  select make_date(grad_year, 6, 1);
$$;

create or replace function archive_and_purge_graduated_athletes()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update athlete_profile
  set archived_at = now()
  where archived_at is null
    and graduation_date(grad_class_year) + interval '90 days' <= now();

  delete from athlete_profile
  where archived_at is not null
    and graduation_date(grad_class_year) + interval '365 days' <= now();
end;
$$;
