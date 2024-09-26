"use server";

import Stripe from "stripe";
import {createSafeActionClient} from "next-safe-action";
import {paymentIntentSchema} from "@/types/payment-intent-schema";
import {auth} from "@/server/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET!);

export const createPaymentIntent = createSafeActionClient().schema(paymentIntentSchema).action(async ({parsedInput: {amount,cart,currency}}) => {
	const user = await auth();
	if (!user) return {error: "Login to continue"}
	if (!amount) return {error: "No product to checkout"}

	const paymentIntent = await stripe.paymentIntents.create({
		amount,
		currency,
		automatic_payment_methods: {
			enabled: true
		},
		metadata: {
			cart: JSON.stringify(cart)
		}
	})
	return {
		success: {
			paymentIntentID: paymentIntent.id,
			clientSecretID: paymentIntent.client_secret,
			user: user.user.email
		}
	}
})