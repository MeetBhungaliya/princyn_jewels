import { ContentList } from "@/components/admin/content-list";
import { categoryRepository, subcategoryRepository } from "@/lib/repositories/content";

export default async function SubcategoriesPage() {
  const [items, categories] = await Promise.all([subcategoryRepository.all(), categoryRepository.all()]);
  const names = new Map(categories.map((category) => [category.id, category.name]));
  return <ContentList section="subcategory" title="Subcategories" description="Manage subcategories" addHref="/admin/subcategories/new" rows={items.map((item) => ({ ...item, categoryName: names.get(item.categoryId) ?? "Unknown" }))} emptyTitle="No subcategories yet" emptyDescription="Add a subcategory before creating products." />;
}
