"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { value: "name", label: "Name (A–Z)" },
  { value: "class", label: "Class year" },
  { value: "completion", label: "Profile completion" },
];

export function RosterFilters({ classYears }: { classYears: number[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mt-6 flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
        Search
        <input
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(e) => update("q", e.target.value)}
          placeholder="Athlete name"
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
        Sport
        <select
          defaultValue={searchParams.get("sport") ?? ""}
          onChange={(e) => update("sport", e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        >
          <option value="">All sports</option>
          <option value="football">Football</option>
          <option value="track">Track</option>
          <option value="basketball">Basketball</option>
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
        Class
        <select
          defaultValue={searchParams.get("class") ?? ""}
          onChange={(e) => update("class", e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        >
          <option value="">All classes</option>
          {classYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
        Consent
        <select
          defaultValue={searchParams.get("consent") ?? ""}
          onChange={(e) => update("consent", e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        >
          <option value="">All</option>
          <option value="on_file">On file</option>
          <option value="missing">Missing</option>
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
        Sort by
        <select
          defaultValue={searchParams.get("sort") ?? "name"}
          onChange={(e) => update("sort", e.target.value)}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
