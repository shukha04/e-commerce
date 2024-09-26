"use client";

import {useCartStore} from "@/lib/client-store";
import {motion} from "framer-motion";
import {DrawerDescription, DrawerTitle} from "@/components/ui/drawer";
import {ArrowLeft} from "lucide-react";

export default function CartMessage() {
	const {checkoutProgress, setCheckoutProgress} = useCartStore();

	return (
		<motion.div className="text-center" animate={{opacity: 1, x: 0}} initial={{opacity: 0, x: 10}}>
			<DrawerTitle>
				{checkoutProgress === "cart-page" ? "Your Cart Items" : null}
				{checkoutProgress === "payment-page" ? "Choose a Payment Method" : null}
				{checkoutProgress === "confirmation-page" ? "Order Confirmed" : null}
			</DrawerTitle>
			<DrawerDescription className="py-1">
				{checkoutProgress === "cart-page" ? "View and edit your bag." : null}
				{checkoutProgress === "payment-page" ?
					<span
						className="flex items-center justify-center gap-1 cursor-pointer hover:text-primary"
						onClick={() => setCheckoutProgress("cart-page")}
					>
						<ArrowLeft size={14} /> Head back to cart
					</span> : null}
				{checkoutProgress === "confirmation-page" ? "Order Confirmed" : null}
			</DrawerDescription>
		</motion.div>
	)
}