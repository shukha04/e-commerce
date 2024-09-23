"use server";

import * as z from "zod";
import {createSafeActionClient} from "next-safe-action";
import {db} from "@/server";
import {productVariants} from "@/server/schema";
import {eq} from "drizzle-orm";
import {revalidatePath} from "next/cache";
import algoliaSearch from "algoliasearch";

const client = algoliaSearch(process.env.NEXT_PUBLIC_ALGOLIA_ID!, process.env.ALGOLIA_ADMIN!);

const algoliaIndex = client.initIndex("products");

export const deleteVariant = createSafeActionClient().schema(z.object({id: z.number()})).action(async ({parsedInput: {id}}) => {
	try {
		const deletedVariant = await db.delete(productVariants).where(eq(productVariants.id, id)).returning();
		revalidatePath("/dashboard/products");
		algoliaIndex.deleteObject(deletedVariant[0].id.toString())
		return {success: `${deletedVariant[0].productType} deleted successfully.`};
	} catch (error) {
		return {error: "Failed to delete variant"}
	}
})