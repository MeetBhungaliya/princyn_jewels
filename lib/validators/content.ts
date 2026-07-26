import { z } from "zod";

const optionalText = (max: number) =>
  z.string().trim().max(max).optional().default("").transform((v) => v || null);

export const bannerSchema = z.object({
  desktopImage: z.string().startsWith("/").min(1),
  mobileImage: z.string().startsWith("/").min(1),
  title: z.string().trim().max(120).optional().default(""),
  order: z.coerce.number().int().min(0),
  active: z.boolean(),
});

export const categorySchema = z.object({
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(1).max(80),
  tagline: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(500),
  imagePath: z.string().startsWith("/").min(1),
  order: z.coerce.number().int().min(0),
  active: z.boolean(),
});

export const subcategorySchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().trim().min(1).max(80),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/),
  order: z.coerce.number().int().min(0),
  active: z.boolean(),
});

export const productSchema = z.object({
  categoryId: z.string().uuid(),
  subcategoryId: z.union([z.literal(""), z.string().uuid()]).transform((value) => value || null),
  subcategory: z.string().trim().min(1).max(80),
  subcategorySlug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(1).max(160),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/),
  imagePath: z.string().startsWith("/").min(1),
  size: optionalText(50),
  metalType: z.enum(["", "gold", "silver", "platinum"]).optional().default("").transform((v) => v || null),
  karat: z.enum(["", "9", "14", "18", "22", "24"]).optional().default("").transform((v) => v || null),
  color: optionalText(50),
  netWeight: optionalText(30),
  diamondWeight: optionalText(30),
  grossWeight: optionalText(30),
  order: z.coerce.number().int().min(0),
  active: z.boolean(),
});

export type BannerInput = z.output<typeof bannerSchema>;
export type CategoryInput = z.output<typeof categorySchema>;
export type SubcategoryInput = z.output<typeof subcategorySchema>;
export type ProductInput = z.output<typeof productSchema>;
