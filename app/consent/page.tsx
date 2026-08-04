import { redirect } from "next/navigation";
import { getCurrentAthlete } from "@/lib/auth";
import { submitConsent } from "./actions";
import { BrandHeader } from "@/components/BrandHeader";
import { AuthBackdrop } from "@/components/AuthBackdrop";

export default async function ConsentPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const athlete = await getCurrentAthlete();

  if (!athlete) {
    redirect("/login");
  }

  if (athlete.consent) {
    redirect("/profile/builder");
  }

  return (
    <AuthBackdrop image="/gallery/tennis-2.jpg" maxWidth="max-w-2xl">
      <BrandHeader />
      <h1 className="mt-8 text-2xl font-semibold text-slate-900">
        Guardian Consent
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        This platform collects data on minors. No athlete data — profile,
        performance metrics, academics, or contact info — is stored until a
        parent or guardian confirms consent below. If the athlete turns 18
        mid-cycle, re-consent will be required.
      </p>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <form action={submitConsent} className="mt-8 flex flex-col gap-6">
        <fieldset className="flex flex-col gap-4">
          <legend className="text-sm font-semibold text-slate-900">
            Athlete
          </legend>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Full name
            <input
              name="full_name"
              required
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Date of birth
              <input
                name="date_of_birth"
                type="date"
                required
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Graduation class year
              <input
                name="grad_class_year"
                type="number"
                min={2026}
                max={2032}
                required
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            School (SCISA member school)
            <input
              name="school_affiliation"
              required
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <p className="text-xs text-slate-500">
            Sports and positions are added next, in the profile builder — an
            athlete can play up to 3.
          </p>
        </fieldset>

        <fieldset className="flex flex-col gap-4 border-t border-slate-200 pt-6">
          <legend className="text-sm font-semibold text-slate-900">
            Parent / Guardian Consent
          </legend>
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Guardian full name
            <input
              name="guardian_name"
              required
              className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Guardian email
              <input
                name="guardian_email"
                type="email"
                required
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Guardian phone
              <input
                name="guardian_phone"
                type="tel"
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
          </div>

          <label className="flex items-start gap-2 text-sm text-slate-700">
            <input type="checkbox" name="athlete_is_minor" defaultChecked className="mt-1" />
            <span>
              The athlete is under 18. I am their parent/legal guardian and I
              consent to this profile being created and shared with college
              coaches.
            </span>
          </label>

          <label className="flex items-start gap-2 text-sm text-slate-700">
            <input type="checkbox" name="self_consent_confirm" className="mt-1" />
            <span>
              The athlete is 18 or older and is consenting on their own
              behalf. (Uncheck &quot;under 18&quot; above if selecting this.)
            </span>
          </label>
        </fieldset>

        <button
          type="submit"
          className="rounded-md bg-bl-green px-4 py-2 text-sm font-medium text-white hover:bg-bl-green-dark"
        >
          Grant consent and continue
        </button>
      </form>
    </AuthBackdrop>
  );
}
