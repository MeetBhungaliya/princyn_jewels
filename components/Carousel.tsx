"use client";

import Image from "next/image";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

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
  imageUrl: string;
  altText: string;
  link?: string;
}

const DEFAULT_BANNERS: Banner[] = [
  {
    id: 1,
    imageUrl: "/carousel/1.png",
    altText: "Jewelry promotion slide one",
  },
  {
    id: 2,
    imageUrl: "/carousel/2.png",
    altText: "Jewelry promotion slide two",
  },
  {
    id: 2,
    imageUrl: "/carousel/3.png",
    altText: "Jewelry promotion slide three",
  },
];

export function Carousel({
  banners = DEFAULT_BANNERS,
}: {
  banners?: Banner[];
}) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  );

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative w-full overflow-hidden">
      <C
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full group"
        opts={{ loop: true }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="-ml-0">
          {banners.map((banner) => (
            <CarouselItem key={banner.id} className="pl-0">
              <div className="relative w-full overflow-hidden">
                {/* Mobile aspect ratio (square/tall) vs Desktop (wide) */}
                <div className="relative aspect-square w-full sm:aspect-[4/3] md:aspect-[21/9] lg:aspect-[24/10]">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.altText}
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="100vw"
                  />
                  {/* Subtle gradient overlay to make dots pop */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                </div>
              </div>
            </CarouselItem>
          ))}
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
