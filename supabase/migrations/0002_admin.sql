-- School admin (coach/AD) role. Single-school product (per blueprint), so
-- any row in school_admins grants dashboard access — no cross-school
-- multi-tenancy needed at this stage.

create table school_admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null unique,
  full_name text not null,
  school_affiliation text not null,
  created_at timestamptz not null default now()
);

alter table school_admins enable row level security;

create policy "admins can read own admin record" on school_admins
  for select using (auth.uid() = user_id);

-- Admins can read guardian consent status for the verification/roster views.
-- Guardian consent content is otherwise private to the owning athlete.
create policy "admins can read guardian consent" on guardian_consent
  for select using (
    exists (select 1 from school_admins where user_id = auth.uid())
  );

-- Admins can verify (update) performance metrics — the sign-off step that
-- turns a self-reported number into recorded_method = 'coach_verified'.
create policy "admins can verify performance metrics" on performance_metrics
  for update using (
    exists (select 1 from school_admins where user_id = auth.uid())
  ) with check (
    exists (select 1 from school_admins where user_id = auth.uid())
  );

-- NOTE: the first school_admins row has no self-serve path (avoids letting
-- anyone grant themselves roster access at signup). After the athletic
-- director creates an account at /admin/login, insert their row manually:
--   insert into school_admins (user_id, full_name, school_affiliation)
--   values ('<their auth.users id>', 'Jane Doe', 'Example SCISA School');
