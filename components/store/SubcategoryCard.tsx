import Link from "next/link";
import { ArrowRight, Gem, Box, Watch, Diamond } from "lucide-react";
import React from "react";

const IconMap: Record<string, React.ElementType> = {
  ring: Gem,
  necklace: Diamond,
  watch: Watch,
  bracelet: Diamond,
  earrings: Gem,
  default: Box,
};

export interface SubcategoryCardProps {
  name: string;
  slug: string;
  icon?: string;
  productCount: number;
  categorySlug: string;
  index: number;
}

export function SubcategoryCard({
  name,
  slug,
  icon,
  productCount,
  categorySlug,
  index,
}: SubcategoryCardProps) {
  const Icon =
    icon && IconMap[icon.toLowerCase()]
      ? IconMap[icon.toLowerCase()]
      : IconMap.default;
  const isDisabled = productCount === 0;

  const animationDelay = `${index * 75}ms`;

  const cardClasses = ` group relative flex flex-col justify-between p-4 h-full bg-[var(--color-surface)] rounded-[20px] border border-[var(--color-border)] transition-all duration-500 ease-out shadow-[0_4px_20px_rgba(0,0,0,0.02)] ${!isDisabled ? "hover:shadow-[0_8px_30px_rgba(200,168,107,0.15)] hover:-translate-y-1 hover:border-[var(--color-primary)] cursor-pointer" : "opacity-80"} overflow-hidden`;

  // Inner content
  const content = (
    <>
      <div className="flex flex-col gap-5 sm:gap-6">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center border border-[var(--color-border)] shadow-sm transition-all duration-500 ease-out bg-[var(--color-surface-secondary)] text-[var(--color-primary)] ${!isDisabled ? "group-hover:scale-110 group-hover:bg-[var(--color-primary)] group-hover:text-white" : ""}`}
        >
          <Icon className="w-5 h-5 stroke-[1.5]" />
        </div>

        <div>
          <h3 className="font-serif text-xl sm:text-2xl text-[var(--color-foreground)] tracking-wide mb-1.5 capitalize">
            {name}
          </h3>
          <p className="text-[10px] sm:text-xs text-[var(--color-foreground-secondary)] font-medium tracking-wider uppercase">
            {isDisabled
              ? "Coming Soon"
              : `${productCount} Design${productCount !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>

      <div className="mt-10 sm:mt-12 pt-6 border-t border-[var(--color-border)]">
        {isDisabled ? (
          <span className="inline-flex items-center text-[10px] sm:text-xs font-medium tracking-wide text-[var(--color-foreground-secondary)] uppercase">
            Currently Unavailable
          </span>
        ) : (
          <span className="inline-flex items-center text-[10px] sm:text-xs font-medium tracking-wide text-[var(--color-primary)] uppercase relative">
            Explore Collection
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1.5" />
          </span>
        )}
      </div>
    </>
  );

  const wrapperClasses = `opacity-0 animate-[fade-in-up_0.6s_ease-out_forwards]`;

  if (isDisabled) {
    return (
      <div
        className={`${cardClasses} ${wrapperClasses}`}
        style={{ animationDelay }}
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={`/category/${categorySlug}/${slug}`}
      className={`${cardClasses} ${wrapperClasses} focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-4 focus:ring-offset-[var(--color-background)]`}
      style={{ animationDelay }}
      aria-label={`Explore ${name} collection`}
    >
      {content}
    </Link>
  );
}
