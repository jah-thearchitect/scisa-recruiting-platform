// Mirrors the JSON schema in docs/blueprint.md and the SQL in supabase/migrations.

export type Sport = "football" | "track" | "basketball";

export type RecordedMethod = "self_reported" | "coach_verified" | "combine_verified";

export type ContactType =
  | "outreach_sent"
  | "response_received"
  | "unofficial_visit"
  | "official_visit"
  | "offer";

export interface GuardianConsent {
  id: string;
  athlete_id: string;
  guardian_name: string;
  guardian_email: string;
  guardian_phone: string | null;
  consent_given_at: string;
  athlete_is_minor: boolean;
}

export interface AthleteProfile {
  id: string;
  full_name: string;
  grad_class_year: number;
  school_affiliation: string;
  date_of_birth: string | null;
  headshot_url: string | null;
  athlete_phone: string | null;
  athlete_contact_email: string | null;
  height_inches: number | null;
  weight_lbs: number | null;
  hand_size_in: number | null;
  arm_length_in: number | null;
  created_at: string;
  archived_at: string | null;
}

// Up to 3 per athlete (enforced in the UI, not the DB).
export interface AthleteSport {
  id: string;
  athlete_id: string;
  sport: Sport;
  position_primary: string;
  position_secondary: string | null;
}

export interface PerformanceMetric {
  id: string;
  athlete_id: string;
  sport: Sport;
  metric_name: string;
  value: number;
  unit: string;
  recorded_method: RecordedMethod;
  verified_by: string | null;
  verified_date: string | null;
}

export interface AcademicProfile {
  athlete_id: string;
  gpa_weighted: number | null;
  gpa_unweighted: number | null;
  sat_score: number | null;
  act_score: number | null;
  intended_majors: string[];
  counselor_name: string | null;
  counselor_email: string | null;
  transcript_path: string | null;
}

export interface MediaAndContacts {
  athlete_id: string;
  social_x: string | null;
  social_instagram: string | null;
  head_coach_name: string | null;
  head_coach_phone: string | null;
  head_coach_email: string | null;
}

export interface AthleteVideoLink {
  id: string;
  athlete_id: string;
  url: string;
  label: string | null;
  created_at: string;
}

export interface RecruitingInterestLogEntry {
  id: string;
  athlete_id: string;
  college_name: string;
  contact_type: ContactType;
  date: string;
  notes: string | null;
}

export type ChecklistStage = "freshman_sophomore" | "junior" | "senior";

export interface ChecklistItem {
  id: string;
  stage: ChecklistStage;
  item_text: string;
  sort_order: number;
}

export interface AthleteChecklistProgress {
  athlete_id: string;
  item_id: string;
  completed_at: string;
}

// Reuses ContactType as the recruiting status for a target school
// ("contact, visits, etc.").
export interface CollegeChoice {
  id: string;
  athlete_id: string;
  college_name: string;
  sport: Sport;
  coach_name: string | null;
  coach_email: string | null;
  coach_phone: string | null;
  location: string | null;
  status: ContactType;
  created_at: string;
}

export const MAX_COLLEGE_CHOICES = 5;

export const CHECKLIST_STAGE_LABELS: Record<ChecklistStage, string> = {
  freshman_sophomore: "Freshman & Sophomore",
  junior: "Junior",
  senior: "Senior",
};

// Computes which stage an athlete currently falls in from their grad year.
// Assumes graduation happens in the spring of grad_class_year (consistent
// with the June 1 assumption used elsewhere for the archive lifecycle).
export function currentChecklistStage(gradClassYear: number): ChecklistStage {
  const now = new Date();
  const schoolYear = now.getMonth() >= 6 ? now.getFullYear() + 1 : now.getFullYear();
  const yearsToGraduation = gradClassYear - schoolYear;
  if (yearsToGraduation <= 1) return "senior";
  if (yearsToGraduation === 2) return "junior";
  return "freshman_sophomore";
}

export const ALL_SPORTS: Sport[] = ["football", "track", "basketball"];
export const MAX_SPORTS_PER_ATHLETE = 3;

// Sport-conditional position lists, extend as more sports are added.
export const POSITIONS_BY_SPORT: Record<Sport, string[]> = {
  football: [
    "QB", "RB", "FB", "WR", "TE", "OL", "DL", "LB", "CB", "S", "K", "P", "ATH",
  ],
  track: ["Sprints", "Distance", "Hurdles", "Jumps", "Throws", "Relay"],
  basketball: ["PG", "SG", "SF", "PF", "C"],
};

// Sport-conditional performance metric names.
export const METRICS_BY_SPORT: Record<Sport, string[]> = {
  football: ["40yd_dash", "vertical_jump", "broad_jump", "bench_press", "shuttle_20yd", "squat"],
  track: ["100m", "200m", "400m", "800m", "1600m", "long_jump", "high_jump", "shot_put"],
  basketball: ["vertical_jump", "40yd_dash", "3pt_pct", "ft_pct"],
};
