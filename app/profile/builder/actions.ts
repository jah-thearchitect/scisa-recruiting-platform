"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAthlete } from "@/lib/auth";
import { MAX_SPORTS_PER_ATHLETE, MAX_COLLEGE_CHOICES, type Sport } from "@/lib/db/schema";

async function requireConsentedAthlete() {
  const athlete = await getCurrentAthlete();
  if (!athlete || !athlete.profile) redirect("/login");
  if (!athlete.consent) redirect("/consent");
  return athlete;
}

export async function updateBasicInfo(formData: FormData) {
  const athlete = await requireConsentedAthlete();
  const supabase = await createClient();

  await supabase
    .from("athlete_profile")
    .update({
      date_of_birth: String(formData.get("date_of_birth") || "") || null,
      athlete_phone: String(formData.get("athlete_phone") || "") || null,
      athlete_contact_email: String(formData.get("athlete_contact_email") || "") || null,
    })
    .eq("id", athlete.profile!.id);

  revalidatePath("/profile/builder");
}

export async function uploadHeadshot(formData: FormData) {
  const athlete = await requireConsentedAthlete();
  const supabase = await createClient();
  const file = formData.get("headshot");

  if (!(file instanceof File) || file.size === 0) {
    revalidatePath("/profile/builder");
    return;
  }

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${athlete.profile!.id}/headshot.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("headshots")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (!uploadError) {
    const {
      data: { publicUrl },
    } = supabase.storage.from("headshots").getPublicUrl(path);

    await supabase
      .from("athlete_profile")
      .update({ headshot_url: `${publicUrl}?v=${Date.now()}` })
      .eq("id", athlete.profile!.id);
  }

  revalidatePath("/profile/builder");
}

export async function addAthleteSport(formData: FormData) {
  const athlete = await requireConsentedAthlete();
  const supabase = await createClient();

  const { count } = await supabase
    .from("athlete_sports")
    .select("id", { count: "exact", head: true })
    .eq("athlete_id", athlete.profile!.id);

  if ((count ?? 0) >= MAX_SPORTS_PER_ATHLETE) {
    revalidatePath("/profile/builder");
    return;
  }

  await supabase.from("athlete_sports").insert({
    athlete_id: athlete.profile!.id,
    sport: String(formData.get("sport")) as Sport,
    position_primary: String(formData.get("position_primary")),
    position_secondary: String(formData.get("position_secondary") || "") || null,
  });

  revalidatePath("/profile/builder");
}

export async function deleteAthleteSport(formData: FormData) {
  const athlete = await requireConsentedAthlete();
  const supabase = await createClient();
  const sportId = String(formData.get("sport_id"));

  await supabase
    .from("athlete_sports")
    .delete()
    .eq("id", sportId)
    .eq("athlete_id", athlete.profile!.id);

  revalidatePath("/profile/builder");
}

export async function updatePhysicalMetrics(formData: FormData) {
  const athlete = await requireConsentedAthlete();
  const supabase = await createClient();

  await supabase
    .from("athlete_profile")
    .update({
      height_inches: Number(formData.get("height_inches")) || null,
      weight_lbs: Number(formData.get("weight_lbs")) || null,
      hand_size_in: Number(formData.get("hand_size_in")) || null,
      arm_length_in: Number(formData.get("arm_length_in")) || null,
    })
    .eq("id", athlete.profile!.id);

  revalidatePath("/profile/builder");
}

export async function addPerformanceMetric(formData: FormData) {
  const athlete = await requireConsentedAthlete();
  const supabase = await createClient();

  await supabase.from("performance_metrics").insert({
    athlete_id: athlete.profile!.id,
    sport: String(formData.get("sport")) as Sport,
    metric_name: String(formData.get("metric_name")),
    value: Number(formData.get("value")),
    unit: String(formData.get("unit")),
    recorded_method: "self_reported",
  });

  revalidatePath("/profile/builder");
}

export async function deletePerformanceMetric(formData: FormData) {
  const athlete = await requireConsentedAthlete();
  const supabase = await createClient();
  const metricId = String(formData.get("metric_id"));

  await supabase
    .from("performance_metrics")
    .delete()
    .eq("id", metricId)
    .eq("athlete_id", athlete.profile!.id);

  revalidatePath("/profile/builder");
}

export async function updateAcademicProfile(formData: FormData) {
  const athlete = await requireConsentedAthlete();
  const supabase = await createClient();

  const intendedMajors = String(formData.get("intended_majors") || "")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);

  await supabase.from("academic_profile").upsert(
    {
      athlete_id: athlete.profile!.id,
      gpa_weighted: Number(formData.get("gpa_weighted")) || null,
      gpa_unweighted: Number(formData.get("gpa_unweighted")) || null,
      sat_score: Number(formData.get("sat_score")) || null,
      act_score: Number(formData.get("act_score")) || null,
      intended_majors: intendedMajors,
      counselor_name: String(formData.get("counselor_name") || "") || null,
      counselor_email: String(formData.get("counselor_email") || "") || null,
    },
    { onConflict: "athlete_id" }
  );

  revalidatePath("/profile/builder");
}

