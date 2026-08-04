"use client";

import { useState } from "react";
import Image from "next/image";
import {
  POSITIONS_BY_SPORT,
  METRICS_BY_SPORT,
  ALL_SPORTS,
  MAX_SPORTS_PER_ATHLETE,
  MAX_COLLEGE_CHOICES,
  CHECKLIST_STAGE_LABELS,
  currentChecklistStage,
} from "@/lib/db/schema";
import type {
  AthleteProfile,
  AthleteSport,
  PerformanceMetric,
  AcademicProfile,
  MediaAndContacts,
  AthleteVideoLink,
  RecruitingInterestLogEntry,
  ChecklistItem,
  ChecklistStage,
  CollegeChoice,
  Sport,
} from "@/lib/db/schema";
import {
  updateBasicInfo,
  uploadHeadshot,
  addAthleteSport,
  deleteAthleteSport,
  updatePhysicalMetrics,
  addPerformanceMetric,
  deletePerformanceMetric,
  updateAcademicProfile,
  uploadTranscript,
  toggleChecklistItem,
  addCollegeChoice,
  updateCollegeChoiceStatus,
  deleteCollegeChoice,
  updateMediaAndContacts,
  addVideoLink,
  deleteVideoLink,
  addInterestLogEntry,
} from "@/app/profile/builder/actions";

const STEPS = [
  "Basic Info",
  "Sports",
  "Physical",
  "Performance Metrics",
  "Academics",
  "Recruiting Checklist",
  "College Choices",
  "Media & Video",
  "Recruiting Log",
] as const;

const STAGE_ORDER: ChecklistStage[] = ["freshman_sophomore", "junior", "senior"];

const STATUS_OPTIONS = [
  { value: "outreach_sent", label: "Outreach sent" },
  { value: "response_received", label: "Response received" },
  { value: "unofficial_visit", label: "Unofficial visit" },
  { value: "official_visit", label: "Official visit" },
  { value: "offer", label: "Offer" },
];

