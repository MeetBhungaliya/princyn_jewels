import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentEditor } from "@/components/admin/content-editor";
import { categoryRepository, subcategoryRepository } from "@/lib/repositories/content";

export const metadata: Metadata = {
  title: "Edit Subcategory",
};

export default async function EditSubcategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [initial, categories] = await Promise.all([subcategoryRepository.byId(id), categoryRepository.all()]);
  if (!initial) notFound();
  return <ContentEditor section="subcategory" initial={initial} categories={categories.map(({ id: categoryId, name }) => ({ id: categoryId, name }))} redirectTo="/admin/subcategories" />;
}
