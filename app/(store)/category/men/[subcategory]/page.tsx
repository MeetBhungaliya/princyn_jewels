import CategoryPageTemplate from "@/components/CategoryPageTemplate";
import Products from "@/lib/products.json";
import { Product } from "@/components/CategoryPageTemplate";
import { Metadata } from "next";

const MEN_SUBCATEGORIES = [
  { id: "studs", name: "Studs" },
  { id: "pendant", name: "Pendant" },
  { id: "ring", name: "Ring" },
  { id: "chain", name: "Chain" },
  { id: "bracelet", name: "Bracelet" },
];

export async function generateMetadata({ params }: { params: Promise<{ subcategory: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedSub = decodeURIComponent(resolvedParams.subcategory);
  const sub = MEN_SUBCATEGORIES.find(s => s.id === decodedSub);
  return {
    title: `${sub?.name || 'Jewelry'} | Men's Collection | Princyn Jewels`,
    description: `Shop our premium ${sub?.name || 'jewelry'} in the men's collection. Exquisite cufflinks, sophisticated bands, and premium bracelets.`
  };
}

export default async function MenSubcategoryPage({ params }: { params: Promise<{ subcategory: string }> }) {
  const resolvedParams = await params;
  const decodedSub = decodeURIComponent(resolvedParams.subcategory);
  const products = Products.men as Product[];

  return (
    <CategoryPageTemplate
      title="Men's Collection"
      tagline="Bold & Refined Styling"
      description="Exquisite cufflinks, sophisticated bands, and premium bracelets designed for the contemporary man."
      bannerImage="/shopByCategory/men.jpeg"
      products={products}
      subcategories={MEN_SUBCATEGORIES}
      breadcrumbLabel="Men's Collection"
      categorySlug="men"
      currentSubcategory={decodedSub}
    />
  );
}
