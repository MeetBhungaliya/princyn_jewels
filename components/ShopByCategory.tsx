"use client";

import Image from "next/image";
import Link from "next/link";

interface CategoryItem {
  id: string;
  name: string;
  tagline: string;
  imageUrl: string;
  link: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: "men",
    name: "Men",
    tagline: "Bold & Refined",
    imageUrl: "/shopByCategory/men.jpeg",
    link: "/category/men",
  },
  {
    id: "women",
    name: "Women",
    tagline: "Eternal Elegance",
    imageUrl: "/shopByCategory/women.jpeg",
    link: "/category/women",
  },
  {
    id: "kids",
    name: "Kids",
    tagline: "Precious Moments",
    imageUrl: "/shopByCategory/kids.jpeg",
    link: "/category/kids",
  },
  {
    id: "other",
    name: "Other",
    tagline: "Curated Accessories",
    imageUrl: "/shopByCategory/other.jpeg",
    link: "/category/other",
  },
];

export function ShopByCategory() {
  return (
    <section className="py-12 md:py-16 bg-[var(--color-surface-secondary)] border-y border-[var(--color-border)]">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[var(--color-primary)] font-semibold block mb-3">
            Explore Collections
          </span>
          <h2 className="text-3xl md:text-5xl font-light text-[var(--color-foreground)] tracking-wide">
            Shop By Category
          </h2>
          <div className="w-16 h-[2px] bg-[var(--color-primary)] mx-auto mt-6" />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {CATEGORIES.map((category, i) => (
            <Link
              key={category.id + i}
              href={category.link}
              className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-md hover:shadow-xl transition-all duration-500 ease-out"
              aria-label={`Shop ${category.name} collection`}
            >
              {/* Image Container */}
              <div className="relative w-full h-full bg-black/5">
                <Image
                  src={category.imageUrl}
                  alt={`${category.name} Category`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  className="object-contain object-center transition-transform duration-700 ease-out object-cover"
                />

                {/* Elegant dark gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity duration-500" />

                {/* Gold inner border highlight on hover */}
                <div className="absolute inset-4 border border-[var(--color-gold)] opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 pointer-events-none rounded-xl" />

                {/* Text Content */}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-center flex flex-col items-center justify-end z-10">
                  <h3 className="text-2xl font-light text-white tracking-widest uppercase mb-1 drop-shadow-md">
                    {category.name}
                  </h3>
                  <p className="text-xs text-[var(--color-primary)] tracking-wider italic font-serif opacity-90 group-hover:translate-y-[-2px] transition-transform duration-500">
                    {category.tagline}
                  </p>
                  
                  {/* Shop Now Micro-CTA */}
                  <span className="mt-4 text-[10px] text-white/80 uppercase tracking-[0.2em] border-b border-white/20 pb-1 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75">
                    Discover More
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
