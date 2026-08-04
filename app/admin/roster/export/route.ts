import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { formatSports } from "@/lib/roster";
import type { AthleteProfile, AthleteSport } from "@/lib/db/schema";

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const { data: athletes } = await supabase
    .from("athlete_profile")
    .select("*")
    .is("archived_at", null)
    .order("full_name")
    .returns<AthleteProfile[]>();

  const [consentRows, sportsRows] = await Promise.all([
    Promise.all(
      (athletes ?? []).map((a) =>
        supabase.from("guardian_consent").select("athlete_id").eq("athlete_id", a.id).maybeSingle()
      )
    ),
    Promise.all(
      (athletes ?? []).map((a) =>
        supabase
          .from("athlete_sports")
          .select("*")
          .eq("athlete_id", a.id)
          .returns<AthleteSport[]>()
      )
    ),
  ]);

  const header = [
    "Full Name",
    "Sports",
    "Grad Class Year",
    "School",
    "Guardian Consent",
  ];

  const lines = [header.join(",")];
  (athletes ?? []).forEach((a, i) => {
    lines.push(
      [
        csvEscape(a.full_name),
        csvEscape(formatSports(sportsRows[i].data ?? [])),
        String(a.grad_class_year),
        csvEscape(a.school_affiliation),
        consentRows[i].data ? "On file" : "Missing",
      ].join(",")
    );
  });

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="roster.csv"`,
    },
  });
}
