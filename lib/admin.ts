import { createClient } from "@/lib/supabase/server";

export interface SchoolAdmin {
  id: string;
  user_id: string;
  full_name: string;
  school_affiliation: string;
}

export async function getCurrentAdmin(): Promise<SchoolAdmin | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("school_admins")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle<SchoolAdmin>();

  return data;
}
