import {auth} from "@/server/auth"
import {UserButton} from "@/components/navigation/user-button";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {LogIn} from "lucide-react";
import CartDrawer from "@/components/cart/cart-drawer";

export default async function Nav() {
	const session = await auth();

	return (
		<header className="py-8">
			<nav>
				<ul className="flex justify-between items-center md:gap-8 gap-4">
					<li className="flex flex-1">
						<Link href="/" aria-label="logo">
							LOGO
						</Link>
					</li>
					<li className="relative flex items-center hover:bg-muted">
						<CartDrawer />
					</li>
					{!session ? (
						<li className="flex items-center justify-center">
							<Button asChild>
								<Link className="flex gap-2" href="/auth/login">
									<LogIn size={16} />
									<span>Login</span>
								</Link>
							</Button>
						</li>
					) : (
						<li className="flex items-center justify-center">
							<UserButton expires={session?.expires} user={session?.user}/>
						</li>
					)}
				</ul>
			</nav>
		</header>
	);
};