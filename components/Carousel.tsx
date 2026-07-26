"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { cn, getImageUrl } from "@/lib/utils";

import {
  Carousel as C,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export interface Banner {
  id: string | number;
  imageUrl?: string;
  mobileImageUrl?: string;
  desktopImageUrl?: string;
  altText: string;
  link?: string;
}

const BANNER_IMAGE_SIZES = "(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px";

export function Carousel({ banners }: { banners: Banner[] }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const autoplayPlugin = React.useMemo(
    () => Autoplay({ delay: 5000, stopOnInteraction: true }),
    [],
  );

  React.useEffect(() => {
    if (!api) return;

    const updateSelection = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap());
    };

    updateSelection();
    api.on("select", updateSelection);

    return () => {
      api.off("select", updateSelection);
    };
  }, [api]);

  if (banners.length === 0) return null;
  return (
    <div className="relative w-full overflow-hidden">
      <C
        setApi={setApi}
        plugins={[autoplayPlugin]}
        className="w-full group"
        opts={{ loop: true }}
        onMouseEnter={autoplayPlugin.stop}
        onMouseLeave={autoplayPlugin.reset}
      >
        <CarouselContent className="ml-0">
          {banners.map((banner, index) => {
            const mobileSrc = banner.mobileImageUrl ?? banner.imageUrl;
            const desktopSrc = banner.desktopImageUrl ?? banner.imageUrl;

            return (
              <CarouselItem key={banner.id} className="pl-0">
                <div className="relative w-full overflow-hidden bg-[var(--color-surface)]">
                  <div className="relative aspect-[2/2] md:aspect-[21/9] lg:aspect-[24/10] w-full">
                    {mobileSrc ? (
                      <Image
                        src={getImageUrl(mobileSrc)}
                        alt={banner.altText}
                        fill
                        priority={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                        className="block object-cover object-center md:hidden"
                        sizes="100vw"
                      />
                    ) : null}
                    {desktopSrc ? (
                      <Image
                        src={getImageUrl(desktopSrc)}
                        alt={banner.altText}
                        fill
                        priority={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                        className="hidden object-cover object-center md:block"
                        sizes="100vw"
                      />
                    ) : null}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                  </div>
                  {banner.link ? <Link href={banner.link} className="absolute inset-0 z-10" aria-label={`Open ${banner.altText}`} /> : null}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Navigation Arrows (Hidden on mobile, show on hover on desktop) */}
        <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <CarouselPrevious className="left-4 bg-background/80 hover:bg-background border-none shadow-lg text-foreground" />
          <CarouselNext className="right-4 bg-background/80 hover:bg-background border-none shadow-lg text-foreground" />
        </div>
      </C>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300 ease-in-out",
              current === index
                ? "w-6 bg-[var(--color-gold)]"
                : "w-1.5 bg-white/60 hover:bg-white",
            )}
          />
        ))}
      </div>
    </div>
  );
}
