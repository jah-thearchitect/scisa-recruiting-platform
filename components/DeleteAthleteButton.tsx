"use client";

import { deleteAthleteProfile } from "@/app/admin/actions";

export function DeleteAthleteButton({
  athleteId,
  athleteName,
}: {
  athleteId: string;
  athleteName: string;
}) {
  return (
    <form
      action={deleteAthleteProfile}
      onSubmit={(e) => {
        if (
          !confirm(
            `Permanently delete ${athleteName}'s profile? This removes their consent record, metrics, academics, media, and recruiting log. This cannot be undone.`
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="athlete_id" value={athleteId} />
      <button type="submit" className="text-xs text-red-600 hover:underline">
        Delete
      </button>
    </form>
  );
}
