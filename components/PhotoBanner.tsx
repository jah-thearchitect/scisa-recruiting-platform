import Image from "next/image";

export function PhotoBanner({
  src,
  alt,
  caption,
  height = 220,
}: {
  src: string;
  alt: string;
  caption?: string;
  height?: number;
}) {
  return (
    <div
      className="not-prose relative w-full overflow-hidden rounded-xl"
      style={{ height }}
    >
      <Image src={src} alt={alt} fill className="object-cover" sizes="768px" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
      {caption && (
        <p className="absolute bottom-3 left-4 text-sm font-medium text-white drop-shadow">
          {caption}
        </p>
      )}
    </div>
  );
}
