import type { Metadata } from "next";
import { ContentList } from "@/components/admin/content-list";
import { categoryRepository } from "@/lib/repositories/content";

export const metadata: Metadata = {
  title: "Categories",
};

export default async function CategoriesPage() {
  const rows = await categoryRepository.all();

  return (
    <ContentList
      section="category"
      title="Categories"
      description="Manage the main browsing categories shown across the storefront."
      addHref="/admin/categories/new"
      rows={rows}
      emptyTitle="No categories yet"
      emptyDescription="Create a category to start shaping the storefront navigation and cards."
    />
  );
}
