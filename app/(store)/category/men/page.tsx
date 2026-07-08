import { Header } from "@/components/header";
import Products from "@/lib/products.json";
import { ArrowLeft, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface Product {
  id: string;
  name: string;
  price: string;
  rating: number;
  reviews: number;
  image: string;
  tag: string;
  metal: string;
}

export default function MenCategoryPage() {
  const products = Products.men as Product[];

  return (
    <>
      <Header />
      <main className="flex-grow bg-[var(--color-background)] min-h-screen">
        {/* Category Hero / Banner - Customized for Men */}
        <section className="relative h-[300px] md:h-[420px] w-full flex items-center justify-center overflow-hidden border-b border-[var(--color-border)]">
          <Image
            src="/shopByCategory/men.jpeg"
            alt="Men's Collection"
            fill
            priority
            className="object-cover object-[0_20%] transform scale-100 filter brightness-45"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
          <div className="relative z-10 text-center px-4 max-w-3xl">
            <Link
              href="/"
              className="inline-flex items-center text-xs text-white/80 hover:text-white mb-4 uppercase tracking-[0.2em] transition-colors"
            >
              <ArrowLeft className="w-3 h-3 mr-2" /> Back to Home
            </Link>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-light text-white tracking-wider mb-4 uppercase">
              Men's Collection
            </h1>
            <p className="text-[var(--color-primary)] text-sm md:text-md tracking-widest italic font-serif mb-2">
              Bold & Refined Styling
            </p>
            <p className="text-white/80 text-xs md:text-sm font-light max-w-xl mx-auto line-clamp-3">
              Exquisite cufflinks, sophisticated bands, and premium bracelets designed for the contemporary man.
            </p>
          </div>
        </section>

        {/* Filter and Content Area */}
        <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
          {/* Breadcrumb & Sort controls */}
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
                  <BreadcrumbPage>Men's Collection</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <Card
                key={product.id}
                className="group relative flex flex-col justify-between bg-[var(--color-surface)] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 p-0"
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
        </div>
      </main>
    </>
  );
}
