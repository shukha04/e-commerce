"use client";

import {Elements} from "@stripe/react-stripe-js";
import {motion} from "framer-motion";
import getStripe from "@/lib/get-stripe";
import {useCartStore} from "@/lib/client-store";
import PaymentForm from "@/components/cart/payment-form";
import {useTheme} from "next-themes";

const stripe = getStripe();

export default function Payment() {
	const {cart} = useCartStore();
	const {theme} = useTheme();

	const totalPrice = cart.reduce((acc, item) => Number((acc + item.price * item.variant.quantity * 100).toFixed(0)), 0)

	return (
		<motion.div className="max-w-2xl mx-auto">
			<Elements stripe={stripe} options={{
				mode: "payment",
				currency: "usd",
				amount: totalPrice,
				appearance: {
					theme: theme === "dark" ? "night" : "flat"
				}
			}}>
				<PaymentForm totalPrice={totalPrice} />
			</Elements>
		</motion.div>
	)
}