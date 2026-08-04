-- Tables created via the SQL editor don't automatically pick up the
-- table-level GRANTs that Supabase's dashboard-created tables get by
-- default. RLS policies only decide which *rows* a role can see/change —
-- without the underlying GRANT, Postgres blocks the query before RLS is
-- even evaluated (this is what caused "permission denied for table
-- school_admins"). This is purely enabling roles to attempt operations;
-- RLS policies already in place remain the actual row-level security
-- boundary and are unchanged by this migration.

grant usage on schema public to anon, authenticated;

grant select on
  athlete_profile,
  guardian_consent,
  performance_metrics,
  academic_profile,
  media_and_contacts,
  athlete_sports,
  athlete_video_links,
  checklist_items
to anon;

grant all on
  athlete_profile,
  guardian_consent,
  performance_metrics,
  academic_profile,
  media_and_contacts,
  athlete_sports,
  athlete_video_links,
  recruiting_interest_log,
  checklist_items,
  athlete_checklist_progress,
  college_choices,
  school_admins
to authenticated;

-- So any table added in a future migration gets these grants automatically
-- instead of hitting this same bug again.
alter default privileges in schema public grant select on tables to anon;
alter default privileges in schema public grant all on tables to authenticated;
