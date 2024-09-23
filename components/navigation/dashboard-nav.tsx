"use client"

import {usePathname} from "next/navigation";
import Link from "next/link";
import {motion, AnimatePresence} from "framer-motion";
import {cn} from "@/lib/utils";

export default function DashboardNav({allLinks}: {allLinks: {label: string, path: string, icon: JSX.Element}[]}) {
	const pathname = usePathname();

	return (
		<nav className="py-2 overflow-auto mb-4">
			<ul className="flex gap-6 text-xs font-semibold">
				<AnimatePresence>
					{allLinks.map((link) => (
						<motion.li whileTap={{scale: 0.95}} key={link.path}>
							<Link
								href={link.path}
								className={cn("flex gap-1 flex-col items-center text-primary/60 relative", pathname === link.path && "text-primary")}>
								{link.icon}
								{link.label}
								{pathname === link.path ? (
									<motion.div
										initial={{scale: 0.5}}
										animate={{scale: 1}}
										className="h-[2px] w-full rounded-full absolute bg-primary z-0 left-0 -bottom-1"
										layoutId="underline"
										transition={{type: "spring", stiffness: 60}}
									/>
								) : null}
							</Link>
						</motion.li>
					))}
				</AnimatePresence>
			</ul>
		</nav>
	)
}