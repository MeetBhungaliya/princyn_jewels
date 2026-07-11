import CategoryPageTemplate from "@/components/CategoryPageTemplate";
import Products from "@/lib/products.json";
import { Product } from "@/components/CategoryPageTemplate";
import { Metadata } from "next";

const WOMEN_SUBCATEGORIES = [
  { id: "necklace", name: "Necklace" },
  { id: "earring", name: "Earring" },
  { id: "pendant", name: "Pendant" },
  { id: "ring", name: "Ring" },
  { id: "chain", name: "Chain" },
  { id: "bracelet", name: "Bracelet" },
  { id: "nosepin", name: "Nosepin" },
  { id: "tulsi mala", name: "Tulsi Mala" },
  { id: "bangle", name: "Bangle" },
  { id: "bridal payal", name: "Bridal Payal" },
  { id: "anklet", name: "Anklet" },
  { id: "toe ring", name: "Toe Ring" },
  { id: "kandora", name: "Kandora" },
  { id: "juda", name: "Juda" },
  { id: "mangalsutra", name: "Mangalsutra" },
  { id: "normal mangalsutra", name: "Normal Mangalsutra" },
  { id: "shrimant rakhi", name: "Shrimant Rakhi" },
];

export async function generateMetadata({ params }: { params: Promise<{ subcategory: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedSub = decodeURIComponent(resolvedParams.subcategory);
  const sub = WOMEN_SUBCATEGORIES.find(s => s.id === decodedSub);
  return {
    title: `${sub?.name || 'Jewelry'} | Women's Collection | Princyn Jewels`,
    description: `Shop our premium ${sub?.name || 'jewelry'} in the women's collection. Discover breathtaking rings, necklaces, and earrings.`
  };
}

export default async function WomenSubcategoryPage({ params }: { params: Promise<{ subcategory: string }> }) {
  const resolvedParams = await params;
  const decodedSub = decodeURIComponent(resolvedParams.subcategory);
  const products = Products.women as Product[];

  return (
    <CategoryPageTemplate
      title="Women's Collection"
      tagline="Eternal Elegance"
      description="Discover breathtaking rings, necklaces, and earrings made to highlight your natural brilliance."
      bannerImage="/shopByCategory/women.jpeg"
      products={products}
      subcategories={WOMEN_SUBCATEGORIES}
      breadcrumbLabel="Women's Collection"
      categorySlug="women"
      currentSubcategory={decodedSub}
    />
  );
}
