export function CourseTag({ type }: { type: "athlete" | "parent" }) {
  const label = type === "athlete" ? "Athlete Action" : "Parent Note";
  const classes =
    type === "athlete"
      ? "bg-bl-green text-white"
      : "bg-bl-gold/30 text-amber-900";

  return (
    <span
      className={`mb-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}
    >
      {label}
    </span>
  );
}

export function ConfirmRulesNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-900">
      {children}
    </p>
  );
}
