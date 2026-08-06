import { redirect } from "next/navigation";
import { getCurrentAthlete } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ProfileBuilderWizard } from "@/components/ProfileBuilderWizard";
import { BrandHeader } from "@/components/BrandHeader";
import { PhotoBanner } from "@/components/PhotoBanner";
import { SignOutButton } from "@/components/SignOutButton";
import type {
  AthleteSport,
  PerformanceMetric,
  AcademicProfile,
  MediaAndContacts,
  AthleteVideoLink,
  RecruitingInterestLogEntry,
  ChecklistItem,
  CollegeChoice,
} from "@/lib/db/schema";

export default async function ProfileBuilderPage() {
  const athlete = await getCurrentAthlete();
  if (!athlete || !athlete.profile) redirect("/login");
  if (!athlete.consent) redirect("/consent");

  const supabase = await createClient();
  const athleteId = athlete.profile.id;

  const [
    { data: sports },
    { data: metrics },
    { data: academic },
    { data: checklistItems },
    { data: progress },
    { data: collegeChoices },
    { data: media },
    { data: videoLinks },
    { data: interestLog },
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
      .from("checklist_items")
      .select("*")
      .order("sort_order")
      .returns<ChecklistItem[]>(),
    supabase
      .from("athlete_checklist_progress")
      .select("item_id")
      .eq("athlete_id", athleteId),
    supabase
      .from("college_choices")
      .select("*")
      .eq("athlete_id", athleteId)
      .order("created_at")
      .returns<CollegeChoice[]>(),
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
      .from("recruiting_interest_log")
      .select("*")
      .eq("athlete_id", athleteId)
      .order("date", { ascending: false })
      .returns<RecruitingInterestLogEntry[]>(),
  ]);

  let transcriptUrl: string | null = null;
  if (academic?.transcript_path) {
    const { data: signed } = await supabase.storage
      .from("transcripts")
      .createSignedUrl(academic.transcript_path, 60 * 60);
    transcriptUrl = signed?.signedUrl ?? null;
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="flex items-center justify-between">
        <BrandHeader />
        <SignOutButton redirectTo="/login" />
      </div>

      <div className="mt-6">
        <PhotoBanner
          src="/gallery/basketball-boys-2.jpg"
          alt="Ben Lippen Falcons athletics"
          height={160}
        />
      </div>

      <h1 className="mt-6 text-2xl font-semibold text-slate-900">
        Build Your Athlete Profile
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        {athlete.profile.full_name} · Class of {athlete.profile.grad_class_year}{" "}
        · {athlete.profile.school_affiliation}
      </p>

      <div className="mt-8">
        <ProfileBuilderWizard
          profile={athlete.profile}
          sports={sports ?? []}
          metrics={metrics ?? []}
          academic={academic ?? null}
          transcriptUrl={transcriptUrl}
          checklistItems={checklistItems ?? []}
          completedItemIds={(progress ?? []).map((p) => p.item_id)}
          collegeChoices={collegeChoices ?? []}
          media={media ?? null}
          videoLinks={videoLinks ?? []}
          interestLog={interestLog ?? []}
        />
      </div>
    </main>
  );
}
