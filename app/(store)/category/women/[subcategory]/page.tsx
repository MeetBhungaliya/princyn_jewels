import type { Metadata } from "next";
import { CategoryRoute } from "@/components/store/CategoryRoute";
import { categoryRepository } from "@/lib/repositories/content";

import { toTitleCase } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subcategory: string }>;
}): Promise<Metadata> {
  const { subcategory } = await params;
  const category = await categoryRepository.bySlug("women");
  if (!category) return {};
  const decodedSubcategory = toTitleCase(decodeURIComponent(subcategory));
  const imageUrl = category.imagePath || "/logo.png";
  return {
    title: `${decodedSubcategory} | ${category.name}`,
    description: category.description || undefined,
    openGraph: {
      title: `${decodedSubcategory} | ${category.name} | Princyn Jewels`,
      description: category.description || undefined,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${decodedSubcategory} | ${category.name} | Princyn Jewels`,
      description: category.description || undefined,
      images: [imageUrl],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ subcategory: string }>;
}) {
  const { subcategory } = await params;
  return <CategoryRoute categorySlug="women" subcategorySlug={subcategory} />;
}
