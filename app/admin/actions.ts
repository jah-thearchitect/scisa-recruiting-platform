"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/admin";

export async function verifyMetric(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const metricId = String(formData.get("metric_id"));
  const supabase = await createClient();

  await supabase
    .from("performance_metrics")
    .update({
      recorded_method: "coach_verified",
      verified_by: admin.full_name,
      verified_date: new Date().toISOString().slice(0, 10),
    })
    .eq("id", metricId);

  revalidatePath("/admin/verification-queue");
  revalidatePath("/admin/roster");
}

export async function deleteAthleteProfile(formData: FormData) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const athleteId = String(formData.get("athlete_id"));
  const supabase = await createClient();

  // Cascades to guardian_consent, performance_metrics, academic_profile,
  // media_and_contacts, and recruiting_interest_log via FK "on delete cascade".
  await supabase.from("athlete_profile").delete().eq("id", athleteId);

  revalidatePath("/admin/roster");
  revalidatePath("/admin/archive");
}
