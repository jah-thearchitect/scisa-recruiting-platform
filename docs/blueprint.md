# SCISA Athletic Guidance Counselor Platform — Build Blueprint (v2)

**Client:** SCISA member school (private, South Carolina) — Football launch, multi-sport architecture
**Purpose:** Digital platform helping athletes get recruited *by colleges* (not school-to-school recruiting, which SCISA prohibits). Two modules: Educational Guidance Course + Interactive Athlete Profile Builder.
**Build target:** React + Tailwind (or single-file HTML/JS prototype), paste into Claude.ai / Claude Code in the three phases at the bottom.

---

## Compliance Framing (read this before writing any copy)

- This tool supports **outbound college recruiting only.** SCISA's own recruiting rules govern *inbound* transfers (a school recruiting a student to itself), which is a different — and prohibited — thing. Nothing in this platform should look like it's soliciting transfers.
- **NIL guidance must be framed as "check current rules," not stated as fixed policy.** South Carolina NIL rules for high schoolers are actively in flux (SCHSL banned compensation in 2025; SCISA's position is not formally codified in bylaws as of the last available record; state legislation is still moving). Write the NIL section as evergreen advice ("confirm with your school's athletic director before signing anything") rather than asserting a specific rule that could go stale.
- **This platform collects data on minors.** Every profile requires parent/guardian consent captured at account creation — not implied by a "Parent Note" content tag. Model this the same way as COMMITTED's legal compliance block: consent gate before any data is stored, guardian email on file, re-consent if the athlete turns 18 mid-cycle.

---

## Module 1: The Digital Roadmap (Educational Course)

**UI:** Tabbed course interface, progress tracker ("35% Complete"), visual tags for `[Athlete Action]` and `[Parent Note]`. Sport selector at the top (defaults to Football; architecture should not assume football elsewhere in the UI).

### Track 1 — Core Recruiting Timeline

**Freshman & Sophomore — The Foundation**
- Academic benchmarking: track core courses now. Explain the difference between NCAA Eligibility Center and NAIA Eligibility Center requirements plainly, side by side.
- **Add: Eligibility Center registration timing.** Most athletes should register with the NCAA Eligibility Center at the *start of junior year* — this is commonly missed and worth its own callout box, not buried in a bullet.
- Initial highlight film: 4–5 minutes, raw traits, varsity snaps or elite JV dominance.
- Social architecture: public profiles, professional headshot, bio includes school, grad year, position, height/weight.

**Junior Year — Critical Acceleration**
- Varsity tape updated weekly; best 5 plays in the first 45 seconds.
- Direct outreach: target Position Coaches and Directors of Player Personnel, not head coaches.
- Unofficial visits: self-funded, regional, game days or spring practice.
- **Add: recruiting calendar awareness** — contact periods vary by division and change year to year; tell athletes to confirm current dead/quiet/contact periods rather than memorizing a fixed calendar (NCAA rules shift annually).

**Senior Year — Closing**
- Official visits: NCAA-allotted, college-paid.
- Application sync: coordinate with the school's actual guidance counselor for transcripts/test scores.
- Commitment logistics: NLI vs. financial aid agreement — explain these are not the same binding instrument.

### Track 2 — SCISA & Regional Reality

- **SCISA Compliance Filter:** transfer sit-out periods, immediate eligibility constraints — sourced from the current SCISA Blue Book (link out; don't restate rules that change year to year as permanent copy).
- **NIL:** framed per the Compliance Framing section above — advisory, not declarative.
- **Regional College Mapping** (keep as-is, this section was strong):
  - FBS (elite metrics only): South Carolina, Clemson
  - FCS: The Citadel, Wofford, Furman, South Carolina State, Coastal Carolina
  - DII/DIII: Newberry, Limestone, Benedict
  - **Add: a simple self-assessment matrix** — athlete inputs their verified metrics, tool suggests a realistic tier (FBS / FCS / DII-DIII / preferred walk-on) rather than letting the athlete guess. This is the single highest-value addition to this track — it's the thing a real guidance counselor would actually do.

### Track 3 — Parent Toolbox

- Financial literacy: headcount vs. equivalency scholarships, explained clearly (this was accurate and well-written — keep).
- Private school stacking: merit aid + partial athletic aid.
- FAFSA + SC-specific aid: HOPE, LIFE, Palmetto Fellows — confirm current deadlines each cycle rather than hardcoding a date.
- Communication etiquette: athlete leads conversations with coaches; red-flag social behaviors to avoid.

---

## Module 2: Interactive Athlete Profile Builder

**UI:** Multi-step dynamic form → renders a shareable public "Coach View" resume page with a "Copy Link for College Coaches" button.

### Schema (sport-agnostic from day one)

```json
{
  "athlete_profile": {
    "id": "uuid",
    "full_name": "string",
    "grad_class_year": "int",
    "school_affiliation": "string (SCISA school name)",
    "sport": "enum [football, track, basketball, ...]",
    "positions": {
      "primary": "string (sport-conditional list)",
      "secondary": "string (sport-conditional list, optional)"
    },
    "physical_metrics": {
      "height_inches": "decimal",
      "weight_lbs": "decimal",
      "hand_size_in": "decimal (optional, sport-conditional)",
      "arm_length_in": "decimal (optional, sport-conditional)"
    },
    "guardian_consent": {
      "guardian_name": "string",
      "guardian_email": "string",
      "consent_given_at": "timestamp",
      "athlete_is_minor": "boolean"
    }
  },

  "performance_metrics": {
    "athlete_id": "uuid (FK)",
    "sport": "enum",
    "metric_name": "string (e.g. '40yd_dash', 'vertical_jump', sport-conditional list)",
    "value": "decimal",
    "unit": "string",
    "recorded_method": "enum [self_reported, coach_verified, combine_verified]",
    "verified_by": "string (coach name, null if self-reported)",
    "verified_date": "date, nullable"
  },

  "academic_profile": {
    "athlete_id": "uuid (FK)",
    "gpa_weighted": "decimal",
    "gpa_unweighted": "decimal",
    "sat_score": "int, optional",
    "act_score": "int, optional",
    "intended_majors": "array[string]",
    "counselor_name": "string",
    "counselor_email": "string"
  },

  "media_and_contacts": {
    "athlete_id": "uuid (FK)",
    "film_url": "string (Hudl/YouTube/Vimeo)",
    "social_handles": { "x": "string, optional", "instagram": "string, optional" },
    "head_coach_name": "string",
    "head_coach_phone": "string",
    "head_coach_email": "string"
  },

  "recruiting_interest_log": {
    "athlete_id": "uuid (FK)",
    "college_name": "string",
    "contact_type": "enum [outreach_sent, response_received, unofficial_visit, official_visit, offer]",
    "date": "date",
    "notes": "string"
  }
}
```

**Notes on the additions:**
- `recruiting_interest_log` — the original blueprint had no way to *track* the recruiting process itself, only display a static profile. This is the CRM layer that makes it a guidance tool instead of just a digital business card.
- `guardian_consent` — required before any other table gets populated for a minor.
- `verified_by` / `recorded_method` on performance metrics — replaces the blueprint's unearned "Verified" label with an actual audit trail.

### Admin / Coach-Side View (new — not in original blueprint)

A school-facing dashboard, separate from the public coach-view resume:
- Roster list of all athletes with profile completion %
- Pending verification queue (metrics submitted, awaiting coach sign-off)
- Guardian consent status per athlete
- Export roster to PDF/CSV for the AD

---

## Claude.ai Execution Plan (3 phases)

**Phase 1 prompt:**
"Using this blueprint, write the complete textual content for Module 1, all three tracks. Tone: elite, encouraging, realistic — like an athletic director who's placed athletes before. Write full educational articles, not summaries. Where the blueprint says a rule is compliance-sensitive or time-sensitive (NIL, recruiting calendars, FAFSA deadlines), phrase it as 'confirm current rules with [school]/[NCAA]/[NAIA]' rather than stating a fixed rule as permanent fact."

**Phase 2 prompt:**
"Design the database schema and front-end form validation for Module 2 using the JSON structure provided, including the guardian consent gate, the sport-conditional metric fields, and the recruiting_interest_log table. Build the sleek multi-step UI component for athletes to fill this out."

**Phase 3 prompt:**
"Build two dashboards: (1) the public 'Coach View' — a clean, professional resume a scout can review in under 30 seconds, pulling verified metrics only unless no coach-verified value exists; (2) the school Admin View — roster, verification queue, and consent status, for the athletic director."
