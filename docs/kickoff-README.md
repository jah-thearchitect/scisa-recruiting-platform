# SCISA Athletic Guidance Platform — Claude Code Kickoff

Standalone repo. Client-specific product for one SCISA member school, football-first, multi-sport architecture.

---

## Tech Stack (recommended default — override if you have a preference)

- **Frontend:** Next.js (React) + Tailwind CSS
- **Backend/DB:** Supabase (Postgres + Auth + Storage) — fastest path for a solo build, gives you auth and row-level security for guardian consent out of the box
- **Hosting:** Vercel (pairs cleanly with Next.js + Supabase)
- **Auth:** Supabase Auth, two roles minimum at launch — `athlete` and `school_admin` (coach/AD). Guardian consent is a gate, not a login role.

If you'd rather use something else (different DB, different hosting), say so before Claude Code scaffolds the repo — this is the one decision that's expensive to reverse mid-build.

---

## Repo Structure (starting point)

```
scisa-recruiting-platform/
├── app/                        # Next.js app router
│   ├── course/                 # Module 1 — educational course
│   │   ├── track-1-timeline/
│   │   ├── track-2-scisa-regional/
│   │   └── track-3-parent-toolbox/
│   ├── profile/                # Module 2 — athlete profile builder
│   │   ├── builder/            # multi-step form
│   │   └── [athleteId]/        # public coach-view resume page
│   ├── admin/                  # school-facing dashboard
│   │   ├── roster/
│   │   └── verification-queue/
│   └── consent/                # guardian consent flow — build this first
├── lib/
│   ├── db/schema.ts            # matches the JSON schema in the blueprint doc
│   └── supabase/
├── components/
└── docs/
    └── blueprint.md            # drop the finalized blueprint doc here for reference
```

---

## Build Order

Build the **consent gate before anything else** — every other table has a foreign key dependency on a consented guardian record, so sequencing this first avoids rework.

1. **Guardian consent flow** — before any athlete data entry is possible
2. **Athlete profile builder** (Module 2, schema as specified in the blueprint) — sport-conditional fields, `recorded_method`/`verified_by` on all performance metrics
3. **Public Coach View** — the shareable resume page
4. **School Admin View** — roster, verification queue, consent status
5. **Educational course content** (Module 1) — this is content-heavy, not logic-heavy, so it's fine to build last or in parallel once the data layer is stable

---

## Prompts to run in Claude Code, in order

Paste `docs/blueprint.md` (the finalized SCISA blueprint) into context first, then run:

1. *"Scaffold this Next.js + Supabase project per the repo structure in this README. Set up the guardian consent flow first — it gates every other table."*
2. *"Build the athlete profile builder (Module 2) per the schema in blueprint.md — multi-step form, sport-conditional fields, verification metadata on performance metrics."*
3. *"Build the public Coach View resume page — pulls only coach-verified metrics unless none exist, in which case show self-reported with a visible tag."*
4. *"Build the school Admin View — roster, pending verification queue, guardian consent status, CSV/PDF export."*
5. *"Write the full Module 1 course content per the three tracks in blueprint.md — full educational articles, not summaries, with the compliance-sensitive sections (NIL, recruiting calendar) phrased as 'confirm current rules' per the Compliance Framing note."*

---

## Before you start

- Confirm you're good with Supabase/Next.js/Vercel, or tell Claude Code your actual preference before step 1 — this is the expensive-to-reverse decision.
- Have the SCISA Blue Book (or a link to it) on hand for step 5 — the course content shouldn't restate transfer/eligibility rules from memory.
