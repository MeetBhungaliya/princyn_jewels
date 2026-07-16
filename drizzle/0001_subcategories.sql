CREATE TABLE IF NOT EXISTS "subcategories" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "category_id" uuid NOT NULL REFERENCES "categories"("id") ON DELETE cascade,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "display_order" integer DEFAULT 0 NOT NULL,
  "active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "subcategory_id" uuid REFERENCES "subcategories"("id") ON DELETE set null;
--> statement-breakpoint
DELETE FROM "banners" a USING "banners" b
WHERE a."desktop_image" = b."desktop_image" AND a."created_at" > b."created_at";
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "banners_desktop_image_unique" ON "banners" ("desktop_image");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "subcategories_category_slug_unique" ON "subcategories" ("category_id", "slug");
