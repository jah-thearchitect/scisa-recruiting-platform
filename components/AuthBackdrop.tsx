import Image from "next/image";

export function AuthBackdrop({
  image,
  maxWidth = "max-w-md",
  children,
}: {
  image: string;
  maxWidth?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
      <Image src={image} alt="" fill priority className="object-cover" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-b from-bl-navy/90 via-bl-navy/80 to-bl-green-dark/90" />
      <div className={`relative w-full ${maxWidth} rounded-2xl bg-white/97 p-8 shadow-2xl`}>
        {children}
      </div>
    </div>
  );
}
