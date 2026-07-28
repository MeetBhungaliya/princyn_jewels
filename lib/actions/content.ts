"use server";
import { revalidatePath } from "next/cache";
import path from "node:path";
import { requireAdmin } from "@/lib/auth/auth";
import { bannerRepository, categoryRepository, productRepository, subcategoryRepository } from "@/lib/repositories/content";
import { bannerSchema, categorySchema, productSchema, subcategorySchema } from "@/lib/validators/content";
import { deleteLocalImage, cleanupStaleImages } from "@/lib/uploads/images";
import { backupDatabase } from "@/lib/db/backup";

type Result = { ok: true } | { ok: false; error: string };

const result = async (fn: () => Promise<void>): Promise<Result> => {
  try {
    await requireAdmin();
    await fn();
    const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), "var", "www", "storage", "database");
    backupDatabase(dbPath).catch((err) => console.error("Backup failed after write:", err));
    cleanupStaleImages(30).catch((err) => console.error("Stale cleanup background error:", err));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unable to save." };
  }
};

const refresh = () => {
  revalidatePath("/");
  revalidatePath("/category/[category]", "page");
  revalidatePath("/category/[category]/[subcategory]", "page");
  revalidatePath("/product/[slug]", "page");
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
    
    // Resolve subcategory fields
    const resolved = { ...data, subcategory: subcategory.name, subcategorySlug: subcategory.slug };
    
    // Ensure slug uniqueness
    const { db } = await import("@/lib/db");
    const { products } = await import("@/lib/db/schema");
    const { and, eq, ne } = await import("drizzle-orm");
    
    const baseSlug = resolved.slug;
    let uniqueSlug = baseSlug;
    let counter = 1;
    
    while (true) {
      const existing = await db.select().from(products).where(
        id 
          ? and(eq(products.slug, uniqueSlug), ne(products.id, id))
          : eq(products.slug, uniqueSlug)
      );
      if (existing.length === 0) {
        break;
      }
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    resolved.slug = uniqueSlug;

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
      size: item.size ?? "",
      metalType: (item.metalType as any) ?? "",
      karat: (item.karat as any) ?? "",
      color: item.color ?? "",
      netWeight: item.netWeight ?? "",
      diamondWeight: item.diamondWeight ?? "",
      grossWeight: item.grossWeight ?? "",
      order: item.order,
      active
    });
    refresh();
    revalidatePath("/admin/products");
  });
}

export async function deleteUploadedImageAction(imagePath: string): Promise<Result> {
  return result(async () => {
    if (!imagePath || !imagePath.startsWith("/uploads/")) return;

    const [allBanners, allCategories, allProducts] = await Promise.all([
      bannerRepository.all(),
      categoryRepository.all(),
      productRepository.all(),
    ]);

    const isUsedInDb =
      allBanners.some((b) => b.desktopImage === imagePath || b.mobileImage === imagePath) ||
      allCategories.some((c) => c.imagePath === imagePath) ||
      allProducts.some((p) => p.product.imagePath === imagePath);

    if (!isUsedInDb) {
      await deleteLocalImage(imagePath);
    }
  });
}

export async function cleanupStaleImagesAction(): Promise<{ ok: true; scanned: number; deleted: number; freedBytes: number } | { ok: false; error: string }> {
  try {
    await requireAdmin();
    const stats = await cleanupStaleImages(30);
    return { ok: true, ...stats };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Cleanup failed." };
  }
}
