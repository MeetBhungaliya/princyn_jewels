import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryRoute } from "@/components/store/CategoryRoute";
import { categoryRepository } from "@/lib/repositories/content";
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> { const { category: slug } = await params; const category = await categoryRepository.bySlug(slug); if (!category) return {}; return { title: `${category.name} | Princyn Jewels`, description: category.description }; }
export default async function Page({ params }: { params: Promise<{ category: string }> }) { const { category } = await params; if (!category) notFound(); return <CategoryRoute categorySlug={category} />; }
