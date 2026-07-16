import { notFound } from "next/navigation";
import CategoryPageTemplate, { type Product } from "@/components/CategoryPageTemplate";
import { categoryRepository, productRepository, subcategoryRepository } from "@/lib/repositories/content";

export async function CategoryRoute({ categorySlug, subcategorySlug }: { categorySlug: string; subcategorySlug?: string }) {
  const category = await categoryRepository.bySlug(categorySlug);
  if (!category) notFound();
  const [products, subcategories] = await Promise.all([productRepository.forCategory(category.id, subcategorySlug), subcategoryRepository.forCategory(category.id)]);
  if (subcategorySlug && !subcategories.some((subcategory) => subcategory.slug === subcategorySlug)) notFound();
  const selected = subcategorySlug ? subcategories.find((subcategory) => subcategory.slug === subcategorySlug)?.name : undefined;
  return <CategoryPageTemplate title={category.name} tagline={category.tagline} description={category.description} bannerImage={category.imagePath} products={products as Product[]} subcategories={subcategories.map((subcategory) => ({ id: subcategory.slug, name: subcategory.name }))} breadcrumbLabel={category.name} categorySlug={category.slug} currentSubcategory={selected} />;
}
