"use server";

import {createSafeActionClient} from "next-safe-action";
import {createOrderSchema} from "@/types/order-schema";
import {auth} from "@/server/auth";
import {db} from "@/server";
import {orderProduct, orders} from "@/server/schema";
import {revalidatePath} from "next/cache";

export const createOrder = createSafeActionClient().schema(createOrderSchema).action(async ({parsedInput: {products, status, paymentIntentID, total}}) => {
	const user = await auth();
	if (!user) return {error: "User not found"}

	const order = await db.insert(orders).values({
		status,
		paymentIntentID,
		total,
		userID: user.user.id
	}).returning()

	const orderProducts = products.map(async ({productID, variantID, quantity}) => {
		const newOrderProduct = await db.insert(orderProduct).values({
			quantity,
			orderID: order[0].id,
			productID,
			productVariantID: variantID
		})
	})
	revalidatePath("/dashboard/orders")
	return {success: "Order has been added"}
})