import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { verifyMetric } from "../actions";
import type { AthleteProfile, PerformanceMetric } from "@/lib/db/schema";
import { BrandHeader } from "@/components/BrandHeader";
import { PhotoBanner } from "@/components/PhotoBanner";
import { SignOutButton } from "@/components/SignOutButton";

export default async function VerificationQueuePage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const supabase = await createClient();

  const { data: pending } = await supabase
    .from("performance_metrics")
    .select("*")
    .eq("recorded_method", "self_reported")
    .returns<PerformanceMetric[]>();

  const athleteIds = [...new Set((pending ?? []).map((m) => m.athlete_id))];
  const { data: athletes } = athleteIds.length
    ? await supabase
        .from("athlete_profile")
        .select("*")
        .in("id", athleteIds)
        .returns<AthleteProfile[]>()
    : { data: [] as AthleteProfile[] };

  const athleteById = new Map((athletes ?? []).map((a) => [a.id, a]));

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <BrandHeader />
        <SignOutButton redirectTo="/admin/login" />
      </div>

      <div className="mt-6">
        <PhotoBanner
          src="/gallery/basketball-girls-1.jpg"
          alt="Ben Lippen Falcons athletics"
          height={160}
        />
      </div>

      <h1 className="mt-6 text-2xl font-semibold text-slate-900">
        Verification Queue
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        Self-reported metrics awaiting coach sign-off. Verifying replaces the
        self-reported tag with a coach-verified one on the athlete&apos;s
        public resume.
      </p>

      <ul className="mt-8 flex flex-col gap-3">
        {(pending ?? []).map((m) => {
          const athlete = athleteById.get(m.athlete_id);
          return (
            <li
              key={m.id}
              className="flex items-center justify-between rounded-md border border-slate-200 px-4 py-3"
            >
              <div>
                <p className="font-medium text-slate-900">
                  {athlete?.full_name ?? "Unknown athlete"}
                </p>
                <p className="text-sm text-slate-600">
                  {m.metric_name}: {m.value} {m.unit}
                </p>
              </div>
              <form action={verifyMetric}>
                <input type="hidden" name="metric_id" value={m.id} />
                <button className="rounded-md bg-bl-green px-4 py-2 text-sm font-medium text-white hover:bg-bl-green-dark">
                  Verify
                </button>
              </form>
            </li>
          );
        })}
        {(pending ?? []).length === 0 && (
          <li className="text-sm text-slate-500">Queue is empty.</li>
        )}
      </ul>
    </main>
  );
}
