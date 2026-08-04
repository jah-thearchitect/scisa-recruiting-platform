-- Expands the athlete profile: headshot, date of birth, athlete contact
-- info, guardian phone, multi-sport support (up to 3, enforced in the app
-- UI not the DB), and multiple video links replacing the single film_url.

alter table athlete_profile
  add column date_of_birth date,
  add column headshot_url text,
  add column athlete_phone text,
  add column athlete_contact_email text;

-- Sport/position move to their own table (an athlete can play up to 3
-- sports, each with its own position) — drop the old single-sport columns.
alter table athlete_profile
  drop column sport,
  drop column position_primary,
  drop column position_secondary;

alter table guardian_consent
  add column guardian_phone text;

-- Per product decision: guardian contact is shown on the public Coach View
-- (college coaches routinely need to reach a parent directly for a minor).
create policy "public can read guardian consent" on guardian_consent
  for select using (true);

create table athlete_sports (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references athlete_profile(id) on delete cascade not null,
  sport sport not null,
  position_primary text not null,
  position_secondary text,
  unique (athlete_id, sport)
);

alter table athlete_sports enable row level security;

create policy "athlete manages own sports" on athlete_sports
  for all using (
    athlete_id in (select id from athlete_profile where user_id = auth.uid())
  ) with check (
    athlete_id in (select athlete_id from guardian_consent)
    and athlete_id in (select id from athlete_profile where user_id = auth.uid())
  );

create policy "public can read athlete sports" on athlete_sports
  for select using (true);

-- Replaces the single media_and_contacts.film_url — an athlete can add
-- multiple labeled video links over time.
create table athlete_video_links (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references athlete_profile(id) on delete cascade not null,
  url text not null,
  label text,
  created_at timestamptz not null default now()
);

alter table athlete_video_links enable row level security;

create policy "athlete manages own video links" on athlete_video_links
  for all using (
    athlete_id in (select id from athlete_profile where user_id = auth.uid())
  ) with check (
    athlete_id in (select athlete_id from guardian_consent)
    and athlete_id in (select id from athlete_profile where user_id = auth.uid())
  );

create policy "public can read video links" on athlete_video_links
  for select using (true);

alter table media_and_contacts drop column if exists film_url;

-- Headshot storage: a public bucket, files stored at "<athlete_id>/headshot.*".
insert into storage.buckets (id, name, public)
values ('headshots', 'headshots', true)
on conflict (id) do nothing;

create policy "athlete can upload own headshot" on storage.objects
  for insert with check (
    bucket_id = 'headshots'
    and (storage.foldername(name))[1] in (
      select id::text from athlete_profile where user_id = auth.uid()
    )
  );

create policy "athlete can replace own headshot" on storage.objects
  for update using (
    bucket_id = 'headshots'
    and (storage.foldername(name))[1] in (
      select id::text from athlete_profile where user_id = auth.uid()
    )
  );

create policy "public can view headshots" on storage.objects
  for select using (bucket_id = 'headshots');
