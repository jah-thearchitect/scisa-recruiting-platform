const VARIANTS = {
  green: {
    border: "border-bl-green/25",
    bg: "bg-bl-green-50",
    badge: "bg-bl-green text-white",
    heading: "text-bl-green-dark",
  },
  gold: {
    border: "border-bl-gold-dark/30",
    bg: "bg-bl-gold-50",
    badge: "bg-bl-gold-dark text-white",
    heading: "text-amber-900",
  },
  navy: {
    border: "border-bl-navy/20",
    bg: "bg-slate-50",
    badge: "bg-bl-navy text-white",
    heading: "text-bl-navy",
  },
} as const;

export function StageCard({
  variant,
  badge,
  title,
  subtitle,
  children,
}: {
  variant: keyof typeof VARIANTS;
  badge: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const v = VARIANTS[variant];
  return (
    <div className={`not-prose rounded-xl border ${v.border} ${v.bg} p-6`}>
      <div className="flex items-center gap-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${v.badge}`}
        >
          {badge}
        </span>
        <div>
          <h3 className={`text-lg font-semibold ${v.heading}`}>{title}</h3>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm text-slate-700">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-50" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
