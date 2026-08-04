-- Schedules archive_and_purge_graduated_athletes() (defined in
-- 0003_roster_lifecycle.sql) to run daily. Requires the pg_cron extension.
--
-- If "create extension pg_cron" fails with a permissions error, enable it
-- first from the Supabase dashboard: Database -> Extensions -> search
-- "pg_cron" -> Enable. Then re-run this file.

create extension if not exists pg_cron with schema extensions;

select cron.schedule(
  'archive-and-purge-graduated-athletes',
  '0 3 * * *', -- daily at 3am UTC
  $$select archive_and_purge_graduated_athletes();$$
);
