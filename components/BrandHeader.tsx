import Image from "next/image";
import Link from "next/link";

export function BrandHeader() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/logo-header.png"
        alt="Ben Lippen School"
        width={32}
        height={23}
        className="h-8 w-auto object-contain"
      />
      <span className="text-sm font-semibold uppercase tracking-wide text-bl-green">
        Ben Lippen Athletics
      </span>
    </Link>
  );
}
