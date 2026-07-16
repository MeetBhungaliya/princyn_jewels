import { ContentList } from "@/components/admin/content-list";
import { productRepository } from "@/lib/repositories/content";

export default async function ProductsPage() {
  const items = await productRepository.all();
  const rows = items.map(({ product, category }) => ({ ...product, link: product.link ?? "", categoryName: category.name }));

  return (
    <ContentList
      section="product"
      title="Products"
      description="List the storefront products with just the essentials: title, image, and destination link."
      addHref="/admin/products/new"
      rows={rows}
      emptyTitle="No products yet"
      emptyDescription="Create the first product and it will appear in the matching storefront category."
    />
  );
}
