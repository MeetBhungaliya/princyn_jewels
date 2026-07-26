import type { Metadata } from "next";
import { CategoryRoute } from "@/components/store/CategoryRoute";
import { categoryRepository } from "@/lib/repositories/content";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}): Promise<Metadata> {
  const { category: slug, subcategory } = await params;
  const category = await categoryRepository.bySlug(slug);
  if (!category) return {};
  const decodedSubcategory = decodeURIComponent(subcategory);
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
  params: Promise<{ category: string; subcategory: string }>;
}) {
  const { category, subcategory } = await params;
  return (
    <CategoryRoute categorySlug={category} subcategorySlug={subcategory} />
  );
}