export function ProfileBuilderWizard({
  profile,
  sports,
  metrics,
  academic,
  transcriptUrl,
  checklistItems,
  completedItemIds,
  collegeChoices,
  media,
  videoLinks,
  interestLog,
}: {
  profile: AthleteProfile;
  sports: AthleteSport[];
  metrics: PerformanceMetric[];
  academic: AcademicProfile | null;
  transcriptUrl: string | null;
  checklistItems: ChecklistItem[];
  completedItemIds: string[];
  collegeChoices: CollegeChoice[];
  media: MediaAndContacts | null;
  videoLinks: AthleteVideoLink[];
  interestLog: RecruitingInterestLogEntry[];
}) {
  const [step, setStep] = useState(0);
  const playsFootball = sports.some((s) => s.sport === "football");
  const athleteSportsList = sports.map((s) => s.sport);
  const completedSet = new Set(completedItemIds);
  const currentStage = currentChecklistStage(profile.grad_class_year);

  return (
    <div>
      <ol className="mb-8 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
        {STEPS.map((label, i) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => setStep(i)}
              className={`rounded-full px-3 py-1 ${
                i === step
                  ? "bg-bl-green text-white"
                  : "bg-slate-100 hover:bg-slate-200"
              }`}
            >
              {i + 1}. {label}
            </button>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            {profile.headshot_url ? (
              <Image
                src={profile.headshot_url}
                alt={profile.full_name}
                width={80}
                height={80}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-400">
                No photo
              </div>
            )}
            <form action={uploadHeadshot} className="flex flex-col gap-2">
              <input
                type="file"
                name="headshot"
                accept="image/*"
                required
                className="text-sm"
              />
              <button className="self-start rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-900 hover:bg-slate-50">
                Upload headshot
              </button>
            </form>
          </div>

          <form
            action={async (fd) => {
              await updateBasicInfo(fd);
              setStep(1);
            }}
            className="flex flex-col gap-4"
          >
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Date of birth
              <input
                name="date_of_birth"
                type="date"
                defaultValue={profile.date_of_birth ?? ""}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                Athlete phone
                <input
                  name="athlete_phone"
                  type="tel"
                  defaultValue={profile.athlete_phone ?? ""}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                Athlete contact email
                <input
                  name="athlete_contact_email"
                  type="email"
                  defaultValue={profile.athlete_contact_email ?? ""}
                  placeholder="if different from login email"
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <StepButtons step={step} setStep={setStep} totalSteps={STEPS.length} />
          </form>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-6">
          <ul className="flex flex-col gap-2">
            {sports.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm"
              >
                <span className="capitalize">
                  {s.sport} — {s.position_primary}
                  {s.position_secondary ? ` / ${s.position_secondary}` : ""}
                </span>
                <form action={deleteAthleteSport}>
                  <input type="hidden" name="sport_id" value={s.id} />
                  <button className="text-xs text-red-600 hover:underline">
                    Remove
                  </button>
                </form>
              </li>
            ))}
            {sports.length === 0 && (
              <li className="text-sm text-slate-500">No sports added yet.</li>
            )}
          </ul>

          {sports.length < MAX_SPORTS_PER_ATHLETE ? (
            <AddSportForm alreadySelected={athleteSportsList} />
          ) : (
            <p className="text-xs text-slate-500">
              Maximum of {MAX_SPORTS_PER_ATHLETE} sports reached. Remove one to add another.
            </p>
          )}

          <NavButtons step={step} setStep={setStep} totalSteps={STEPS.length} />
        </div>
      )}

      {step === 2 && (
        <form
          action={async (fd) => {
            await updatePhysicalMetrics(fd);
            setStep(3);
          }}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Height (inches)
              <input
                name="height_inches"
                type="number"
                step="0.1"
                defaultValue={profile.height_inches ?? ""}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Weight (lbs)
              <input
                name="weight_lbs"
                type="number"
                step="0.1"
                defaultValue={profile.weight_lbs ?? ""}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
          </div>
          {playsFootball && (
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                Hand size (in)
                <input
                  name="hand_size_in"
                  type="number"
                  step="0.1"
                  defaultValue={profile.hand_size_in ?? ""}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                Arm length (in)
                <input
                  name="arm_length_in"
                  type="number"
                  step="0.1"
                  defaultValue={profile.arm_length_in ?? ""}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
            </div>
          )}
          <StepButtons step={step} setStep={setStep} totalSteps={STEPS.length} />
        </form>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-6">
          <ul className="flex flex-col gap-2">
            {metrics.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm"
              >
                <span>
                  <span className="mr-1 text-xs capitalize text-slate-400">
                    {m.sport}
                  </span>
                  {m.metric_name}: <strong>{m.value}</strong> {m.unit}{" "}
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                      m.recorded_method === "self_reported"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {m.recorded_method.replace("_", " ")}
                  </span>
                </span>
                <form action={deletePerformanceMetric}>
                  <input type="hidden" name="metric_id" value={m.id} />
                  <button className="text-xs text-red-600 hover:underline">
                    Remove
                  </button>
                </form>
              </li>
            ))}
            {metrics.length === 0 && (
              <li className="text-sm text-slate-500">No metrics logged yet.</li>
            )}
          </ul>

          {sports.length === 0 ? (
            <p className="text-sm text-slate-500">
              Add a sport in the previous step before logging metrics.
            </p>
          ) : (
            <AddMetricForm sports={athleteSportsList} />
          )}

          <p className="text-xs text-slate-500">
            New entries are logged as self-reported. A coach must verify them
            before they appear on your public Coach View as verified.
          </p>

          <NavButtons step={step} setStep={setStep} totalSteps={STEPS.length} />
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-8">
          <form
            action={async (fd) => {
              await updateAcademicProfile(fd);
              setStep(5);
            }}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                GPA (weighted)
                <input
                  name="gpa_weighted"
                  type="number"
                  step="0.01"
                  defaultValue={academic?.gpa_weighted ?? ""}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                GPA (unweighted)
                <input
                  name="gpa_unweighted"
                  type="number"
                  step="0.01"
                  defaultValue={academic?.gpa_unweighted ?? ""}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                SAT score
                <input
                  name="sat_score"
                  type="number"
                  defaultValue={academic?.sat_score ?? ""}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                ACT score
                <input
                  name="act_score"
                  type="number"
                  defaultValue={academic?.act_score ?? ""}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Intended majors (comma-separated)
              <input
                name="intended_majors"
                defaultValue={academic?.intended_majors?.join(", ") ?? ""}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                School counselor name
                <input
                  name="counselor_name"
                  defaultValue={academic?.counselor_name ?? ""}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                School counselor email
                <input
                  name="counselor_email"
                  type="email"
                  defaultValue={academic?.counselor_email ?? ""}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <p className="text-xs text-slate-500">
              Coordinate with your actual school guidance counselor for
              official transcripts and test scores — this field is for
              recruiting outreach only.
            </p>
            <StepButtons step={step} setStep={setStep} totalSteps={STEPS.length} />
          </form>

          <div className="border-t border-slate-200 pt-6">
            <p className="text-sm font-semibold text-slate-900">Transcript</p>
            {transcriptUrl ? (
              <a
                href={transcriptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-sm text-slate-900 underline"
              >
                View current transcript →
              </a>
            ) : (
              <p className="mt-1 text-sm text-slate-500">
                No transcript uploaded yet.
              </p>
            )}
            <form action={uploadTranscript} className="mt-3 flex items-end gap-3">
              <input
                type="file"
                name="transcript"
                accept="application/pdf,image/*"
                required
                className="text-sm"
              />
              <button className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-900 hover:bg-slate-50">
                {transcriptUrl ? "Replace transcript" : "Upload transcript"}
              </button>
            </form>
            <p className="mt-2 text-xs text-slate-500">
              Private — visible only to you and school admins, never on your
              public Coach View.
            </p>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="flex flex-col gap-6">
          <p className="text-sm text-slate-600">
            {completedItemIds.length} of {checklistItems.length} completed.
          </p>
          {STAGE_ORDER.map((stage) => {
            const items = checklistItems
              .filter((i) => i.stage === stage)
              .sort((a, b) => a.sort_order - b.sort_order);
            if (items.length === 0) return null;
            const isCurrent = stage === currentStage;
            return (
              <div
                key={stage}
                className={`rounded-xl border p-4 ${
                  isCurrent ? "border-bl-green bg-bl-green-50" : "border-slate-200"
                }`}
              >
                <p
                  className={`text-sm font-semibold ${
                    isCurrent ? "text-bl-green-dark" : "text-slate-900"
                  }`}
                >
                  {CHECKLIST_STAGE_LABELS[stage]}
                  {isCurrent && (
                    <span className="ml-2 rounded-full bg-bl-green px-2 py-0.5 text-xs font-medium text-white">
                      You are here
                    </span>
                  )}
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {items.map((item) => {
                    const isCompleted = completedSet.has(item.id);
                    return (
                      <li key={item.id}>
                        <form action={toggleChecklistItem}>
                          <input type="hidden" name="item_id" value={item.id} />
                          <input
                            type="hidden"
                            name="completed"
                            value={String(isCompleted)}
                          />
                          <label className="flex items-start gap-2 text-sm text-slate-700">
                            <input
                              type="checkbox"
                              defaultChecked={isCompleted}
                              onChange={(e) => e.currentTarget.form?.requestSubmit()}
                              className="mt-0.5"
                            />
                            <span className={isCompleted ? "text-slate-400 line-through" : ""}>
                              {item.item_text}
                            </span>
                          </label>
                        </form>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
          <NavButtons step={step} setStep={setStep} totalSteps={STEPS.length} />
        </div>
      )}

      {step === 6 && (
        <div className="flex flex-col gap-6">
          <ul className="flex flex-col gap-2">
            {collegeChoices.map((c) => (
              <li
                key={c.id}
                className="rounded-md border border-slate-200 px-3 py-2 text-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">
                      {c.college_name}{" "}
                      <span className="text-xs capitalize text-slate-500">
                        ({c.sport})
                      </span>
                    </p>
                    {c.location && (
                      <p className="text-xs text-slate-500">{c.location}</p>
                    )}
                    {(c.coach_name || c.coach_email || c.coach_phone) && (
                      <p className="mt-1 text-xs text-slate-600">
                        {c.coach_name}
                        {c.coach_email && ` · ${c.coach_email}`}
                        {c.coach_phone && ` · ${c.coach_phone}`}
                      </p>
                    )}
                  </div>
                  <form action={deleteCollegeChoice}>
                    <input type="hidden" name="choice_id" value={c.id} />
                    <button className="shrink-0 text-xs text-red-600 hover:underline">
                      Remove
                    </button>
                  </form>
                </div>
                <form action={updateCollegeChoiceStatus} className="mt-2">
                  <input type="hidden" name="choice_id" value={c.id} />
                  <select
                    name="status"
                    defaultValue={c.status}
                    onChange={(e) => e.currentTarget.form?.requestSubmit()}
                    className="rounded-md border border-slate-300 px-2 py-1 text-xs"
                  >
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </form>
              </li>
            ))}
            {collegeChoices.length === 0 && (
              <li className="text-sm text-slate-500">
                No college choices added yet.
              </li>
            )}
          </ul>

          {collegeChoices.length < MAX_COLLEGE_CHOICES ? (
            <AddCollegeChoiceForm />
          ) : (
            <p className="text-xs text-slate-500">
              Maximum of {MAX_COLLEGE_CHOICES} college choices reached. Remove
              one to add another.
            </p>
          )}

          <NavButtons step={step} setStep={setStep} totalSteps={STEPS.length} />
        </div>
      )}

      {step === 7 && (
        <div className="flex flex-col gap-8">
          <form
            action={async (fd) => {
              await updateMediaAndContacts(fd);
            }}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                X (Twitter) handle
                <input
                  name="social_x"
                  defaultValue={media?.social_x ?? ""}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                Instagram handle
                <input
                  name="social_instagram"
                  defaultValue={media?.social_instagram ?? ""}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                Head coach name
                <input
                  name="head_coach_name"
                  defaultValue={media?.head_coach_name ?? ""}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                Head coach phone
                <input
                  name="head_coach_phone"
                  defaultValue={media?.head_coach_phone ?? ""}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                Head coach email
                <input
                  name="head_coach_email"
                  type="email"
                  defaultValue={media?.head_coach_email ?? ""}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <button className="self-start rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50">
              Save contacts
            </button>
          </form>

          <div className="border-t border-slate-200 pt-6">
            <p className="text-sm font-semibold text-slate-900">Video links</p>
            <ul className="mt-3 flex flex-col gap-2">
              {videoLinks.map((v) => (
                <li
                  key={v.id}
                  className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm"
                >
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate text-slate-900 underline"
                  >
                    {v.label || v.url}
                  </a>
                  <form action={deleteVideoLink}>
                    <input type="hidden" name="link_id" value={v.id} />
                    <button className="ml-3 shrink-0 text-xs text-red-600 hover:underline">
                      Remove
                    </button>
                  </form>
                </li>
              ))}
              {videoLinks.length === 0 && (
                <li className="text-sm text-slate-500">No video links yet.</li>
              )}
            </ul>

            <form action={addVideoLink} className="mt-3 flex items-end gap-3">
              <label className="flex flex-1 flex-col gap-1 text-sm font-medium text-slate-700">
                URL
                <input
                  name="url"
                  type="url"
                  required
                  placeholder="https://hudl.com/..."
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                Label
                <input
                  name="label"
                  placeholder="Junior highlight film"
                  className="w-48 rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <button className="rounded-md bg-bl-green px-4 py-2 text-sm font-medium text-white hover:bg-bl-green-dark">
                Add
              </button>
            </form>
          </div>

          <NavButtons step={step} setStep={setStep} totalSteps={STEPS.length} />
        </div>
      )}

      {step === 8 && (
        <div className="flex flex-col gap-6">
          <ul className="flex flex-col gap-2">
            {interestLog.map((entry) => (
              <li
                key={entry.id}
                className="rounded-md border border-slate-200 px-3 py-2 text-sm"
              >
                <strong>{entry.college_name}</strong> —{" "}
                {entry.contact_type.replace("_", " ")} on {entry.date}
                {entry.notes && (
                  <p className="mt-1 text-xs text-slate-500">{entry.notes}</p>
                )}
              </li>
            ))}
            {interestLog.length === 0 && (
              <li className="text-sm text-slate-500">
                No recruiting contact logged yet.
              </li>
            )}
          </ul>

          <form action={addInterestLogEntry} className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-3">
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                College
                <input
                  name="college_name"
                  required
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                Contact type
                <select
                  name="contact_type"
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="outreach_sent">Outreach sent</option>
                  <option value="response_received">Response received</option>
                  <option value="unofficial_visit">Unofficial visit</option>
                  <option value="official_visit">Official visit</option>
                  <option value="offer">Offer</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
                Date
                <input
                  name="date"
                  type="date"
                  required
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
            </div>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Notes
              <textarea
                name="notes"
                rows={2}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <button className="self-start rounded-md bg-bl-green px-4 py-2 text-sm font-medium text-white hover:bg-bl-green-dark">
              Log entry
            </button>
          </form>

          <a
            href={`/profile/${profile.id}`}
            className="self-start rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
          >
            View public Coach View page →
          </a>
        </div>
      )}
    </div>
  );
}

function AddSportForm({ alreadySelected }: { alreadySelected: Sport[] }) {
  const [sport, setSport] = useState<Sport>(
    ALL_SPORTS.find((s) => !alreadySelected.includes(s)) ?? ALL_SPORTS[0]
  );
  const positions = POSITIONS_BY_SPORT[sport];
  const available = ALL_SPORTS.filter((s) => !alreadySelected.includes(s));

  return (
    <form action={addAthleteSport} className="flex items-end gap-3">
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Sport
        <select
          name="sport"
          value={sport}
          onChange={(e) => setSport(e.target.value as Sport)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          {available.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Primary position
        <select
          name="position_primary"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          {positions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Secondary (optional)
        <select
          name="position_secondary"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="">None</option>
          {positions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>
      <button className="rounded-md bg-bl-green px-4 py-2 text-sm font-medium text-white hover:bg-bl-green-dark">
        Add sport
      </button>
    </form>
  );
}

function AddMetricForm({ sports }: { sports: Sport[] }) {
  const [sport, setSport] = useState<Sport>(sports[0]);
  const metricNames = METRICS_BY_SPORT[sport];

  return (
    <form action={addPerformanceMetric} className="flex items-end gap-3">
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Sport
        <select
          name="sport"
          value={sport}
          onChange={(e) => setSport(e.target.value as Sport)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          {sports.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Metric
        <select
          name="metric_name"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          {metricNames.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Value
        <input
          name="value"
          type="number"
          step="0.01"
          required
          className="w-28 rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Unit
        <input
          name="unit"
          placeholder="sec, in, lbs"
          required
          className="w-28 rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>
      <button className="rounded-md bg-bl-green px-4 py-2 text-sm font-medium text-white hover:bg-bl-green-dark">
        Add
      </button>
    </form>
  );
}

function AddCollegeChoiceForm() {
  const [sport, setSport] = useState<Sport>(ALL_SPORTS[0]);

  return (
    <form action={addCollegeChoice} className="flex flex-col gap-3 rounded-md border border-slate-200 p-3">
      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          College name
          <input
            name="college_name"
            required
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Sport
          <select
            name="sport"
            value={sport}
            onChange={(e) => setSport(e.target.value as Sport)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {ALL_SPORTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
        Location
        <input
          name="location"
          placeholder="City, State"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </label>
      <div className="grid grid-cols-3 gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Coach name
          <input
            name="coach_name"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Coach email
          <input
            name="coach_email"
            type="email"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Coach phone
          <input
            name="coach_phone"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </div>
      <button className="self-start rounded-md bg-bl-green px-4 py-2 text-sm font-medium text-white hover:bg-bl-green-dark">
        Add college
      </button>
    </form>
  );
}

function StepButtons({
  step,
  setStep,
  totalSteps,
}: {
  step: number;
  setStep: (n: number) => void;
  totalSteps: number;
}) {
  return (
    <div className="mt-2 flex gap-3">
      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
        >
          Back
        </button>
      )}
      <button
        type="submit"
        className="rounded-md bg-bl-green px-4 py-2 text-sm font-medium text-white hover:bg-bl-green-dark"
      >
        {step < totalSteps - 1 ? "Save & continue" : "Save"}
      </button>
      {step < totalSteps - 1 && (
        <button
          type="button"
          onClick={() => setStep(step + 1)}
          className="text-sm text-slate-500 hover:underline"
        >
          Skip for now
        </button>
      )}
    </div>
  );
}

// For steps where every field already saves itself via its own inline
// form (Sports, Metrics, Checklist, College Choices, Media & Video) —
// these buttons only navigate, there's nothing left to submit.
function NavButtons({
  step,
  setStep,
  totalSteps,
}: {
  step: number;
  setStep: (n: number) => void;
  totalSteps: number;
}) {
  return (
    <div className="mt-2 flex gap-3">
      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
        >
          Back
        </button>
      )}
      {step < totalSteps - 1 && (
        <button
          type="button"
          onClick={() => setStep(step + 1)}
          className="rounded-md bg-bl-green px-4 py-2 text-sm font-medium text-white hover:bg-bl-green-dark"
        >
          Continue
        </button>
      )}
    </div>
  );
}
