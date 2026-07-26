ALTER TABLE "banners" DROP COLUMN IF EXISTS "link";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN IF EXISTS "link";--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "size" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "metal_type" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "karat" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "color" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "net_weight" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "diamond_weight" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "gross_weight" text;
