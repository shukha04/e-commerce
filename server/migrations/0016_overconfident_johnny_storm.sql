ALTER TABLE "orderProducts" RENAME TO "orderProduct";--> statement-breakpoint
ALTER TABLE "orderProduct" DROP CONSTRAINT "orderProducts_productVariantID_productVariants_id_fk";
--> statement-breakpoint
ALTER TABLE "orderProduct" DROP CONSTRAINT "orderProducts_productId_products_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderProduct" ADD CONSTRAINT "orderProduct_productVariantID_productVariants_id_fk" FOREIGN KEY ("productVariantID") REFERENCES "public"."productVariants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderProduct" ADD CONSTRAINT "orderProduct_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
