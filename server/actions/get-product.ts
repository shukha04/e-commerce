"use server";

import {db} from "@/server";
import {eq} from "drizzle-orm";
import {products} from "@/server/schema";

export async function getProducts(id: number) {
	try {
		const product = await db.query.products.findFirst({
			where: eq(products.id, id)
		})
		if (!product) return {error: "Product not found"};

		return {success: product}
	} catch (error) {
		return {error: "Failed to get a products"};
	}
}