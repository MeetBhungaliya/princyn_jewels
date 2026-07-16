import type { Metadata } from "next";
import { CategoryRoute } from "@/components/store/CategoryRoute";
import { categoryRepository } from "@/lib/repositories/content";
export async function generateMetadata({ params }: { params: Promise<{ category: string; subcategory: string }> }): Promise<Metadata> { const { category: slug, subcategory } = await params; const category = await categoryRepository.bySlug(slug); return category ? { title: `${decodeURIComponent(subcategory)} | ${category.name} | Princyn Jewels`, description: category.description } : {}; }
export default async function Page({ params }: { params: Promise<{ category: string; subcategory: string }> }) { const { category, subcategory } = await params; return <CategoryRoute categorySlug={category} subcategorySlug={subcategory} />; }
