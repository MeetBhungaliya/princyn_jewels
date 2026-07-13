"use client";

import { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Star,
  Gem,
  Sparkles,
  Watch,
  Heart,
  Gift,
  Package,
  Layers,
  Grid,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export interface Product {
  id: string;
  name: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  tag: string;
  metal: string;
  subcategory: string;
}

interface Subcategory {
  id: string;
  name: string;
}

interface CategoryPageTemplateProps {
  title: string;
  tagline: string;
  description: string;
  bannerImage: string;
  products: Product[];
  subcategories: Subcategory[];
  breadcrumbLabel: string;
  categorySlug: string;
  currentSubcategory?: string;
}

// Map subcategory IDs to premium lucide icons for rich visual feedback
const ICON_MAP: Record<string, any> = {
  // Men's & general
  ring: Gem,
  studs: Sparkles,
  stud: Sparkles,
  pendant: Layers,
  chain: Layers,
  bracelet: Layers,
  // Women's
  necklace: Gem,
  earring: Sparkles,
  nosepin: Sparkles,
  "tulsi mala": Layers,
  bangle: Layers,
  "bridal payal": Heart,
  anklet: Heart,
  "payal (anklet)": Heart,
  payal: Heart,
  "toe ring": Gem,
  kandora: Layers,
  juda: Sparkles,
  mangalsutra: Heart,
  "normal mangalsutra": Heart,
  "shrimant rakhi": Gift,
  // Kids'
  kadli: Layers,
  poncha: Layers,
  nazariya: Heart,
  // Others'
  watch: Watch,
  keyring: Package,
  storage: Package,
  "gift box": Gift,
  accessories: Grid,
};

export default function CategoryPageTemplate({
  title,
  tagline,
  description,
  bannerImage,
  products,
  subcategories,
  breadcrumbLabel,
  categorySlug,
  currentSubcategory,
}: CategoryPageTemplateProps) {
  const selectedSub = currentSubcategory || null;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 2);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScroll();
      // Run multiple checks as layout and animation finishes
      const t1 = setTimeout(checkScroll, 100);
      const t2 = setTimeout(checkScroll, 300);
      const t3 = setTimeout(checkScroll, 500);
      const t4 = setTimeout(checkScroll, 800);

      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [subcategories, selectedSub]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -240 : 240;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      // Small timeout to check scroll state after scroll animation completes
      setTimeout(checkScroll, 300);
    }
  };

  // Filter products based on selection
  const filteredProducts = selectedSub
    ? products.filter(
        (p) => p.subcategory?.toLowerCase() === selectedSub.toLowerCase(),
      )
    : products;

  return (
    <>
      <main className="flex-grow bg-[var(--color-background)] min-h-screen text-[var(--color-foreground)]">
        {/* Category Hero / Banner */}
        <section className="relative h-[260px] md:h-[360px] w-full flex items-center justify-center overflow-hidden border-b border-[var(--color-border)]">
          <Image
            src={bannerImage}
            alt={title}
            fill
            priority
            className="object-cover object-center transform scale-100 filter brightness-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
          <div className="relative z-10 text-center px-4 max-w-3xl">
            <Link
              href="/"
              className="inline-flex items-center text-xs text-white/80 hover:text-white mb-4 uppercase tracking-[0.2em] transition-colors"
            >
              <ArrowLeft className="w-3 h-3 mr-2" /> Back to Home
            </Link>
            <h1 className="text-3xl md:text-5xl font-light text-white tracking-wider mb-3 uppercase">
              {title}
            </h1>
            <p className="text-[var(--color-primary)] text-xs md:text-sm tracking-widest italic font-serif mb-2">
              {tagline}
            </p>
            <p className="text-white/85 text-xs md:text-sm font-light max-w-xl mx-auto line-clamp-2">
              {description}
            </p>
          </div>
        </section>

        {/* Content Area */}
        <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
          {/* Breadcrumbs */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[var(--color-border)] mb-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumbLabel}</BreadcrumbPage>
                </BreadcrumbItem>
                {selectedSub && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="capitalize">
                        {selectedSub}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
            {selectedSub && (
              <Link
                href={`/category/${categorySlug}`}
                className="text-xs uppercase tracking-widest font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> View All Categories
              </Link>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!selectedSub ? (
              // 1. SUBCATEGORIES GRID VIEW
              <motion.div
                key="subcategories-grid"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-primary)] font-semibold">
                    Refine Your Selection
                  </span>
                  <h2 className="text-2xl md:text-3xl font-light tracking-wide text-[var(--color-foreground)]">
                    Choose a Subcategory
                  </h2>
                  <p className="text-xs text-[var(--color-foreground-secondary)]">
                    Explore our curated premium items customized for your
                    lifestyle.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {subcategories.map((sub) => {
                    const IconComponent = ICON_MAP[sub.id] || Gem;
                    return (
                      <Link
                        key={sub.id}
                        href={`/category/${categorySlug}/${sub.id}`}
                        className="group relative flex flex-col items-center justify-center p-6 md:p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-sm hover:shadow-md hover:border-[var(--color-primary)] transition-all duration-300 text-center cursor-pointer min-h-[140px] md:min-h-[160px]"
                      >
                        {/* Decorative background element */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Icon Container */}
                        <div className="mb-4 p-3 rounded-full bg-[var(--color-surface-secondary)] border border-[var(--color-border)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors duration-300">
                          <IconComponent className="w-6 h-6 text-[var(--color-primary)] group-hover:text-white transition-colors" />
                        </div>

                        {/* Text */}
                        <h3 className="text-sm font-medium tracking-wide text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] capitalize transition-colors duration-300">
                          {sub.name}
                        </h3>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              // 2. PRODUCTS LIST VIEW WITH TABS FILTER
              <motion.div
                key="products-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {/* Horizontal Category Switcher with nice arrow indicators */}
                <div className="relative w-full group/scroll">
                  {/* Left Arrow Indicator */}
                  <AnimatePresence>
                    {showLeftArrow && (
                      <motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        onClick={() => handleScroll("left")}
                        className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-[34px] h-[34px] rounded-full bg-[var(--color-surface)] border border-[var(--color-primary)] shadow-md text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white hover:scale-105 transition-all cursor-pointer"
                        aria-label="Scroll left"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* Left Blur Fade Overlay */}
                  {showLeftArrow && (
                    <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[var(--color-background)] to-transparent pointer-events-none z-10" />
                  )}

                  {/* Right Arrow Indicator */}
                  <AnimatePresence>
                    {showRightArrow && (
                      <motion.button
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        onClick={() => handleScroll("right")}
                        className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-[34px] h-[34px] rounded-full bg-[var(--color-surface)] border border-[var(--color-primary)] shadow-md text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white hover:scale-105 transition-all cursor-pointer"
                        aria-label="Scroll right"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* Right Blur Fade Overlay */}
                  {showRightArrow && (
                    <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[var(--color-background)] to-transparent pointer-events-none z-10" />
                  )}

                  {/* Scrollable Container (no scrollbars, no hover borders) */}
                  <div
                    ref={scrollRef}
                    onScroll={checkScroll}
                    onMouseEnter={checkScroll}
                    className="flex items-center gap-2 overflow-x-auto py-1.5 scrollbar-none w-full border-b border-[var(--color-border)]"
                  >
                    {subcategories.map((sub, i) => (
                      <Link
                        key={sub.id + i}
                        href={`/category/${categorySlug}/${sub.id}`}
                        scroll={false}
                        className={`px-4 py-2 rounded-full border text-xs font-medium transition-all whitespace-nowrap capitalize cursor-pointer ${
                          selectedSub === sub.id
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-sm"
                            : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]"
                        }`}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Subcategory title */}
                <div>
                  <h2 className="text-xl md:text-2xl font-light text-[var(--color-foreground)] tracking-wide uppercase mb-1">
                    {selectedSub}
                  </h2>
                  <p className="text-[10px] text-[var(--color-foreground-secondary)] uppercase tracking-wider">
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1 ? "Product" : "Products"}{" "}
                    Found
                  </p>
                </div>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {filteredProducts.map((product, i) => (
                      <Card
                        key={product.id + i}
                        className="group relative flex flex-col justify-between bg-[var(--color-surface)] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 p-0 border border-[var(--color-border)]"
                      >
                        {/* Image Container */}
                        <div className="relative aspect-square w-full overflow-hidden bg-[var(--color-surface-secondary)] border-b border-[var(--color-border)]">
                          {product.tag && (
                            <span className="absolute top-3 left-3 z-10 text-[9px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded bg-[var(--color-primary)] text-white">
                              {product.tag}
                            </span>
                          )}
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </div>

                        {/* Info Container */}
                        <CardContent className="p-5 flex flex-col flex-grow">
                          <span className="text-[10px] uppercase tracking-wider text-[var(--color-primary)] font-medium mb-1.5">
                            {product.metal}
                          </span>
                          <h3 className="text-sm font-medium text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 min-h-[40px]">
                            {product.name}
                          </h3>

                          {/* Rating */}
                          <div className="flex items-center gap-1.5 mt-2.5 mb-2">
                            <div className="flex items-center text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 fill-current ${
                                    i < Math.floor(product.rating)
                                      ? "text-amber-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-[var(--color-foreground-secondary)] font-medium">
                              {product.rating} ({product.reviews})
                            </span>
                          </div>
                        </CardContent>

                        {/* Price and CTA */}
                        <CardFooter className="mt-auto pt-4 border-t border-[var(--color-border)] flex items-center justify-between p-5 bg-transparent">
                          <span className="text-base font-semibold text-[var(--color-foreground)]">
                            {product.price}
                          </span>
                          <button className="text-xs uppercase tracking-wider text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-semibold transition-colors">
                            View Details
                          </button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 border border-dashed border-[var(--color-border)] rounded-2xl bg-[var(--color-surface-secondary)]">
                    <Gem className="w-12 h-12 text-[var(--color-foreground-secondary)]/50 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[var(--color-foreground)] mb-1">
                      No Products Found
                    </h3>
                    <p className="text-xs text-[var(--color-foreground-secondary)] max-w-xs mx-auto mb-6">
                      We currently don't have any products in this specific
                      subcategory.
                    </p>
                    <Link
                      href={`/category/${categorySlug}`}
                      className="inline-block px-4 py-2 rounded-full border border-[var(--color-primary)] text-xs font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-all"
                    >
                      Browse All Categories
                    </Link>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}
