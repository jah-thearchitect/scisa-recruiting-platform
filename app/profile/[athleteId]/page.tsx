import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { PhotoBanner } from "@/components/PhotoBanner";
import type {
  AthleteProfile,
  AthleteSport,
  PerformanceMetric,
  AcademicProfile,
  MediaAndContacts,
  AthleteVideoLink,
  GuardianConsent,
} from "@/lib/db/schema";

function calculateAge(dob: string | null): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export default async function CoachViewPage({
  params,
}: {
  params: Promise<{ athleteId: string }>;
}) {
  const { athleteId } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("athlete_profile")
    .select("*")
    .eq("id", athleteId)
    .maybeSingle<AthleteProfile>();

  if (!profile) notFound();

  const [
    { data: sports },
    { data: allMetrics },
    { data: academic },
    { data: media },
    { data: videoLinks },
    { data: guardian },
  ] = await Promise.all([
    supabase
      .from("athlete_sports")
      .select("*")
      .eq("athlete_id", athleteId)
      .returns<AthleteSport[]>(),
    supabase
      .from("performance_metrics")
      .select("*")
      .eq("athlete_id", athleteId)
      .returns<PerformanceMetric[]>(),
    supabase
      .from("academic_profile")
      .select("*")
      .eq("athlete_id", athleteId)
      .maybeSingle<AcademicProfile>(),
    supabase
      .from("media_and_contacts")
      .select("*")
      .eq("athlete_id", athleteId)
      .maybeSingle<MediaAndContacts>(),
    supabase
      .from("athlete_video_links")
      .select("*")
      .eq("athlete_id", athleteId)
      .order("created_at", { ascending: false })
      .returns<AthleteVideoLink[]>(),
    supabase
      .from("guardian_consent")
      .select("*")
      .eq("athlete_id", athleteId)
      .maybeSingle<GuardianConsent>(),
  ]);

  const metrics = allMetrics ?? [];
  const athleteSports = sports ?? [];
  const playsFootball = athleteSports.some((s) => s.sport === "football");
  const age = calculateAge(profile.date_of_birth);

  // Coach view shows verified metrics only, unless a given metric has no
  // verified reading at all — then fall back to self-reported with a tag.
  // Grouped per sport since an athlete can play up to 3.
  const metricsBySport = new Map<string, PerformanceMetric[]>();
  for (const m of metrics) {
    const byName = new Map<string, PerformanceMetric[]>();
    for (const existing of metrics.filter((x) => x.sport === m.sport)) {
      byName.set(existing.metric_name, [
        ...(byName.get(existing.metric_name) ?? []),
        existing,
      ]);
    }
    metricsBySport.set(
      m.sport,
      Array.from(byName.values()).map((group) => {
        const verified = group.find((x) => x.recorded_method !== "self_reported");
        return verified ?? group[0];
      })
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <PhotoBanner
        src="/gallery/baseball-2.jpg"
        alt="Ben Lippen Falcons athletics"
        height={180}
      />

      <div className="mt-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {profile.headshot_url ? (
            <Image
              src={profile.headshot_url}
              alt={profile.full_name}
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-400">
              No photo
            </div>
          )}
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              {profile.full_name}
            </h1>
            <p className="mt-1 text-slate-600">
              Class of {profile.grad_class_year}
              {age !== null ? ` · Age ${age}` : ""} · {profile.school_affiliation}
            </p>
            {athleteSports.length > 0 && (
              <p className="mt-1 text-sm text-slate-600">
                {athleteSports
                  .map(
                    (s) =>
                      `${s.sport[0].toUpperCase()}${s.sport.slice(1)} (${s.position_primary}${
                        s.position_secondary ? `/${s.position_secondary}` : ""
                      })`
                  )
                  .join(" · ")}
              </p>
            )}
          </div>
        </div>
        <CopyLinkButton path={`/profile/${profile.id}`} />
      </div>

      <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {profile.height_inches && (
          <Stat label="Height" value={`${profile.height_inches}"`} />
        )}
        {profile.weight_lbs && (
          <Stat label="Weight" value={`${profile.weight_lbs} lbs`} />
        )}
        {playsFootball && profile.hand_size_in && (
          <Stat label="Hand" value={`${profile.hand_size_in}"`} />
        )}
        {playsFootball && profile.arm_length_in && (
          <Stat label="Arm" value={`${profile.arm_length_in}"`} />
        )}
      </section>

      {athleteSports.map((s) => {
        const sportMetrics = metricsBySport.get(s.sport) ?? [];
        if (sportMetrics.length === 0) return null;
        return (
          <section key={s.id} className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {s.sport} Performance
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {sportMetrics.map((m) => (
                <div
                  key={m.id}
                  className="rounded-md border border-slate-200 px-3 py-2"
                >
                  <p className="text-xs text-slate-500">{m.metric_name}</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {m.value} {m.unit}
                  </p>
                  <span
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs ${
                      m.recorded_method === "self_reported"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {m.recorded_method === "self_reported"
                      ? "Self-reported"
                      : m.recorded_method === "coach_verified"
                      ? "Coach verified"
                      : "Combine verified"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {academic && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Academics
          </h2>
          <p className="mt-2 text-sm text-slate-700">
            {academic.gpa_weighted && `GPA (weighted): ${academic.gpa_weighted}`}
            {academic.gpa_unweighted && ` · GPA (unweighted): ${academic.gpa_unweighted}`}
            {academic.sat_score && ` · SAT: ${academic.sat_score}`}
            {academic.act_score && ` · ACT: ${academic.act_score}`}
          </p>
          {academic.intended_majors?.length > 0 && (
            <p className="mt-1 text-sm text-slate-700">
              Intended major(s): {academic.intended_majors.join(", ")}
            </p>
          )}
        </section>
      )}

      {videoLinks && videoLinks.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Film
          </h2>
          <ul className="mt-2 flex flex-col gap-1">
            {videoLinks.map((v) => (
              <li key={v.id} className="text-sm">
                <a
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-slate-900 underline"
                >
                  {v.label || "Watch film"} →
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {media && (media.social_x || media.social_instagram || media.head_coach_name) && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Coach & Social
          </h2>
          {(media.head_coach_name || media.head_coach_email || media.head_coach_phone) && (
            <p className="mt-2 text-sm text-slate-700">
              Head coach: {media.head_coach_name}
              {media.head_coach_email && ` · ${media.head_coach_email}`}
              {media.head_coach_phone && ` · ${media.head_coach_phone}`}
            </p>
          )}
          {(media.social_x || media.social_instagram) && (
            <p className="mt-2 text-sm text-slate-700">
              {media.social_x && `X: @${media.social_x}`}
              {media.social_x && media.social_instagram && " · "}
              {media.social_instagram && `Instagram: @${media.social_instagram}`}
            </p>
          )}
        </section>
      )}

      {(profile.athlete_phone || profile.athlete_contact_email || guardian) && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Contact
          </h2>
          {(profile.athlete_phone || profile.athlete_contact_email) && (
            <p className="mt-2 text-sm text-slate-700">
              {profile.full_name}
              {profile.athlete_phone && ` · ${profile.athlete_phone}`}
              {profile.athlete_contact_email && ` · ${profile.athlete_contact_email}`}
            </p>
          )}
          {guardian && (
            <p className="mt-1 text-sm text-slate-700">
              Parent/Guardian — {guardian.guardian_name}
              {guardian.guardian_phone && ` · ${guardian.guardian_phone}`}
              {guardian.guardian_email && ` · ${guardian.guardian_email}`}
            </p>
          )}
        </section>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 px-3 py-2 text-center">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
