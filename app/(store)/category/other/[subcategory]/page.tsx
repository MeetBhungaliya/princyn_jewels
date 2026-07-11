import CategoryPageTemplate from "@/components/CategoryPageTemplate";
import Products from "@/lib/products.json";
import { Product } from "@/components/CategoryPageTemplate";
import { Metadata } from "next";

const OTHER_SUBCATEGORIES = [
  { id: "watch", name: "Watch" },
  { id: "keyring", name: "Keyring" },
  { id: "storage", name: "Storage" },
  { id: "gift box", name: "Gift Box" },
  { id: "accessories", name: "Accessories" },
];

export async function generateMetadata({ params }: { params: Promise<{ subcategory: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedSub = decodeURIComponent(resolvedParams.subcategory);
  const sub = OTHER_SUBCATEGORIES.find(s => s.id === decodedSub);
  return {
    title: `${sub?.name || 'Accessories'} | Curated Accessories | Princyn Jewels`,
    description: `Shop our premium ${sub?.name || 'accessories'} in the curated accessories collection. Explore luxury timepieces and premium storage.`
  };
}

export default async function OtherSubcategoryPage({ params }: { params: Promise<{ subcategory: string }> }) {
  const resolvedParams = await params;
  const decodedSub = decodeURIComponent(resolvedParams.subcategory);
  const products = Products.other as Product[];

  return (
    <CategoryPageTemplate
      title="Curated Accessories"
      tagline="Sophisticated Additions"
      description="Explore luxury timepieces, premium storage, and key accessories curated to perfection."
      bannerImage="/shopByCategory/other.jpeg"
      products={products}
      subcategories={OTHER_SUBCATEGORIES}
      breadcrumbLabel="Curated Accessories"
      categorySlug="other"
      currentSubcategory={decodedSub}
    />
  );
}
