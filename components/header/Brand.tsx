import Image from "next/image";
import Link from "next/link";

type BrandProps = {
  compact?: boolean;
  className?: string;
};

export function Brand({ compact = false, className = "" }: BrandProps) {
  const imgSize = compact ? 40 : 72;
  const titleClass = compact
    ? "font-serif text-xl tracking-[0.25em] uppercase"
    : "font-serif text-3xl tracking-[0.35em] uppercase";
  const subtitleClass = compact
    ? "font-semibold mt-0.5 text-[0.6rem] tracking-[0.6em] uppercase"
    : "font-semibold mt-1 text-xs tracking-[0.6em] uppercase";

  return (
    <Link href="/" className={`group flex items-center gap-3 ${className}`}>
      <Image
        src="/logo.png"
        alt="Princyn Jewels"
        width={imgSize}
        height={imgSize}
        priority
        quality={100}
        className="object-contain"
      />

      <div className="text-center text-primary">
        <h1 className={`${titleClass} transition-all group-hover:text-primary-hover group-hover:scale-[1.02]`}>
          Princyn
        </h1>

        <p className={`${subtitleClass} transition-all group-hover:text-primary-hover group-hover:scale-[1.02]`}>
          JEWELS
        </p>
      </div>
    </Link>
  );
}