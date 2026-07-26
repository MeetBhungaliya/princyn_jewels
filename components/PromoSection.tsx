"use client";

import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";

interface PromoItem {
  id: string;
  imageUrl: string;
  altText: string;
  link: string;
  title: string;
}

const PROMO_ITEMS: PromoItem[] = [
  {
    id: "necklace",
    imageUrl: "/promo/banner1.png",
    altText: "A Necklace That Enhances Your Beauty",
    link: "/collections/necklaces",
    title: "Signature Necklaces Collection",
  },
  {
    id: "gifting",
    imageUrl: "/promo/banner2.png",
    altText: "Gifting Jewelry and Divine Product by Princyn Jewels",
    link: "/collections/divine-gifting",
    title: "Divine & Gift Collection",
  },
];

export function PromoSection() {
  return (
    <section className="py-12 md:py-16 px-4 md:px-8 bg-[var(--color-surface)] border-t border-b border-[var(--color-border)]">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {PROMO_ITEMS.map((item, i) => (
            <Link
              key={item.id + i}
              href={item.link}
              className="group relative block overflow-hidden rounded-xl border border-[var(--color-border)] shadow-md hover:shadow-2xl transition-all duration-500 ease-out"
              aria-label={`Shop the ${item.title}`}
            >
              {/* Aspect Ratio container for images */}
              <div className="relative aspect-[2/1] md:aspect-[4/3] w-full overflow-hidden bg-[var(--color-background)]">
                <Image
                  src={getImageUrl(item.imageUrl)}
                  alt={item.altText}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                />
                
                {/* Elegant overlay on hover */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Golden inner border that appears on hover */}
                <div className="absolute inset-4 border border-[var(--color-gold)] opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 pointer-events-none rounded-lg" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
