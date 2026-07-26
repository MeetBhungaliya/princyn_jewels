import type { Metadata } from "next";
import { ContentList } from "@/components/admin/content-list";
import { productRepository } from "@/lib/repositories/content";

export const metadata: Metadata = {
  title: "Products",
};

export default async function ProductsPage() {
  const items = await productRepository.all();
  const rows = items.map(({ product, category }) => ({ ...product, categoryName: category.name }));

  return (
    <ContentList
      section="product"
      title="Products"
      description="List the storefront products with title, image, and detailed specifications."
      addHref="/admin/products/new"
      rows={rows}
      emptyTitle="No products yet"
      emptyDescription="Create the first product and it will appear in the matching storefront category."
    />
  );
}
