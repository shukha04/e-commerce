"use server";

import {createSafeActionClient} from "next-safe-action";
import {ReviewSchema} from "@/types/reviews-schema";
import {auth} from "@/server/auth";
import {db} from "@/server";
import {and, eq} from "drizzle-orm";
import {reviews} from "@/server/schema";
import {revalidatePath} from "next/cache";

export const addReview = createSafeActionClient().schema(ReviewSchema).action(async ({parsedInput: {productID, comment, rating}}) => {
	try {
		const session = await auth();
		if (!session) return {error: "Please sign in to leave a review"}

		const reviewExists = await db.query.reviews.findFirst({
			where: and(eq(reviews.productID, productID), eq(reviews.userID, session.user.id))
		})
		if (reviewExists) return {error: "You already left a review on this product"}

		const newReview = await db.insert(reviews).values({
			productID,
			rating,
			comment,
			userID: session.user.id
		}).returning()

		revalidatePath(`/products/${productID}`)
		return {success: newReview[0]}
	} catch (error) {
		return {error: JSON.stringify(error)}
	}
});