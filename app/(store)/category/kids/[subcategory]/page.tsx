import { CategoryRoute } from "@/components/store/CategoryRoute";
export default async function Page({ params }: { params: Promise<{ subcategory: string }> }) { const { subcategory } = await params; return <CategoryRoute categorySlug="kids" subcategorySlug={subcategory} />; }
