"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function submitConsent(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const fullName = String(formData.get("full_name"));
  const dateOfBirth = String(formData.get("date_of_birth"));
  const gradClassYear = Number(formData.get("grad_class_year"));
  const schoolAffiliation = String(formData.get("school_affiliation"));

  const guardianName = String(formData.get("guardian_name"));
  const guardianEmail = String(formData.get("guardian_email"));
  const guardianPhone = String(formData.get("guardian_phone") || "") || null;
  const athleteIsMinor = formData.get("athlete_is_minor") === "on";

  if (!athleteIsMinor && !formData.get("self_consent_confirm")) {
    redirect(
      "/consent?error=" +
        encodeURIComponent(
          "If the athlete is 18+, check the self-consent confirmation box instead of leaving both unchecked."
        )
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from("athlete_profile")
    .upsert(
      {
        user_id: user.id,
        full_name: fullName,
        date_of_birth: dateOfBirth,
        grad_class_year: gradClassYear,
        school_affiliation: schoolAffiliation,
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (profileError || !profile) {
    redirect(`/consent?error=${encodeURIComponent(profileError?.message ?? "Could not save profile")}`);
  }

  const { error: consentError } = await supabase.from("guardian_consent").upsert(
    {
      athlete_id: profile.id,
      guardian_name: guardianName,
      guardian_email: guardianEmail,
      guardian_phone: guardianPhone,
      athlete_is_minor: athleteIsMinor,
    },
    { onConflict: "athlete_id" }
  );

  if (consentError) {
    redirect(`/consent?error=${encodeURIComponent(consentError.message)}`);
  }

  redirect("/profile/builder");
}
