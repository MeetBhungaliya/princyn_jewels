import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { productRepository, categoryRepository } from "@/lib/repositories/content";
import { ProductDetailPage } from "@/components/store/ProductDetailPage";
import { getImageUrl } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await productRepository.bySlug(slug);
  if (!product) return {};

  const category = await categoryRepository.byId(product.categoryId);
  const imageUrl = product.imagePath ? getImageUrl(product.imagePath) : "/logo.png";
  
  return {
    title: `${product.title} | ${category?.name || "Princyn Jewels"}`,
    description: `Discover the ${product.title} from our ${product.subcategory} collection.`,
    openGraph: {
      title: `${product.title} | Princyn Jewels`,
      description: `Discover the ${product.title} from our ${product.subcategory} collection.`,
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Princyn Jewels`,
      description: `Discover the ${product.title} from our ${product.subcategory} collection.`,
      images: [imageUrl],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await productRepository.bySlug(slug);
  if (!product) notFound();

  const category = await categoryRepository.byId(product.categoryId);
  if (!category) notFound();

  const productDetail = {
    ...product,
    categoryName: category.name,
    categorySlug: category.slug,
  };

  return <ProductDetailPage product={productDetail} />;
}
