import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { fetchRosterRows, filterAndSortRows, formatSports } from "@/lib/roster";
import { BrandHeader } from "@/components/BrandHeader";
import { RosterFilters } from "@/components/admin/RosterFilters";
import { SignOutButton } from "@/components/SignOutButton";
import { DeleteAthleteButton } from "@/components/DeleteAthleteButton";

function autoDeleteDate(gradClassYear: number) {
  const graduation = new Date(Date.UTC(gradClassYear, 5, 1)); // June 1
  graduation.setUTCDate(graduation.getUTCDate() + 365);
  return graduation.toISOString().slice(0, 10);
}

export default async function ArchivePage({
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
  const allRows = await fetchRosterRows(supabase, { archived: true });
  const rows = filterAndSortRows(allRows, params);

  const classYears = [...new Set(allRows.map((r) => r.athlete.grad_class_year))].sort(
    (a, b) => a - b
  );

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center justify-between">
        <BrandHeader />
        <SignOutButton redirectTo="/admin/login" />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Archive</h1>
          <p className="mt-1 text-sm text-slate-600">
            Graduated athletes, auto-archived 90 days after graduation.
            Profiles are permanently deleted 1 year after graduation.
          </p>
        </div>
        <Link
          href="/admin/roster"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
        >
          ← Back to roster
        </Link>
      </div>

      <RosterFilters classYears={classYears} />

      <table className="mt-8 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <th className="py-2 pr-4">Name</th>
            <th className="py-2 pr-4">Sport / Position</th>
            <th className="py-2 pr-4">Class</th>
            <th className="py-2 pr-4">Archived</th>
            <th className="py-2 pr-4">Auto-deletes</th>
            <th className="py-2 pr-4" />
            <th className="py-2 pr-4" />
          </tr>
        </thead>
        <tbody>
          {rows.map(({ athlete, sports }) => (
            <tr key={athlete.id} className="border-b border-slate-100">
              <td className="py-2 pr-4 font-medium text-slate-900">
                {athlete.full_name}
              </td>
              <td className="py-2 pr-4 text-slate-600">{formatSports(sports)}</td>
              <td className="py-2 pr-4 text-slate-600">{athlete.grad_class_year}</td>
              <td className="py-2 pr-4 text-slate-600">
                {athlete.archived_at?.slice(0, 10)}
              </td>
              <td className="py-2 pr-4 text-slate-600">
                {autoDeleteDate(athlete.grad_class_year)}
              </td>
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
                  ? "No archived profiles."
                  : "No archived profiles match these filters."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
