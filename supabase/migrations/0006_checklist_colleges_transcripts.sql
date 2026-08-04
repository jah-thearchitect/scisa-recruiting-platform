-- Recruiting checklist (global, admin-curated content — not per-athlete),
-- top-5 college choice list, and transcript upload.

create table checklist_items (
  id uuid primary key default gen_random_uuid(),
  stage text not null check (stage in ('freshman_sophomore', 'junior', 'senior')),
  item_text text not null,
  sort_order int not null default 0
);

alter table checklist_items enable row level security;

create policy "public can read checklist items" on checklist_items
  for select using (true);

insert into checklist_items (stage, item_text, sort_order) values
  ('freshman_sophomore', 'Track core courses each semester (English, math, science, social studies, foreign language)', 1),
  ('freshman_sophomore', 'Learn the difference between NCAA and NAIA eligibility requirements', 2),
  ('freshman_sophomore', 'Build an initial highlight film (4-5 minutes, raw traits)', 3),
  ('freshman_sophomore', 'Set up a clean, professional social media presence (headshot, bio with school/grad year/position/height-weight)', 4),
  ('freshman_sophomore', 'Talk with family about what''s appropriate to post publicly', 5),
  ('junior', 'Register with the NCAA Eligibility Center (start of junior year)', 1),
  ('junior', 'Update varsity tape weekly during season; best plays in the first 45 seconds', 2),
  ('junior', 'Email Position Coaches and Directors of Player Personnel directly', 3),
  ('junior', 'Take unofficial visits (regional schools, game days, spring practice)', 4),
  ('junior', 'Check current recruiting contact periods before assuming a coach can reach out', 5),
  ('junior', 'Build your top-5 college choice list', 6),
  ('senior', 'Take official visits (NCAA-allotted, college-paid)', 1),
  ('senior', 'Coordinate with your school guidance counselor for transcripts and test scores', 2),
  ('senior', 'Upload your current transcript to your profile', 3),
  ('senior', 'Understand the difference between an NLI and a financial aid agreement', 4),
  ('senior', 'Confirm any NIL-related offers with your athletic director before signing', 5),
  ('senior', 'Finalize your commitment decision', 6);

create table athlete_checklist_progress (
  athlete_id uuid references athlete_profile(id) on delete cascade not null,
  item_id uuid references checklist_items(id) on delete cascade not null,
  completed_at timestamptz not null default now(),
  primary key (athlete_id, item_id)
);

alter table athlete_checklist_progress enable row level security;

create policy "athlete manages own checklist progress" on athlete_checklist_progress
  for all using (
    athlete_id in (select id from athlete_profile where user_id = auth.uid())
  ) with check (
    athlete_id in (select athlete_id from guardian_consent)
    and athlete_id in (select id from athlete_profile where user_id = auth.uid())
  );

create policy "admins can read checklist progress" on athlete_checklist_progress
  for select using (
    exists (select 1 from school_admins where user_id = auth.uid())
  );

-- Top-5 target college list. Reuses contact_type as the recruiting status
-- ("contact, visits, etc." per the product ask). Private to the athlete and
-- school admins — not shown on the public Coach View (it's the athlete's
-- own strategy notes, not a public résumé fact).
create table college_choices (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references athlete_profile(id) on delete cascade not null,
  college_name text not null,
  sport sport not null,
  coach_name text,
  coach_email text,
  coach_phone text,
  location text,
  status contact_type not null default 'outreach_sent',
  created_at timestamptz not null default now()
);

alter table college_choices enable row level security;

create policy "athlete manages own college choices" on college_choices
  for all using (
    athlete_id in (select id from athlete_profile where user_id = auth.uid())
  ) with check (
    athlete_id in (select athlete_id from guardian_consent)
    and athlete_id in (select id from athlete_profile where user_id = auth.uid())
  );

create policy "admins can read college choices" on college_choices
  for select using (
    exists (select 1 from school_admins where user_id = auth.uid())
  );

-- Transcript upload: private storage, not public like headshots. Athlete
-- reads/writes their own; admins can read for eligibility verification.
alter table academic_profile add column transcript_path text;

insert into storage.buckets (id, name, public)
values ('transcripts', 'transcripts', false)
on conflict (id) do nothing;

create policy "athlete can upload own transcript" on storage.objects
  for insert with check (
    bucket_id = 'transcripts'
    and (storage.foldername(name))[1] in (
      select id::text from athlete_profile where user_id = auth.uid()
    )
  );

create policy "athlete can replace own transcript" on storage.objects
  for update using (
    bucket_id = 'transcripts'
    and (storage.foldername(name))[1] in (
      select id::text from athlete_profile where user_id = auth.uid()
    )
  );

create policy "athlete can read own transcript" on storage.objects
  for select using (
    bucket_id = 'transcripts'
    and (storage.foldername(name))[1] in (
      select id::text from athlete_profile where user_id = auth.uid()
    )
  );

create policy "admins can read transcripts" on storage.objects
  for select using (
    bucket_id = 'transcripts'
    and exists (select 1 from school_admins where user_id = auth.uid())
  );
