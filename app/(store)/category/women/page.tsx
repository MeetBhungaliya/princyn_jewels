import type { Metadata } from "next";
import { CategoryRoute } from "@/components/store/CategoryRoute";
import { categoryRepository } from "@/lib/repositories/content";

export async function generateMetadata(): Promise<Metadata> {
  const category = await categoryRepository.bySlug("women");
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

export default function Page() {
  return <CategoryRoute categorySlug="women" />;
}
