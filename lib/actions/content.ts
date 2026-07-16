"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/auth";
import { bannerRepository, categoryRepository, productRepository, subcategoryRepository } from "@/lib/repositories/content";
import { bannerSchema, categorySchema, productSchema, subcategorySchema } from "@/lib/validators/content";
import { deleteLocalImage } from "@/lib/uploads/images";

type Result = { ok: true } | { ok: false; error: string };
const result = async (fn: () => Promise<void>): Promise<Result> => { try { await requireAdmin(); await fn(); return { ok: true }; } catch (e) { return { ok: false, error: e instanceof Error ? e.message : "Unable to save." }; } };
const refresh = () => { revalidatePath("/"); revalidatePath("/category/[category]", "page"); revalidatePath("/category/[category]/[subcategory]", "page"); };

export async function saveBanner(id: string | null, raw: unknown): Promise<Result> { return result(async () => { const data = bannerSchema.parse(raw); if (id) await bannerRepository.update(id, data); else await bannerRepository.create(data); refresh(); revalidatePath("/admin/banner"); }); }
export async function deleteBanner(id: string): Promise<Result> { return result(async () => { const item = await bannerRepository.remove(id); await deleteLocalImage(item?.desktopImage); await deleteLocalImage(item?.mobileImage); refresh(); revalidatePath("/admin/banner"); }); }
export async function saveCategory(id: string | null, raw: unknown): Promise<Result> { return result(async () => { const data = categorySchema.parse(raw); if (id) await categoryRepository.update(id, data); else await categoryRepository.create(data); refresh(); revalidatePath("/admin/categories"); }); }
export async function deleteCategory(id: string): Promise<Result> { return result(async () => { const item = await categoryRepository.remove(id); await deleteLocalImage(item?.imagePath); refresh(); revalidatePath("/admin/categories"); revalidatePath("/admin/products"); }); }
export async function saveSubcategory(id: string | null, raw: unknown): Promise<Result> { return result(async () => { const data = subcategorySchema.parse(raw); if (id) await subcategoryRepository.update(id, data); else await subcategoryRepository.create(data); refresh(); revalidatePath("/admin/subcategories"); revalidatePath("/admin/products"); }); }
export async function deleteSubcategory(id: string): Promise<Result> { return result(async () => { await subcategoryRepository.remove(id); refresh(); revalidatePath("/admin/subcategories"); revalidatePath("/admin/products"); }); }
export async function saveProduct(id: string | null, raw: unknown): Promise<Result> { return result(async () => {
  const data = productSchema.parse(raw);
  const subcategory = data.subcategoryId ? await subcategoryRepository.byId(data.subcategoryId) : undefined;
  if (!subcategory || subcategory.categoryId !== data.categoryId) throw new Error("Choose a subcategory that belongs to the selected category.");
  const resolved = { ...data, subcategory: subcategory.name, subcategorySlug: subcategory.slug };
  if (id) await productRepository.update(id, resolved); else await productRepository.create(resolved);
  refresh(); revalidatePath("/admin/products");
}); }
export async function deleteProduct(id: string): Promise<Result> { return result(async () => { const item = await productRepository.remove(id); await deleteLocalImage(item?.imagePath); refresh(); revalidatePath("/admin/products"); }); }
