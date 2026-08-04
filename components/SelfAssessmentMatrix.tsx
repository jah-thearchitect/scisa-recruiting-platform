"use client";

import { useState } from "react";

type Tier = "FBS" | "FCS" | "DII/DIII" | "Preferred Walk-On";

function suggestTier(fortyYd: number, verticalIn: number, weightLbs: number): Tier {
  // A simplified starting point, not a scouting evaluation — see caveat below.
  const speedScore = fortyYd <= 4.5 ? 3 : fortyYd <= 4.7 ? 2 : fortyYd <= 4.9 ? 1 : 0;
  const explosionScore = verticalIn >= 34 ? 3 : verticalIn >= 30 ? 2 : verticalIn >= 26 ? 1 : 0;
  const sizeScore = weightLbs >= 210 ? 2 : weightLbs >= 180 ? 1 : 0;

  const total = speedScore + explosionScore + sizeScore;

  if (total >= 7) return "FBS";
  if (total >= 5) return "FCS";
  if (total >= 3) return "DII/DIII";
  return "Preferred Walk-On";
}

const TIER_NOTE: Record<Tier, string> = {
  FBS: "Elite-metrics territory — schools like South Carolina or Clemson. Very few athletes land here; verified numbers matter enormously at this tier.",
  FCS: "Strong fit for programs like The Citadel, Wofford, Furman, South Carolina State, or Coastal Carolina.",
  "DII/DIII": "Solid range for programs like Newberry, Limestone, or Benedict — often the best combination of playing time and fit.",
  "Preferred Walk-On": "Walk-on conversations are still real recruiting — a lot of great careers start here, often at a program above where combine numbers alone would suggest.",
};

export function SelfAssessmentMatrix() {
  const [fortyYd, setFortyYd] = useState("4.7");
  const [verticalIn, setVerticalIn] = useState("30");
  const [weightLbs, setWeightLbs] = useState("185");
  const [result, setResult] = useState<Tier | null>(null);

  return (
    <div className="not-prose rounded-lg border border-slate-200 p-5">
      <h3 className="text-base font-semibold text-slate-900">
        Realistic Tier Self-Assessment
      </h3>
      <p className="mt-1 text-sm text-slate-600">
        Enter your verified (or best current estimate) metrics for a
        starting-point tier suggestion — not a scouting evaluation.
      </p>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          40yd (sec)
          <input
            type="number"
            step="0.01"
            value={fortyYd}
            onChange={(e) => setFortyYd(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Vertical (in)
          <input
            type="number"
            step="0.5"
            value={verticalIn}
            onChange={(e) => setVerticalIn(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Weight (lbs)
          <input
            type="number"
            value={weightLbs}
            onChange={(e) => setWeightLbs(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <button
        onClick={() =>
          setResult(
            suggestTier(Number(fortyYd), Number(verticalIn), Number(weightLbs))
          )
        }
        className="mt-4 rounded-md bg-bl-green px-4 py-2 text-sm font-medium text-white hover:bg-bl-green-dark"
      >
        Suggest a tier
      </button>

      {result && (
        <div className="mt-4 rounded-md bg-slate-50 px-4 py-3">
          <p className="font-semibold text-slate-900">{result}</p>
          <p className="mt-1 text-sm text-slate-600">{TIER_NOTE[result]}</p>
        </div>
      )}

      <p className="mt-4 text-xs text-slate-500">
        This is a simplified, three-metric heuristic meant to give a
        directional starting point — real evaluation weighs position,
        production on tape, academics, and program need. Treat the result as
        a conversation-starter with your coach, not a verdict.
      </p>
    </div>
  );
}
