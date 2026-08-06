"use client";

import React, { useState } from "react";
import { SubcategoryCard } from "./SubcategoryCard";
import { Search } from "lucide-react";

export interface Subcategory {
  name: string;
  slug: string;
  icon?: string;
  productCount: number;
}

interface SubcategoryGridProps {
  categorySlug: string;
  subcategories: Subcategory[];
}

export function SubcategoryGrid({
  categorySlug,
  subcategories,
}: SubcategoryGridProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = subcategories.filter((sub) =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalDesigns = subcategories.reduce(
    (acc, curr) => acc + curr.productCount,
    0,
  );

  return (
    <div className="w-full">
      {/* Header and Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 text-sm uppercase tracking-widest text-[var(--color-primary)] mb-4">
            <span>{subcategories.length} Categories</span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-primary)]/50"></span>
            <span>{totalDesigns} Designs</span>
          </div>
        </div>

        <div className="relative w-full md:w-72 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[var(--color-foreground-secondary)] group-focus-within:text-[var(--color-primary)] transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 sm:py-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full text-sm placeholder-[var(--color-foreground-secondary)] text-[var(--color-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-all shadow-sm"
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search collections"
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
          {filtered.map((subcategory, index) => (
            <SubcategoryCard
              key={subcategory.slug}
              name={subcategory.name}
              slug={subcategory.slug}
              icon={subcategory.icon}
              productCount={subcategory.productCount}
              categorySlug={categorySlug}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <p className="text-[var(--color-foreground-secondary)] font-serif text-xl">
            No collections found matching &quot;{searchQuery}&quot;
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-4 text-sm uppercase tracking-widest text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}
