import { ConfirmRulesNote } from "@/components/CourseTag";
import { StageCard, BulletList } from "@/components/course/StageCard";
import { PhotoBanner } from "@/components/PhotoBanner";
import { SelfAssessmentMatrix } from "@/components/SelfAssessmentMatrix";

const TIERS = [
  {
    label: "FBS",
    sub: "Elite metrics only",
    variant: "gold" as const,
    schools: ["South Carolina", "Clemson"],
  },
  {
    label: "FCS",
    sub: "Strong regional fit",
    variant: "green" as const,
    schools: ["The Citadel", "Wofford", "Furman", "South Carolina State", "Coastal Carolina"],
  },
  {
    label: "DII / DIII",
    sub: "Playing time + fit",
    variant: "navy" as const,
    schools: ["Newberry", "Limestone", "Benedict"],
  },
];

const TIER_STYLES = {
  gold: "border-bl-gold-dark/30 bg-bl-gold-50 text-amber-900",
  green: "border-bl-green/25 bg-bl-green-50 text-bl-green-dark",
  navy: "border-bl-navy/20 bg-slate-50 text-bl-navy",
};

export default function Track2Page() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Track 2: SCISA &amp; Regional Reality
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          A realistic list, out of a specific league, in a specific state.
          Here&apos;s what&apos;s actually true for a SCISA athlete.
        </p>
      </div>

      <PhotoBanner
        src="/gallery/soccer-1.jpg"
        alt="Ben Lippen Falcons athletics"
        caption="Know your realistic landing spot before you email a single coach."
      />

      <StageCard variant="navy" badge="!" title="SCISA Compliance Filter">
        <BulletList
          items={[
            "This platform supports outbound college recruiting only.",
            "It has nothing to do with, and does not support, school-to-school transfer recruiting — SCISA's bylaws separately govern and restrict that.",
            "Transfer sit-out periods and immediate-eligibility rules are SCISA's internal framework, not college recruiting.",
          ]}
        />
        <ConfirmRulesNote>
          Transfer sit-out periods and immediate-eligibility constraints
          change and are enforced by SCISA directly. Confirm current rules in
          the SCISA Blue Book (or with your athletic director).
        </ConfirmRulesNote>
      </StageCard>

      <StageCard variant="gold" badge="$" title="NIL — Name, Image, Likeness">
        <BulletList
          items={[
            "NIL rules for SC high schoolers are genuinely unsettled right now.",
            "The right posture: confirm before you act, not “here's the rule.”",
          ]}
        />
        <ConfirmRulesNote>
          Before signing anything NIL-related — an endorsement, a collective
          agreement, a sponsorship — confirm current rules with your
          school&apos;s athletic director. A deal that&apos;s fine one
          semester can jeopardize eligibility the next.
        </ConfirmRulesNote>
      </StageCard>

      <div className="not-prose">
        <h2 className="text-xl font-semibold text-slate-900">
          Regional College Mapping
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          A useful anchor for South Carolina-based recruiting — not
          exhaustive.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.label}
              className={`rounded-xl border p-4 ${TIER_STYLES[tier.variant]}`}
            >
              <p className="text-lg font-bold">{tier.label}</p>
              <p className="text-xs opacity-75">{tier.sub}</p>
              <ul className="mt-3 flex flex-col gap-1 text-sm">
                {tier.schools.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-600">
          The honest version of recruiting advice isn&apos;t &quot;aim for
          the top and see what happens&quot; — it&apos;s knowing which tier
          your actual metrics put you in.
        </p>
      </div>

      <SelfAssessmentMatrix />
    </div>
  );
}
