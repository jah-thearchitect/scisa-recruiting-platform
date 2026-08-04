import Image from "next/image";
import Link from "next/link";

const TRACKS = [
  { href: "/course/track-1-timeline", label: "1. Core Recruiting Timeline" },
  { href: "/course/track-2-scisa-regional", label: "2. SCISA & Regional Reality" },
  { href: "/course/track-3-parent-toolbox", label: "3. Parent Toolbox" },
];

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-header.png"
            alt="Ben Lippen School"
            width={36}
            height={26}
            className="h-9 w-auto object-contain"
          />
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Ben Lippen Athletics · The Digital Roadmap
          </p>
        </div>
        <Link href="/" className="text-sm text-slate-500 hover:underline">
          ← Home
        </Link>
      </div>

      <nav className="mt-4 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
        {TRACKS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="rounded-full bg-bl-green/10 px-3 py-1 text-sm font-medium text-bl-green-dark hover:bg-bl-green/20"
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8">{children}</div>
    </div>
  );
}
