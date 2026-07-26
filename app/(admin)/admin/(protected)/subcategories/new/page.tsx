import type { Metadata } from "next";
import { ContentEditor } from "@/components/admin/content-editor";
import { categoryRepository } from "@/lib/repositories/content";

export const metadata: Metadata = {
  title: "Add Subcategory",
};

export default async function NewSubcategoryPage() {
  const categories = await categoryRepository.all();
  return <ContentEditor section="subcategory" categories={categories.map(({ id, name }) => ({ id, name }))} redirectTo="/admin/subcategories" />;
}
