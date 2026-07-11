import CategoryPageTemplate from "@/components/CategoryPageTemplate";
import Products from "@/lib/products.json";
import { Product } from "@/components/CategoryPageTemplate";
import { Metadata } from "next";

const KIDS_SUBCATEGORIES = [
  { id: "stud", name: "Stud" },
  { id: "pendant", name: "Pendant" },
  { id: "ring", name: "Ring" },
  { id: "chain", name: "Chain" },
  { id: "bracelet", name: "Bracelet" },
  { id: "kadli", name: "Kadli" },
  { id: "poncha", name: "Poncha" },
  { id: "payal (anklet)", name: "Payal (Anklet)" },
  { id: "nazariya", name: "Nazariya" },
  { id: "payal", name: "Payal" },
  { id: "kandora", name: "Kandora" },
];

export async function generateMetadata({ params }: { params: Promise<{ subcategory: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedSub = decodeURIComponent(resolvedParams.subcategory);
  const sub = KIDS_SUBCATEGORIES.find(s => s.id === decodedSub);
  return {
    title: `${sub?.name || 'Jewelry'} | Kids Collection | Princyn Jewels`,
    description: `Shop our premium ${sub?.name || 'jewelry'} in the kids collection. Safe, delicate, and beautifully designed.`
  };
}

export default async function KidsSubcategoryPage({ params }: { params: Promise<{ subcategory: string }> }) {
  const resolvedParams = await params;
  const decodedSub = decodeURIComponent(resolvedParams.subcategory);
  const products = Products.kids as Product[];

  return (
    <CategoryPageTemplate
      title="Kids Collection"
      tagline="Precious Moments"
      description="Celebrate milestones with delicate, safe, and beautifully designed jewelry for your little ones."
      bannerImage="/shopByCategory/kids.jpeg"
      products={products}
      subcategories={KIDS_SUBCATEGORIES}
      breadcrumbLabel="Kids Collection"
      categorySlug="kids"
      currentSubcategory={decodedSub}
    />
  );
}
