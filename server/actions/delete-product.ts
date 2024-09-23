"use server";

import {createSafeActionClient} from "next-safe-action";
import * as z from "zod";
import {db} from "@/server";
import {products} from "@/server/schema";
import {eq} from "drizzle-orm";
import {revalidatePath} from "next/cache";

export const deleteProduct = createSafeActionClient().schema(z.object({id: z.number()})).action(async ({parsedInput: {id}}) => {
	try {
		const data = await db.delete(products).where(eq(products.id, id)).returning();

		revalidatePath("/dashboard/products");
		return {success: `Product ${data[0].title} deleted successfully.`};
	} catch (error) {
		return {error: "Failed to delete products."}
	}
})