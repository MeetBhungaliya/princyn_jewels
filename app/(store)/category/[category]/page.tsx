import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryRoute } from "@/components/store/CategoryRoute";
import { categoryRepository } from "@/lib/repositories/content";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await categoryRepository.bySlug(slug);
  if (!category) return {};
  const imageUrl = category.imagePath || "/logo.png";
  return {
    title: category.name,
    description: category.description || undefined,
    openGraph: {
      title: `${category.name} | Princyn Jewels`,
      description: category.description || undefined,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} | Princyn Jewels`,
      description: category.description || undefined,
      images: [imageUrl],
    },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!category) notFound();
  return <CategoryRoute categorySlug={category} />;
}
