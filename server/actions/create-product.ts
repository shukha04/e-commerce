"use server"

import {createSafeActionClient} from "next-safe-action";
import {ProductSchema} from "@/types/product-schema";
import {db} from "@/server";
import {eq} from "drizzle-orm";
import {products} from "@/server/schema";
import {revalidatePath} from "next/cache";

export const createProduct = createSafeActionClient().schema(ProductSchema).action(async ({parsedInput: {id, description, title, price}}) => {
	try {
		if (id) {
			const currentProduct = await db.query.products.findFirst({
				where: eq(products.id, id)
			})

			if (!currentProduct) return {error: "Product not found"};
			const updatedProduct = await db.update(products).set({
				title,
				description,
				price
			}).where(eq(products.id, id)).returning();
			revalidatePath("/dashboard/products")
			return {success: `Product ${updatedProduct[0].title} updated!`}
		} else {
			const newProduct = await db.insert(products).values({
				title,
				description,
				price
			}).returning()
			revalidatePath("/dashboard/products")
			return {success: `Product ${newProduct[0].title} created!`};
		}
	} catch (error) {
		return {error: JSON.stringify(error)}
	}
})