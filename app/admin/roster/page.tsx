import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { fetchRosterRows, filterAndSortRows, formatSports } from "@/lib/roster";
import { BrandHeader } from "@/components/BrandHeader";
import { PhotoBanner } from "@/components/PhotoBanner";
import { RosterFilters } from "@/components/admin/RosterFilters";
import { DeleteAthleteButton } from "@/components/DeleteAthleteButton";

export default async function RosterPage({
  searchParams,
}: {
  searchParams: Promise<{
    sport?: string;
    class?: string;
    consent?: string;
    q?: string;
    sort?: string;
  }>;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const params = await searchParams;
  const supabase = await createClient();
  const allRows = await fetchRosterRows(supabase, { archived: false });
  const rows = filterAndSortRows(allRows, params);

  const classYears = [...new Set(allRows.map((r) => r.athlete.grad_class_year))].sort(
    (a, b) => a - b
  );

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <BrandHeader />

      <div className="mt-6">
        <PhotoBanner
          src="/gallery/track-2.jpg"
          alt="Ben Lippen Falcons athletics"
          height={160}
        />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Roster</h1>
          <p className="mt-1 text-sm text-slate-600">
            {admin.school_affiliation} · {rows.length} of {allRows.length} athlete
            {allRows.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/archive"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
          >
            Archive
          </Link>
          <Link
            href="/admin/verification-queue"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
          >
            Verification queue
          </Link>
          <a
            href="/admin/roster/export"
            className="rounded-md bg-bl-green px-4 py-2 text-sm font-medium text-white hover:bg-bl-green-dark"
          >
            Export CSV
          </a>
        </div>
      </div>

      <RosterFilters classYears={classYears} />

      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <th className="py-2 pr-4">Name</th>
            <th className="py-2 pr-4">Sport / Position</th>
            <th className="py-2 pr-4">Class</th>
            <th className="py-2 pr-4">Consent</th>
            <th className="py-2 pr-4">Profile complete</th>
            <th className="py-2 pr-4" />
            <th className="py-2 pr-4" />
          </tr>
        </thead>
        <tbody>
          {rows.map(({ athlete, sports, consentGiven, pct }) => (
            <tr key={athlete.id} className="border-b border-slate-100">
              <td className="py-2 pr-4 font-medium text-slate-900">
                {athlete.full_name}
              </td>
              <td className="py-2 pr-4 text-slate-600">{formatSports(sports)}</td>
              <td className="py-2 pr-4 text-slate-600">{athlete.grad_class_year}</td>
              <td className="py-2 pr-4">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    consentGiven
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {consentGiven ? "On file" : "Missing"}
                </span>
              </td>
              <td className="py-2 pr-4 text-slate-600">{pct}%</td>
              <td className="py-2 pr-4">
                <Link
                  href={`/profile/${athlete.id}`}
                  className="text-slate-900 underline"
                >
                  View resume
                </Link>
              </td>
              <td className="py-2 pr-4">
                <DeleteAthleteButton athleteId={athlete.id} athleteName={athlete.full_name} />
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="py-6 text-center text-slate-500">
                {allRows.length === 0
                  ? "No athletes registered yet."
                  : "No athletes match these filters."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
