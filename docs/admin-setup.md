# Setting up the Supabase project + first admin account

## 1. Create the Supabase project

1. Go to https://supabase.com and sign in / sign up (free tier is fine to start).
2. **New project** → name it (e.g. `ben-lippen-athletics`), set a database password (save it somewhere safe — you likely won't need it day-to-day, Supabase Auth handles app logins separately), pick a region close to South Carolina (e.g. `us-east-1`).
3. Wait ~2 minutes for provisioning.

## 2. Run the schema migrations

In the Supabase dashboard: **SQL Editor** → **New query** → paste and run each file in order:

1. `supabase/migrations/0001_init.sql`
2. `supabase/migrations/0002_admin.sql`

## 3. Get the app connected

**Project Settings → API** → copy:
- **Project URL**
- **anon public** key (NOT the `service_role` key — that one should never leave the dashboard)

Give those two values to Claude, or paste them directly into `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=<project url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key>
```

## 4. Create Shannon Glenn's login

Go to `/admin/login` in the running app and sign up with:
- Email: `shannon.glenn@benlippen.com`
- Password: `Falcons27`

This creates the Supabase Auth account, but it has no dashboard access yet — signing up alone doesn't grant admin rights (by design, so nobody can self-grant roster access).

## 5. Grant admin (roster) access

Back in Supabase **SQL Editor**, run:

```sql
insert into school_admins (user_id, full_name, school_affiliation)
select id, 'Shannon Glenn', 'Ben Lippen School'
from auth.users
where email = 'shannon.glenn@benlippen.com';
```

After that, signing in at `/admin/login` will land on the roster dashboard.
