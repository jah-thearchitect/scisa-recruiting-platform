import { CourseTag, ConfirmRulesNote } from "@/components/CourseTag";
import { StageCard, BulletList } from "@/components/course/StageCard";
import { PhotoBanner } from "@/components/PhotoBanner";

export default function Track1Page() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Track 1: Core Recruiting Timeline
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Recruiting isn&apos;t one event senior fall — it&apos;s a four-year
          buildup. Here&apos;s the timeline, stage by stage.
        </p>
      </div>

      <PhotoBanner
        src="/gallery/track-3.jpg"
        alt="Ben Lippen track & field athlete"
        caption="Recruiting is a four-year build — start early."
      />

      <StageCard
        variant="green"
        badge="9–10"
        title="Freshman & Sophomore Year"
        subtitle="The Foundation"
      >
        <div className="flex flex-col gap-5">
          <div>
            <p className="font-semibold text-slate-900">Academic benchmarking</p>
            <BulletList
              items={[
                "Track your core courses now — English, math, science, social studies, foreign language — these are what eligibility centers actually count.",
                "NCAA Eligibility Center (D-I/D-II) certifies core-course GPA on a sliding scale and reviews amateurism status.",
                "NAIA Eligibility Center is separate — its own core-course and test-score standards, generally more flexible.",
              ]}
            />
            <ConfirmRulesNote>
              Core-course lists and GPA cutoffs change periodically — confirm
              current standards at eligibilitycenter.org (NCAA) or the NAIA
              Eligibility Center.
            </ConfirmRulesNote>
          </div>

          <div>
            <CourseTag type="athlete" />
            <p className="text-sm text-slate-700">
              Register with the <strong>NCAA Eligibility Center at the start
              of junior year.</strong> The single most commonly missed step —
              athletes who wait until senior year and discover a core-course
              gap lose a whole semester of momentum.
            </p>
          </div>

          <div>
            <p className="font-semibold text-slate-900">Initial highlight film</p>
            <BulletList
              items={[
                "4–5 minutes. Raw traits, not a career reel.",
                "Varsity snaps if you have them; elite, clearly-dominant JV snaps if you don't.",
                "Don't pad it with mediocre plays — a college coach stops watching after two bad reps.",
              ]}
            />
          </div>

          <div>
            <p className="font-semibold text-slate-900">Social architecture</p>
            <BulletList
              items={[
                "Clean, professional headshot.",
                "Bio states school, grad year, position, height/weight up front.",
              ]}
            />
            <div className="mt-2">
              <CourseTag type="parent" />
              <p className="text-sm text-slate-700">
                Have the conversation about what gets posted publicly.
                Recruiters look at social media as part of evaluation — not
                just film.
              </p>
            </div>
          </div>
        </div>
      </StageCard>

      <StageCard
        variant="gold"
        badge="11"
        title="Junior Year"
        subtitle="Critical Acceleration"
      >
        <div className="flex flex-col gap-5">
          <div>
            <p className="font-semibold text-slate-900">Varsity tape, updated weekly</p>
            <BulletList
              items={[
                "Film needs to be current — no August highlights in October.",
                "Best five plays land in the first 45 seconds.",
              ]}
            />
          </div>

          <div>
            <p className="font-semibold text-slate-900">Direct outreach — target the right person</p>
            <BulletList
              items={[
                "Position Coaches and Directors of Player Personnel — not head coaches.",
                "They're building the recruiting board at your position and are far more responsive.",
              ]}
            />
            <div className="mt-2">
              <CourseTag type="athlete" />
              <p className="text-sm text-slate-700">
                Send your own emails — film link, key stats, academic info,
                and why you&apos;re interested in their program. Reads better
                from you than from a parent.
              </p>
            </div>
          </div>

          <div>
            <p className="font-semibold text-slate-900">Unofficial visits</p>
            <BulletList
              items={[
                "Self-funded and unlimited — take as many as you want.",
                "Regional schools, game days, and spring practice are the highest-value windows.",
              ]}
            />
          </div>

          <div>
            <p className="font-semibold text-slate-900">Recruiting calendar awareness</p>
            <BulletList
              items={[
                "Contact periods vary by division and change year to year.",
                "Know when coaches can call, text, or evaluate you in person before assuming.",
              ]}
            />
            <ConfirmRulesNote>
              Recruiting calendars are published annually by division and
              shift year to year — confirm current dead/quiet/contact periods
              rather than a prior year&apos;s dates.
            </ConfirmRulesNote>
          </div>
        </div>
      </StageCard>

      <StageCard variant="navy" badge="12" title="Senior Year" subtitle="Closing">
        <div className="flex flex-col gap-5">
          <div>
            <p className="font-semibold text-slate-900">Official visits</p>
            <BulletList
              items={[
                "NCAA-allotted and college-paid — travel, lodging, meals covered.",
                "There's a limit on how many you can take; typically come after real program interest.",
              ]}
            />
          </div>

          <div>
            <p className="font-semibold text-slate-900">Application sync</p>
            <BulletList
              items={[
                "Coordinate with your actual school guidance counselor for transcripts and test scores.",
                "This platform tracks your recruiting profile — it does not submit transcripts.",
              ]}
            />
          </div>

          <div>
            <p className="font-semibold text-slate-900">Commitment logistics</p>
            <BulletList
              items={[
                "National Letter of Intent (NLI) — a binding agreement committing you athletically.",
                "Financial aid agreement — a separate document covering the scholarship itself.",
                "Some programs use one, the other, or both, depending on division.",
              ]}
            />
            <div className="mt-2">
              <CourseTag type="parent" />
              <p className="text-sm text-slate-700">
                Read whatever you&apos;re signing carefully. If anything is
                unclear, ask the program&apos;s compliance office before
                signing — not after.
              </p>
            </div>
          </div>
        </div>
      </StageCard>
    </div>
  );
}
