import { and, asc, eq } from "drizzle-orm";
import { db, ensureDatabase } from "@/lib/db";
import { banners, categories, products, subcategories } from "@/lib/db/schema";
import type { BannerInput, CategoryInput, ProductInput, SubcategoryInput } from "@/lib/validators/content";

const ready = ensureDatabase;
export const bannerRepository = {
  async all() { await ready(); return db.select().from(banners).orderBy(asc(banners.order), asc(banners.createdAt)); },
  async byId(id: string) { await ready(); return (await db.select().from(banners).where(eq(banners.id, id)))[0]; },
  async active() { await ready(); return db.select().from(banners).where(eq(banners.active, true)).orderBy(asc(banners.order)); },
  async create(data: BannerInput) { await ready(); return (await db.insert(banners).values(data).returning())[0]; },
  async update(id: string, data: BannerInput) { await ready(); return (await db.update(banners).set({ ...data, updatedAt: new Date() }).where(eq(banners.id, id)).returning())[0]; },
  async remove(id: string) { await ready(); return (await db.delete(banners).where(eq(banners.id, id)).returning())[0]; },
};
export const categoryRepository = {
  async all() { await ready(); return db.select().from(categories).orderBy(asc(categories.order)); },
  async byId(id: string) { await ready(); return (await db.select().from(categories).where(eq(categories.id, id)))[0]; },
  async active() { await ready(); return db.select().from(categories).where(eq(categories.active, true)).orderBy(asc(categories.order)); },
  async bySlug(slug: string) { await ready(); return (await db.select().from(categories).where(and(eq(categories.slug, slug), eq(categories.active, true))))[0]; },
  async create(data: CategoryInput) { await ready(); return (await db.insert(categories).values(data).returning())[0]; },
  async update(id: string, data: CategoryInput) { await ready(); return (await db.update(categories).set({ ...data, updatedAt: new Date() }).where(eq(categories.id, id)).returning())[0]; },
  async remove(id: string) { await ready(); return (await db.delete(categories).where(eq(categories.id, id)).returning())[0]; },
};
export const subcategoryRepository = {
  async all() { await ready(); return db.select().from(subcategories).orderBy(asc(subcategories.order), asc(subcategories.name)); },
  async byId(id: string) { await ready(); return (await db.select().from(subcategories).where(eq(subcategories.id, id)))[0]; },
  async forCategory(categoryId: string) { await ready(); return db.select().from(subcategories).where(and(eq(subcategories.categoryId, categoryId), eq(subcategories.active, true))).orderBy(asc(subcategories.order), asc(subcategories.name)); },
  async create(data: SubcategoryInput) { await ready(); return (await db.insert(subcategories).values(data).returning())[0]; },
  async update(id: string, data: SubcategoryInput) { 
    await ready(); 
    const updatedSubcategory = (await db.update(subcategories).set({ ...data, updatedAt: new Date() }).where(eq(subcategories.id, id)).returning())[0]; 
    if (updatedSubcategory) {
      await db.update(products).set({
        subcategory: updatedSubcategory.name,
        subcategorySlug: updatedSubcategory.slug,
        updatedAt: new Date(),
      }).where(eq(products.subcategoryId, id));
    }
    return updatedSubcategory;
  },
  async remove(id: string) { await ready(); return (await db.delete(subcategories).where(eq(subcategories.id, id)).returning())[0]; },
};
export const productRepository = {
  async all() { await ready(); return db.select({ product: products, category: categories }).from(products).innerJoin(categories, eq(products.categoryId, categories.id)).orderBy(asc(categories.order), asc(products.order)); },
  async byId(id: string) { await ready(); return (await db.select().from(products).where(eq(products.id, id)))[0]; },
  async bySlug(slug: string) { await ready(); return (await db.select().from(products).where(and(eq(products.slug, slug), eq(products.active, true))))[0]; },
  async forCategory(categoryId: string, subcategory?: string) { await ready(); const filter = subcategory ? and(eq(products.categoryId, categoryId), eq(products.subcategorySlug, subcategory), eq(products.active, true)) : and(eq(products.categoryId, categoryId), eq(products.active, true)); return db.select().from(products).where(filter).orderBy(asc(products.order)); },
  async subcategories(categoryId: string) { await ready(); return db.selectDistinct({ name: products.subcategory, slug: products.subcategorySlug }).from(products).where(and(eq(products.categoryId, categoryId), eq(products.active, true))).orderBy(asc(products.subcategory)); },
  async create(data: ProductInput) { await ready(); return (await db.insert(products).values(data).returning())[0]; },
  async update(id: string, data: ProductInput) { await ready(); return (await db.update(products).set({ ...data, updatedAt: new Date() }).where(eq(products.id, id)).returning())[0]; },
  async remove(id: string) { await ready(); return (await db.delete(products).where(eq(products.id, id)).returning())[0]; },
};
