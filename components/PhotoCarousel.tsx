"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDES = [
  { src: "/gallery/football-action.jpg", label: "Football" },
  { src: "/gallery/track-1.jpg", label: "Track & Field" },
  { src: "/gallery/baseball-1.jpg", label: "Baseball" },
  { src: "/gallery/basketball-boys-1.jpg", label: "Boys Basketball" },
  { src: "/gallery/tennis-1.jpg", label: "Boys Tennis" },
  { src: "/gallery/basketball-girls-1.jpg", label: "Girls Basketball" },
  { src: "/gallery/soccer-1.jpg", label: "Soccer" },
  { src: "/gallery/baseball-championship.jpg", label: "Baseball" },
  { src: "/gallery/baseball-3.jpg", label: "Baseball" },
  { src: "/gallery/track-2.jpg", label: "Track & Field" },
];

export function PhotoCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index];

  return (
    <div className="not-prose relative h-72 w-full overflow-hidden rounded-xl sm:h-96">
      {SLIDES.map((s, i) => (
        <Image
          key={s.src}
          src={s.src}
          alt={s.label}
          fill
          priority={i === 0}
          className={`object-cover transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          sizes="768px"
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
      <p className="absolute bottom-4 left-5 text-lg font-semibold text-white drop-shadow">
        {slide.label}
      </p>

      <div className="absolute bottom-4 right-5 flex gap-1.5">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            onClick={() => setIndex(i)}
            aria-label={`Show slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
