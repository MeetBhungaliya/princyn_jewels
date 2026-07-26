import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentEditor } from "@/components/admin/content-editor";
import { categoryRepository, productRepository, subcategoryRepository } from "@/lib/repositories/content";

export const metadata: Metadata = {
  title: "Edit Product",
};

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [initial, categories, subcategories] = await Promise.all([productRepository.byId(id), categoryRepository.all(), subcategoryRepository.all()]);
  if (!initial) notFound();
  return <ContentEditor section="product" initial={initial} categories={categories.map(({ id, name }) => ({ id, name }))} subcategories={subcategories.map(({ id: subcategoryId, categoryId, name, slug }) => ({ id: subcategoryId, categoryId, name, slug }))} redirectTo="/admin/products" />;
}
