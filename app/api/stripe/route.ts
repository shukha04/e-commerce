import {type NextRequest, NextResponse} from "next/server"
import Stripe from "stripe";
import {db} from "@/server";
import {orders} from "@/server/schema";
import {eq} from "drizzle-orm";

export async function POST(req: NextRequest) {
	const stripe = new Stripe(process.env.STRIPE_SECRET!, {
		apiVersion: "2024-06-20"
	})

	const sig = req.headers.get("stripe-signature")!
	const signingSecret = process.env.STRIPE_WEBHOOK_SECRET!

	const reqText = await req.text();
	const reqBuffer = await Buffer.from(reqText);

	let event;

	try {
		event = stripe.webhooks.constructEvent(reqBuffer, sig, signingSecret)
	} catch (error: any) {
		return new NextResponse(`Webhook Error: ${error.message}`, {
			status: 400
		})
	}

	switch(event.type) {
		case "payment_intent.succeeded":
			const retrieveOrder = await stripe.paymentIntents.retrieve(event.data.object.id, {expand: ["latest_charge"]})
			const charge = retrieveOrder.latest_charge as Stripe.Charge

			const customer = await db.update(orders).set({
				status: "succeeded",
				receiptURL: charge.receipt_url
			}).where(eq(orders.paymentIntentID, event.data.object.id))

			break;
		default:
			break;
	}

	return new Response("ok", {status: 200})
}