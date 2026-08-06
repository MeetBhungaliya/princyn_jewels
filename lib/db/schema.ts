import { boolean, integer, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

// Better Auth's standard Drizzle schema. Keeping it here lets the auth adapter
// and application tables share one migration history.
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  imagePath: text("image_path").notNull(),
  order: integer("display_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  ...timestamps,
});

export const subcategories = pgTable("subcategories", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  order: integer("display_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  ...timestamps,
}, (table) => [uniqueIndex("subcategories_category_slug_unique").on(table.categoryId, table.slug)]);

export const banners = pgTable("banners", {
  id: uuid("id").defaultRandom().primaryKey(),
  desktopImage: text("desktop_image").notNull(),
  mobileImage: text("mobile_image").notNull(),
  title: text("title"),
  order: integer("display_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  ...timestamps,
}, (table) => [uniqueIndex("banners_desktop_image_unique").on(table.desktopImage)]);

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
  subcategoryId: uuid("subcategory_id").references(() => subcategories.id, { onDelete: "set null" }),
  subcategory: text("subcategory").notNull(),
  subcategorySlug: text("subcategory_slug").notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  imagePath: text("image_path").notNull(),
  size: text("size"),
  metalType: text("metal_type"),
  karat: text("karat"),
  color: text("color"),
  netWeight: text("net_weight"),
  diamondWeight: text("diamond_weight"),
  grossWeight: text("gross_weight"),
  order: integer("display_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  ...timestamps,
});

export const rateLimits = pgTable("rate_limits", {
  ip: text("ip").primaryKey(),
  count: integer("count").notNull().default(1),
  resetAt: timestamp("reset_at", { withTimezone: true }).notNull(),
});
