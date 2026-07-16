import { ContentEditor } from "@/components/admin/content-editor";
import { categoryRepository, subcategoryRepository } from "@/lib/repositories/content";

export default async function NewProductPage() {
  const [categories, subcategories] = await Promise.all([categoryRepository.all(), subcategoryRepository.all()]);
  return <ContentEditor section="product" categories={categories.map(({ id, name }) => ({ id, name }))} subcategories={subcategories.map(({ id, categoryId, name, slug }) => ({ id, categoryId, name, slug }))} redirectTo="/admin/products" />;
}
