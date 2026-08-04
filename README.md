# Ben Lippen Athletics: Next Level

A recruiting-guidance platform for Ben Lippen School (Columbia, SC) — a recruiting timeline course, a multi-sport athlete profile builder, a shareable public "Coach View" résumé page, and a school admin dashboard.

**Live:** https://scisa-recruiting-platform.vercel.app

## Stack

Next.js (App Router, TypeScript) + Tailwind v4 + Supabase (Postgres, Auth, Storage), deployed on Vercel.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll need a `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Database

Schema lives in `supabase/migrations/`, run in order against a Supabase project's SQL Editor. See [`docs/admin-setup.md`](docs/admin-setup.md) for first-time project setup, including granting the first school admin dashboard access.

## Deployment

Deployed via Vercel, connected to this GitHub repo — pushes to `main` deploy automatically.
