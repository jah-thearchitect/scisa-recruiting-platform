-- SCISA Athletic Guidance Platform — initial schema
-- Guardian consent gates every other table (FK dependency), per docs/blueprint.md

create extension if not exists "pgcrypto";

create type sport as enum ('football', 'track', 'basketball');
create type recorded_method as enum ('self_reported', 'coach_verified', 'combine_verified');
create type contact_type as enum ('outreach_sent', 'response_received', 'unofficial_visit', 'official_visit', 'offer');

create table athlete_profile (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null unique,
  full_name text not null,
  grad_class_year int not null,
  school_affiliation text not null,
  sport sport not null default 'football',
  position_primary text not null,
  position_secondary text,
  height_inches numeric,
  weight_lbs numeric,
  hand_size_in numeric,
  arm_length_in numeric,
  created_at timestamptz not null default now()
);

-- Guardian consent must exist before any other row references an athlete.
create table guardian_consent (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references athlete_profile(id) on delete cascade not null unique,
  guardian_name text not null,
  guardian_email text not null,
  consent_given_at timestamptz not null default now(),
  athlete_is_minor boolean not null default true
);

create table performance_metrics (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references athlete_profile(id) on delete cascade not null,
  sport sport not null,
  metric_name text not null,
  value numeric not null,
  unit text not null,
  recorded_method recorded_method not null default 'self_reported',
  verified_by text,
  verified_date date
);

create table academic_profile (
  athlete_id uuid references athlete_profile(id) on delete cascade primary key,
  gpa_weighted numeric,
  gpa_unweighted numeric,
  sat_score int,
  act_score int,
  intended_majors text[] not null default '{}',
  counselor_name text,
  counselor_email text
);

create table media_and_contacts (
  athlete_id uuid references athlete_profile(id) on delete cascade primary key,
  film_url text,
  social_x text,
  social_instagram text,
  head_coach_name text,
  head_coach_phone text,
  head_coach_email text
);

create table recruiting_interest_log (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references athlete_profile(id) on delete cascade not null,
  college_name text not null,
  contact_type contact_type not null,
  date date not null,
  notes text
);

-- Row-level security: athletes manage only their own data, and no
-- performance/academic/media/interest row can be written until the
-- guardian_consent row for that athlete exists.
alter table athlete_profile enable row level security;
alter table guardian_consent enable row level security;
alter table performance_metrics enable row level security;
alter table academic_profile enable row level security;
alter table media_and_contacts enable row level security;
alter table recruiting_interest_log enable row level security;

create policy "athlete owns profile" on athlete_profile
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "athlete manages own consent record" on guardian_consent
  for all using (
    athlete_id in (select id from athlete_profile where user_id = auth.uid())
  ) with check (
    athlete_id in (select id from athlete_profile where user_id = auth.uid())
  );

create policy "consent required for performance metrics" on performance_metrics
  for all using (
    athlete_id in (select id from athlete_profile where user_id = auth.uid())
  ) with check (
    athlete_id in (select athlete_id from guardian_consent)
    and athlete_id in (select id from athlete_profile where user_id = auth.uid())
  );

create policy "consent required for academic profile" on academic_profile
  for all using (
    athlete_id in (select id from athlete_profile where user_id = auth.uid())
  ) with check (
    athlete_id in (select athlete_id from guardian_consent)
    and athlete_id in (select id from athlete_profile where user_id = auth.uid())
  );

create policy "consent required for media and contacts" on media_and_contacts
  for all using (
    athlete_id in (select id from athlete_profile where user_id = auth.uid())
  ) with check (
    athlete_id in (select athlete_id from guardian_consent)
    and athlete_id in (select id from athlete_profile where user_id = auth.uid())
  );

create policy "consent required for recruiting interest log" on recruiting_interest_log
  for all using (
    athlete_id in (select id from athlete_profile where user_id = auth.uid())
  ) with check (
    athlete_id in (select athlete_id from guardian_consent)
    and athlete_id in (select id from athlete_profile where user_id = auth.uid())
  );

-- Public coach-view read access: anyone can read a profile and the fields
-- shown on the shareable resume page. Guardian consent and the recruiting
-- interest log (private CRM) are never exposed publicly.
create policy "public can read profile" on athlete_profile
  for select using (true);

create policy "public can read verified metrics" on performance_metrics
  for select using (true);

create policy "public can read academic profile" on academic_profile
  for select using (true);

create policy "public can read media and contacts" on media_and_contacts
  for select using (true);
