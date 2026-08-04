import Image from "next/image";
import Link from "next/link";
import { PhotoCarousel } from "@/components/PhotoCarousel";

export default function Home() {
  return (
    <main className="flex flex-col">
      <section className="relative overflow-hidden">
        <Image
          src="/gallery/football-flags.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bl-navy/90 via-bl-navy/80 to-bl-green-dark/90" />

        <div className="relative mx-auto flex max-w-3xl flex-col px-6 py-24">
          <Image
            src="/logo-header.png"
            alt="Ben Lippen School"
            width={140}
            height={100}
            className="h-20 w-auto object-contain"
            priority
          />

          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-bl-gold">
            Ben Lippen Athletics
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white">
            Next Level.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">
            A recruiting timeline, a verified athlete profile, and a
            shareable resume page for college coaches. Built for Ben Lippen
            student-athletes and their families.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-md bg-bl-gold px-5 py-2.5 text-sm font-semibold text-bl-navy hover:bg-bl-gold-dark"
            >
              Create athlete account
            </Link>
            <Link
              href="/course/track-1-timeline"
              className="rounded-md border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur hover:bg-white/20"
            >
              Browse the recruiting course
            </Link>
            <Link
              href="/admin/roster"
              className="rounded-md border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur hover:bg-white/20"
            >
              School admin login
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-6 pt-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-bl-green">
          Our Athletics Philosophy
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">
          Win on the Scoreboard. Win in Life. Win for Eternity.
        </h2>
        <p className="mt-2 max-w-xl text-sm text-slate-600">
          Ben Lippen student-athletes are coached to compete with excellence
          while honoring the Lord — on the field and beyond it.
        </p>
      </section>

      <section className="mx-auto w-full max-w-3xl px-6 py-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-bl-green">
          Falcon Athletics
        </p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">
          Across every sport
        </h2>
        <div className="mt-4">
          <PhotoCarousel />
        </div>
      </section>

      <p className="mx-auto max-w-3xl px-6 pb-12 text-xs text-slate-400">
        This tool supports outbound college recruiting only. It does not
        solicit school-to-school transfers, which SCISA prohibits.
      </p>
    </main>
  );
}