export async function toggleChecklistItem(formData: FormData) {
  const athlete = await requireConsentedAthlete();
  const supabase = await createClient();
  const itemId = String(formData.get("item_id"));
  const completed = formData.get("completed") === "true";

  if (completed) {
    await supabase
      .from("athlete_checklist_progress")
      .delete()
      .eq("athlete_id", athlete.profile!.id)
      .eq("item_id", itemId);
  } else {
    await supabase.from("athlete_checklist_progress").insert({
      athlete_id: athlete.profile!.id,
      item_id: itemId,
    });
  }

  revalidatePath("/profile/builder");
}

export async function addCollegeChoice(formData: FormData) {
  const athlete = await requireConsentedAthlete();
  const supabase = await createClient();

  const { count } = await supabase
    .from("college_choices")
    .select("id", { count: "exact", head: true })
    .eq("athlete_id", athlete.profile!.id);

  if ((count ?? 0) >= MAX_COLLEGE_CHOICES) {
    revalidatePath("/profile/builder");
    return;
  }

  await supabase.from("college_choices").insert({
    athlete_id: athlete.profile!.id,
    college_name: String(formData.get("college_name")),
    sport: String(formData.get("sport")) as Sport,
    coach_name: String(formData.get("coach_name") || "") || null,
    coach_email: String(formData.get("coach_email") || "") || null,
    coach_phone: String(formData.get("coach_phone") || "") || null,
    location: String(formData.get("location") || "") || null,
  });

  revalidatePath("/profile/builder");
}

export async function updateCollegeChoiceStatus(formData: FormData) {
  const athlete = await requireConsentedAthlete();
  const supabase = await createClient();
  const choiceId = String(formData.get("choice_id"));

  await supabase
    .from("college_choices")
    .update({ status: String(formData.get("status")) })
    .eq("id", choiceId)
    .eq("athlete_id", athlete.profile!.id);

  revalidatePath("/profile/builder");
}

export async function deleteCollegeChoice(formData: FormData) {
  const athlete = await requireConsentedAthlete();
  const supabase = await createClient();
  const choiceId = String(formData.get("choice_id"));

  await supabase
    .from("college_choices")
    .delete()
    .eq("id", choiceId)
    .eq("athlete_id", athlete.profile!.id);

  revalidatePath("/profile/builder");
}

export async function uploadTranscript(formData: FormData) {
  const athlete = await requireConsentedAthlete();
  const supabase = await createClient();
  const file = formData.get("transcript");

  if (!(file instanceof File) || file.size === 0) {
    revalidatePath("/profile/builder");
    return;
  }

  const ext = file.name.split(".").pop() || "pdf";
  const path = `${athlete.profile!.id}/transcript.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("transcripts")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (!uploadError) {
    await supabase.from("academic_profile").upsert(
      { athlete_id: athlete.profile!.id, transcript_path: path },
      { onConflict: "athlete_id" }
    );
  }

  revalidatePath("/profile/builder");
}

export async function updateMediaAndContacts(formData: FormData) {
  const athlete = await requireConsentedAthlete();
  const supabase = await createClient();

  await supabase.from("media_and_contacts").upsert(
    {
      athlete_id: athlete.profile!.id,
      social_x: String(formData.get("social_x") || "") || null,
      social_instagram: String(formData.get("social_instagram") || "") || null,
      head_coach_name: String(formData.get("head_coach_name") || "") || null,
      head_coach_phone: String(formData.get("head_coach_phone") || "") || null,
      head_coach_email: String(formData.get("head_coach_email") || "") || null,
    },
    { onConflict: "athlete_id" }
  );

  revalidatePath("/profile/builder");
}

export async function addVideoLink(formData: FormData) {
  const athlete = await requireConsentedAthlete();
  const supabase = await createClient();

  await supabase.from("athlete_video_links").insert({
    athlete_id: athlete.profile!.id,
    url: String(formData.get("url")),
    label: String(formData.get("label") || "") || null,
  });

  revalidatePath("/profile/builder");
}

export async function deleteVideoLink(formData: FormData) {
  const athlete = await requireConsentedAthlete();
  const supabase = await createClient();
  const linkId = String(formData.get("link_id"));

  await supabase
    .from("athlete_video_links")
    .delete()
    .eq("id", linkId)
    .eq("athlete_id", athlete.profile!.id);

  revalidatePath("/profile/builder");
}

export async function addInterestLogEntry(formData: FormData) {
  const athlete = await requireConsentedAthlete();
  const supabase = await createClient();

  await supabase.from("recruiting_interest_log").insert({
    athlete_id: athlete.profile!.id,
    college_name: String(formData.get("college_name")),
    contact_type: String(formData.get("contact_type")),
    date: String(formData.get("date")),
    notes: String(formData.get("notes") || "") || null,
  });

  revalidatePath("/profile/builder");
}
