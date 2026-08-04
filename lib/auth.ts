import { createClient } from "@/lib/supabase/server";
import type { AthleteProfile, GuardianConsent } from "@/lib/db/schema";

export async function getCurrentAthlete(): Promise<{
  userId: string;
  profile: AthleteProfile | null;
  consent: GuardianConsent | null;
} | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("athlete_profile")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  let consent: GuardianConsent | null = null;
  if (profile) {
    const { data } = await supabase
      .from("guardian_consent")
      .select("*")
      .eq("athlete_id", profile.id)
      .maybeSingle();
    consent = data;
  }

  return { userId: user.id, profile, consent };
}
