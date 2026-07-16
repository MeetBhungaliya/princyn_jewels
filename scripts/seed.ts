import { loadEnvConfig } from "@next/env";
import fixture from "../lib/products.json";
import { eq } from "drizzle-orm";
import { auth } from "../lib/auth/auth";
import { db, ensureDatabase } from "../lib/db";
import { banners, categories, products, subcategories, user } from "../lib/db/schema";

loadEnvConfig(process.cwd());

const categorySeed = [
  { slug: "men", name: "Men", tagline: "Bold & Refined", description: "Exquisite cufflinks, sophisticated bands, and premium bracelets designed for the contemporary man.", imagePath: "/shopByCategory/men.jpeg", order: 1 },
  { slug: "women", name: "Women", tagline: "Eternal Elegance", description: "Discover breathtaking rings, necklaces, and earrings made to highlight your natural brilliance.", imagePath: "/shopByCategory/women.jpeg", order: 2 },
  { slug: "kids", name: "Kids", tagline: "Precious Moments", description: "Celebrate milestones with delicate, safe, and beautifully designed jewelry for your little ones.", imagePath: "/shopByCategory/kids.jpeg", order: 3 },
  { slug: "other", name: "Other", tagline: "Curated Accessories", description: "Explore luxury timepieces, premium storage, and key accessories curated to perfection.", imagePath: "/shopByCategory/other.jpeg", order: 4 },
];
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function seed() {
  await ensureDatabase();
  for (const item of categorySeed) await db.insert(categories).values({ ...item, active: true }).onConflictDoUpdate({ target: categories.slug, set: { ...item, active: true, updatedAt: new Date() } });
  const categoryRows = await db.select().from(categories);
  const bySlug = new Map(categoryRows.map((category) => [category.slug, category]));
  for (const [categorySlug, productRows] of Object.entries(fixture)) {
    const category = bySlug.get(categorySlug); if (!category) continue;
    const uniqueSubcategories = [...new Set(productRows.map((item) => item.subcategory))];
    for (let index = 0; index < uniqueSubcategories.length; index++) {
      const name = uniqueSubcategories[index];
      await db.insert(subcategories).values({ categoryId: category.id, name, slug: slugify(name), order: index + 1, active: true }).onConflictDoUpdate({ target: [subcategories.categoryId, subcategories.slug], set: { name, order: index + 1, active: true, updatedAt: new Date() } });
    }
    const categorySubcategories = await db.select().from(subcategories).where(eq(subcategories.categoryId, category.id));
    const subcategoryBySlug = new Map(categorySubcategories.map((subcategory) => [subcategory.slug, subcategory]));
    for (let index = 0; index < productRows.length; index++) {
      const item = productRows[index]; const title = item.name;
      const subcategory = subcategoryBySlug.get(slugify(item.subcategory));
      await db.insert(products).values({ categoryId: category.id, subcategoryId: subcategory?.id ?? null, subcategory: item.subcategory, subcategorySlug: slugify(item.subcategory), title, slug: `${categorySlug}-${item.id}-${slugify(title)}`, imagePath: item.image, order: index + 1, active: true }).onConflictDoUpdate({ target: products.slug, set: { categoryId: category.id, subcategoryId: subcategory?.id ?? null, subcategory: item.subcategory, subcategorySlug: slugify(item.subcategory), title, imagePath: item.image, order: index + 1, active: true, updatedAt: new Date() } });
    }
  }
  const bannerSeed = [
    { desktopImage: "/carousel/1.jpeg", mobileImage: "/carousel/1M.jpeg", title: "Jewelry promotion slide one", order: 1 },
    { desktopImage: "/carousel/2.jpeg", mobileImage: "/carousel/2M.jpeg", title: "Jewelry promotion slide two", order: 2 },
    { desktopImage: "/carousel/3.jpeg", mobileImage: "/carousel/3M.jpeg", title: "Jewelry promotion slide three", order: 3 },
  ];
  for (const item of bannerSeed) await db.insert(banners).values({ ...item, active: true }).onConflictDoUpdate({ target: banners.desktopImage, set: { ...item, active: true, updatedAt: new Date() } });
  const email = process.env.ADMIN_EMAIL; const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const existingAdmin = await db.select().from(user).where(eq(user.email, email));
    if (existingAdmin[0]) await db.delete(user).where(eq(user.email, email));
    await auth.api.signUpEmail({ body: { name: "Administrator", email, password } });
  }
  if (!email || !password) console.warn("Set ADMIN_EMAIL and ADMIN_PASSWORD, then run seed again to create the first administrator.");
  console.log("Seed complete.");
}
seed().catch((error) => { console.error(error); }).finally(() => { process.exit(); });
