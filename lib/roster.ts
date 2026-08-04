import type { SupabaseClient } from "@supabase/supabase-js";
import type { AthleteProfile, AthleteSport } from "@/lib/db/schema";

export interface RosterRow {
  athlete: AthleteProfile;
  sports: AthleteSport[];
  consentGiven: boolean;
  pct: number;
}

export function completionPct(opts: {
  hasSports: boolean;
  hasPhysical: boolean;
  hasMetrics: boolean;
  hasAcademic: boolean;
  hasMedia: boolean;
  hasConsent: boolean;
}) {
  const checks = Object.values(opts);
  const complete = checks.filter(Boolean).length;
  return Math.round((complete / checks.length) * 100);
}

export function formatSports(sports: AthleteSport[]): string {
  if (sports.length === 0) return "—";
  return sports
    .map((s) => `${s.sport[0].toUpperCase()}${s.sport.slice(1)} (${s.position_primary})`)
    .join(", ");
}

export async function fetchRosterRows(
  supabase: SupabaseClient,
  { archived }: { archived: boolean }
): Promise<RosterRow[]> {
  let query = supabase.from("athlete_profile").select("*").order("full_name");
  query = archived ? query.not("archived_at", "is", null) : query.is("archived_at", null);
  const { data: athletes } = await query.returns<AthleteProfile[]>();

  return Promise.all(
    (athletes ?? []).map(async (a) => {
      const [{ data: sports }, { count: metricsCount }, { data: academic }, { data: media }, { data: consent }] =
        await Promise.all([
          supabase
            .from("athlete_sports")
            .select("*")
            .eq("athlete_id", a.id)
            .returns<AthleteSport[]>(),
          supabase
            .from("performance_metrics")
            .select("id", { count: "exact", head: true })
            .eq("athlete_id", a.id),
          supabase.from("academic_profile").select("athlete_id").eq("athlete_id", a.id).maybeSingle(),
          supabase.from("media_and_contacts").select("athlete_id").eq("athlete_id", a.id).maybeSingle(),
          supabase.from("guardian_consent").select("athlete_id").eq("athlete_id", a.id).maybeSingle(),
        ]);

      return {
        athlete: a,
        sports: sports ?? [],
        consentGiven: !!consent,
        pct: completionPct({
          hasSports: (sports ?? []).length > 0,
          hasPhysical: !!a.height_inches && !!a.weight_lbs,
          hasMetrics: (metricsCount ?? 0) > 0,
          hasAcademic: !!academic,
          hasMedia: !!media,
          hasConsent: !!consent,
        }),
      };
    })
  );
}

export interface RosterFilters {
  sport?: string;
  class?: string;
  consent?: string;
  q?: string;
  sort?: string;
}

export function filterAndSortRows(rows: RosterRow[], filters: RosterFilters): RosterRow[] {
  let result = rows;

  if (filters.sport) {
    result = result.filter((r) => r.sports.some((s) => s.sport === filters.sport));
  }
  if (filters.class) {
    result = result.filter((r) => String(r.athlete.grad_class_year) === filters.class);
  }
  if (filters.consent === "on_file") {
    result = result.filter((r) => r.consentGiven);
  } else if (filters.consent === "missing") {
    result = result.filter((r) => !r.consentGiven);
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    result = result.filter((r) => r.athlete.full_name.toLowerCase().includes(q));
  }

  const sorted = [...result];
  if (filters.sort === "class") {
    sorted.sort((a, b) => a.athlete.grad_class_year - b.athlete.grad_class_year);
  } else if (filters.sort === "completion") {
    sorted.sort((a, b) => b.pct - a.pct);
  } else {
    sorted.sort((a, b) => a.athlete.full_name.localeCompare(b.athlete.full_name));
  }

  return sorted;
}
