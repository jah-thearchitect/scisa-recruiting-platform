import { CourseTag, ConfirmRulesNote } from "@/components/CourseTag";
import { StageCard, BulletList } from "@/components/course/StageCard";
import { PhotoBanner } from "@/components/PhotoBanner";

export default function Track3Page() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Track 3: Parent Toolbox
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Recruiting is often talked about as the athlete&apos;s process, but
          the financial and logistical load falls heavily on parents. This
          track is written for you.
        </p>
      </div>

      <PhotoBanner
        src="/gallery/basketball-girls-2.jpg"
        alt="Ben Lippen Falcons athletics"
        caption="The behind-the-scenes work parents do makes the difference."
      />

      <StageCard variant="green" badge="$" title="Financial Literacy">
        <p className="mb-3 text-sm font-medium text-slate-700">
          Headcount vs. equivalency scholarships
        </p>
        <BulletList
          items={[
            <span key="1">
              <strong>Headcount sports</strong> (FBS football is one) award a
              fixed number of full scholarships — no splitting between two
              athletes.
            </span>,
            <span key="2">
              <strong>Equivalency sports</strong> divide a scholarship budget
              across a roster however a coach chooses — many scholarship
              athletes are on a partial award, not a full one.
            </span>,
            "A partial equivalency offer isn't a lesser offer — it's a different funding structure.",
          ]}
        />
      </StageCard>

      <StageCard variant="gold" badge="🎓" title="Private School Stacking">
        <BulletList
          items={[
            "Merit aid and partial athletic aid can often be combined.",
            "A school's academic scholarship office and athletic department are usually separate budgets.",
            "Ask each school directly whether merit and athletic aid stack — policies vary by institution.",
          ]}
        />
      </StageCard>

      <StageCard variant="navy" badge="SC" title="FAFSA & South Carolina Aid">
        <BulletList
          items={[
            <span key="1">
              <strong>HOPE Scholarship</strong> — state merit aid for SC
              residents attending in-state institutions.
            </span>,
            <span key="2">
              <strong>LIFE Scholarship</strong> — a step up from HOPE, tied to
              stronger GPA and test-score benchmarks.
            </span>,
            <span key="3">
              <strong>Palmetto Fellows</strong> — the state&apos;s top merit
              award, awarded competitively and early.
            </span>,
          ]}
        />
        <ConfirmRulesNote>
          FAFSA opens on a set date each cycle, and HOPE/LIFE/Palmetto
          Fellows each have their own deadlines revisited annually — confirm
          current deadlines each cycle at fafsa.gov and via SC CHE.
        </ConfirmRulesNote>
        <div className="mt-3">
          <CourseTag type="parent" />
          <p className="text-sm text-slate-700">
            File the FAFSA as early as the window allows — some state and
            institutional aid is awarded on a first-come basis within
            eligibility, not purely by need.
          </p>
        </div>
      </StageCard>

      <StageCard variant="green" badge="✆" title="Communication Etiquette">
        <BulletList
          items={[
            <span key="1">
              <strong>The athlete should lead conversations with coaches</strong>{" "}
              — emails, calls, texts, and visit follow-ups come from the
              athlete, not the parent.
            </span>,
            "Public complaints about playing time or other recruits on social media — coaches see this.",
            "Committing verbally while continuing to take other visits without being upfront about it.",
            "Letting a parent send the “why haven't you called back” follow-up instead of the athlete.",
          ]}
        />
        <div className="mt-3">
          <CourseTag type="parent" />
          <p className="text-sm text-slate-700">
            Your role is preparation and support, not the front line — help
            your athlete draft the first email, then let them send it.
          </p>
        </div>
      </StageCard>
    </div>
  );
}
