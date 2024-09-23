"use server";

import {createSafeActionClient} from "next-safe-action";
import {VariantSchema} from "@/types/variant-schema";
import {db} from "@/server";
import {products, productVariants, variantImages, variantTags} from "@/server/schema";
import {eq} from "drizzle-orm";
import {revalidatePath} from "next/cache";
import algoliaSearch from "algoliasearch";

const client = algoliaSearch(process.env.NEXT_PUBLIC_ALGOLIA_ID!, process.env.ALGOLIA_ADMIN!);

const algoliaIndex = client.initIndex("products");

export const createVariant = createSafeActionClient().schema(VariantSchema).action(async ({parsedInput: {color,variantImages: newImages,id,editMode,productID,productType,tags}}) => {
	try {
		if (editMode && id) {
			const editVariant = await db
				.update(productVariants)
				.set({color, productType, updated: new Date()})
				.where(eq(productVariants.id, id))
				.returning()

			await db.delete(variantTags).where(eq(variantTags.variantID, editVariant[0].id))
			await db.insert(variantTags).values(tags.map((tag) => ({
				tag,
				variantID: editVariant[0].id
			})))
			await db.delete(variantImages).where(eq(variantImages.variantID, editVariant[0].id))
			await db.insert(variantImages).values(newImages.map((img, i) => ({
				name: img.name,
				size: img.size,
				url: img.url,
				variantID: editVariant[0].id,
				order: i
			})))

			algoliaIndex.partialUpdateObject({
				objectID: editVariant[0].id,
				productID: editVariant[0].productID,
				productType: editVariant[0].productType,
				variantImages: newImages[0].url
			})

			revalidatePath("/dashboard/products")
			return {success: `Edited ${productType}`}
		}
		if (!editMode) {
			const newVariant = await db.insert(productVariants).values({
				color,
				productType,
				productID
			}).returning()
			console.log(newVariant)
			await db.insert(variantTags).values(tags.map((tag) => ({
				tag,
				variantID: newVariant[0].id
			})))
			const product = await db.query.products.findFirst({
				where: eq(products.id, productID)
			})
			await db.insert(variantImages).values(newImages.map((img, i) => ({
				name: img.name,
				size: img.size,
				url: img.url,
				variantID: newVariant[0].id,
				order: i
			})))

			if (product) {
				algoliaIndex.saveObject({
					objectID: newVariant[0].id,
					productID: newVariant[0].productID,
					title: product.title,
					price: product.price,
					productType: newVariant[0].productType,
					variantImages: newImages[0].url
				})
			}

			revalidatePath("/dashboard/products")
			return {success: `Created ${productType}`}
		}
	} catch (error) {
		return {error: "Failed to create a variant"}
	}
});