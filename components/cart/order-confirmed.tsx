"use client";

import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useCartStore} from "@/lib/client-store";
import {motion} from "framer-motion";
import Lottie from "lottie-react";
import OrderPackage from "@/public/order-package.json"

export default function OrderConfirmed() {
	const {setCheckoutProgress, setCartOpen} = useCartStore();

	return (
		<div className="flex flex-col items-center gap-2">
			<motion.div animate={{opacity: 1, scale: 1}} initial={{opacity: 0, scale: 0}} transition={{delay: 0.35}}>
				<Lottie className="h-56 my-4" animationData={OrderPackage}/>
			</motion.div>
			<h2 className="text-2xl font-medium">Thank you for your purchase!</h2>
			<Link href="/dashboard/orders">
				<Button onClick={() => {
					setCheckoutProgress("cart-page");
					setCartOpen(false);
				}}>
					View your order
				</Button>
			</Link>
		</div>
	)
}