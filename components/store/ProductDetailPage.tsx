"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Ruler, Palette, Diamond, Weight, Boxes, Sparkles } from "lucide-react";
import { getImageUrl } from "@/lib/utils";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface ProductDetail {
  id: string;
  title: string;
  slug: string;
  imagePath: string;
  subcategory: string;
  categoryName: string;
  categorySlug: string;
  size: string | null;
  metalType: string | null;
  karat: string | null;
  color: string | null;
  netWeight: string | null;
  diamondWeight: string | null;
  grossWeight: string | null;
}

export function ProductDetailPage({ product }: { product: ProductDetail }) {
  const WHATSAPP_NUMBER = "918320828901"; // Placeholder, update later
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const whatsappMessage = encodeURIComponent(`Hi, I'm interested in this product: ${product.title}\n${currentUrl}`);
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

  const specs = [
    { label: "Size", value: product.size, icon: Ruler },
    { label: "Metal Type", value: product.metalType ? `${product.metalType.charAt(0).toUpperCase() + product.metalType.slice(1)} ${product.karat ? `(${product.karat}K)` : ''}` : null, icon: Sparkles },
    { label: "Color", value: product.color, icon: Palette },
    { label: "Net Weight", value: product.netWeight, icon: Weight },
    { label: "Diamond Weight", value: product.diamondWeight, icon: Diamond },
    { label: "Gross Weight", value: product.grossWeight, icon: Boxes },
  ].filter((spec) => spec.value && spec.value.trim() !== "");

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header/Breadcrumbs */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] sticky top-0 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/category/${product.categorySlug}`}
              className="p-2 -ml-2 rounded-full hover:bg-[var(--color-surface-secondary)] transition-colors text-[var(--color-foreground-secondary)]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Breadcrumb>
              <BreadcrumbList className="text-xs sm:text-sm">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-[var(--color-foreground-secondary)] hover:text-[var(--color-primary)]">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/category/${product.categorySlug}`} className="text-[var(--color-foreground-secondary)] hover:text-[var(--color-primary)]">
                    {product.categoryName}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-[var(--color-foreground)] font-medium max-w-[120px] sm:max-w-xs truncate">
                    {product.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-[var(--color-surface-secondary)] border border-[var(--color-border)] shadow-md">
              <Image
                src={getImageUrl(product.imagePath)}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full lg:w-1/2 flex flex-col"
          >
            <div className="mb-8">
              <div className="text-sm font-semibold tracking-wider text-[var(--color-primary)] uppercase mb-2">
                {product.subcategory}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[var(--color-foreground)] leading-tight mb-4">
                {product.title}
              </h1>
            </div>

            {specs.length > 0 && (
              <div className="mb-10">
                <h3 className="text-sm font-semibold text-[var(--color-foreground-secondary)] uppercase tracking-widest mb-4">
                  Product Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {specs.map((spec, i) => {
                    const Icon = spec.icon;
                    return (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                        <div className="p-2 rounded-lg bg-[var(--color-surface-secondary)] text-[var(--color-primary)]">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-[var(--color-foreground-secondary)]">{spec.label}</p>
                          <p className="text-sm font-medium text-[var(--color-foreground)]">{spec.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-auto pt-8 border-t border-[var(--color-border)]">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full sm:w-auto gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <MessageCircle className="w-6 h-6" />
                Inquire on WhatsApp
              </a>
              <p className="text-xs text-center sm:text-left text-[var(--color-foreground-secondary)] mt-4">
                Our team will assist you with pricing, customization, and purchase details.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
