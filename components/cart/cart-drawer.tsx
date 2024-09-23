"use client";

import {useCartStore} from "@/lib/client-store";
import {ShoppingBag} from "lucide-react";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTrigger,
} from "@/components/ui/drawer"
import {AnimatePresence, motion} from "framer-motion";
import CartItems from "@/components/cart/cart-items";


export default function CartDrawer() {
	const {cart} = useCartStore();

	return (
		<Drawer>
			<DrawerTrigger>
				<div className="relative px-2">
					<AnimatePresence>
						{cart.length > 0 && (
							<motion.span
								animate={{scale: 1, opacity: 1}}
								initial={{opacity: 0, scale: 0}}
								exit={{opacity: 0, scale: 0}}
								className="absolute flex items-center justify-center -top-1 -right-0.5 w-4 h-4 bg-primary text-xs font-bold rounded-full text-white dark:text-primary-foreground">
								{cart.length}
							</motion.span>
						)}
					</AnimatePresence>
					<ShoppingBag />
				</div>
			</DrawerTrigger>
			<DrawerContent className="min-h-50vh">
				<DrawerHeader>
					<h1>Cart progress</h1>
				</DrawerHeader>
				<div className="overflow-auto p-4">
					<CartItems />
				</div>
			</DrawerContent>
		</Drawer>
	)
}