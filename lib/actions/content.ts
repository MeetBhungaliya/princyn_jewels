"use server";
import { revalidatePath } from "next/cache";
import path from "node:path";
import { requireAdmin } from "@/lib/auth/auth";
import { bannerRepository, categoryRepository, productRepository, subcategoryRepository } from "@/lib/repositories/content";
import { bannerSchema, categorySchema, productSchema, subcategorySchema } from "@/lib/validators/content";
import { deleteLocalImage } from "@/lib/uploads/images";
import { backupDatabase } from "@/lib/db/backup";

type Result = { ok: true } | { ok: false; error: string };

const result = async (fn: () => Promise<void>): Promise<Result> => {
  try {
    await requireAdmin();
    await fn();
    const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), "var", "www", "storage", "database");
    backupDatabase(dbPath).catch((err) => console.error("Backup failed after write:", err));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unable to save." };
  }
};

const refresh = () => {
  revalidatePath("/");
  revalidatePath("/category/[category]", "page");
  revalidatePath("/category/[category]/[subcategory]", "page");
};

export async function saveBanner(id: string | null, raw: unknown): Promise<Result> {
  return result(async () => {
    const data = bannerSchema.parse(raw);
    if (id) {
      const old = await bannerRepository.byId(id);
      await bannerRepository.update(id, data);
      if (old) {
        if (old.desktopImage !== data.desktopImage) await deleteLocalImage(old.desktopImage);
        if (old.mobileImage !== data.mobileImage) await deleteLocalImage(old.mobileImage);
      }
    } else {
      await bannerRepository.create(data);
    }
    refresh();
    revalidatePath("/admin/banner");
  });
}

export async function deleteBanner(id: string): Promise<Result> {
  return result(async () => {
    const item = await bannerRepository.remove(id);
    await deleteLocalImage(item?.desktopImage);
    await deleteLocalImage(item?.mobileImage);
    refresh();
    revalidatePath("/admin/banner");
  });
}

export async function saveCategory(id: string | null, raw: unknown): Promise<Result> {
  return result(async () => {
    const parsed = categorySchema.parse(raw);
    const normalizedName = parsed.name.toLowerCase().trim();

    // Duplicate prevention
    const allCategories = await categoryRepository.all();
    const isDuplicate = allCategories.some(
      (c) => c.name.toLowerCase().trim() === normalizedName && c.id !== id
    );
    if (isDuplicate) {
      throw new Error("A category with this name already exists.");
    }

    const data = { ...parsed, name: normalizedName };

    if (id) {
      const old = await categoryRepository.byId(id);
      await categoryRepository.update(id, data);
      if (old && old.imagePath !== data.imagePath) {
        await deleteLocalImage(old.imagePath);
      }
    } else {
      await categoryRepository.create(data);
    }
    refresh();
    revalidatePath("/admin/categories");
  });
}

export async function deleteCategory(id: string): Promise<Result> {
  return result(async () => {
    const item = await categoryRepository.remove(id);
    await deleteLocalImage(item?.imagePath);
    refresh();
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
  });
}

export async function saveSubcategory(id: string | null, raw: unknown): Promise<Result> {
  return result(async () => {
    const parsed = subcategorySchema.parse(raw);
    const normalizedName = parsed.name.toLowerCase().trim();

    // Duplicate prevention inside same category
    const allSubcategories = await subcategoryRepository.all();
    const isDuplicate = allSubcategories.some(
      (s) =>
        s.categoryId === parsed.categoryId &&
        s.name.toLowerCase().trim() === normalizedName &&
        s.id !== id
    );
    if (isDuplicate) {
      throw new Error("A subcategory with this name already exists in this category.");
    }

    const data = { ...parsed, name: normalizedName };

    if (id) {
      await subcategoryRepository.update(id, data);
    } else {
      await subcategoryRepository.create(data);
    }
    refresh();
    revalidatePath("/admin/subcategories");
    revalidatePath("/admin/products");
  });
}

export async function deleteSubcategory(id: string): Promise<Result> {
  return result(async () => {
    await subcategoryRepository.remove(id);
    refresh();
    revalidatePath("/admin/subcategories");
    revalidatePath("/admin/products");
  });
}

export async function saveProduct(id: string | null, raw: unknown): Promise<Result> {
  return result(async () => {
    const data = productSchema.parse(raw);
    const subcategory = data.subcategoryId ? await subcategoryRepository.byId(data.subcategoryId) : undefined;
    if (!subcategory || subcategory.categoryId !== data.categoryId) {
      throw new Error("Choose a subcategory that belongs to the selected category.");
    }
    const resolved = { ...data, subcategory: subcategory.name, subcategorySlug: subcategory.slug };
    if (id) {
      const old = await productRepository.byId(id);
      await productRepository.update(id, resolved);
      if (old && old.imagePath !== data.imagePath) {
        await deleteLocalImage(old.imagePath);
      }
    } else {
      await productRepository.create(resolved);
    }
    refresh();
    revalidatePath("/admin/products");
  });
}

export async function deleteProduct(id: string): Promise<Result> {
  return result(async () => {
    const item = await productRepository.remove(id);
    await deleteLocalImage(item?.imagePath);
    refresh();
    revalidatePath("/admin/products");
  });
}

export async function toggleBannerStatus(id: string, active: boolean): Promise<Result> {
  return result(async () => {
    const item = await bannerRepository.byId(id);
    if (!item) throw new Error("Item not found");
    await bannerRepository.update(id, {
      desktopImage: item.desktopImage,
      mobileImage: item.mobileImage,
      title: item.title ?? "",
      link: item.link ?? "",
      order: item.order,
      active
    });
    refresh();
    revalidatePath("/admin/banner");
  });
}

export async function toggleCategoryStatus(id: string, active: boolean): Promise<Result> {
  return result(async () => {
    const item = await categoryRepository.byId(id);
    if (!item) throw new Error("Item not found");
    await categoryRepository.update(id, {
      slug: item.slug,
      name: item.name,
      tagline: item.tagline,
      description: item.description,
      imagePath: item.imagePath,
      order: item.order,
      active
    });
    refresh();
    revalidatePath("/admin/categories");
  });
}

export async function toggleSubcategoryStatus(id: string, active: boolean): Promise<Result> {
  return result(async () => {
    const item = await subcategoryRepository.byId(id);
    if (!item) throw new Error("Item not found");
    await subcategoryRepository.update(id, {
      categoryId: item.categoryId,
      name: item.name,
      slug: item.slug,
      order: item.order,
      active
    });
    refresh();
    revalidatePath("/admin/subcategories");
    revalidatePath("/admin/products");
  });
}

export async function toggleProductStatus(id: string, active: boolean): Promise<Result> {
  return result(async () => {
    const item = await productRepository.byId(id);
    if (!item) throw new Error("Item not found");
    await productRepository.update(id, {
      categoryId: item.categoryId,
      subcategoryId: item.subcategoryId,
      subcategory: item.subcategory,
      subcategorySlug: item.subcategorySlug,
      title: item.title,
      slug: item.slug,
      imagePath: item.imagePath,
      link: item.link ?? "",
      order: item.order,
      active
    });
    refresh();
    revalidatePath("/admin/products");
  });
}
