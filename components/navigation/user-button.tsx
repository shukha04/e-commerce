"use client"

import {Session} from "next-auth";
import {
	DropdownMenu,
	DropdownMenuContent, DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Image from "next/image";
import {LogOut, Moon, Settings, Sun, Truck} from "lucide-react";
import {signOut} from "next-auth/react";
import {useTheme} from "next-themes";
import {useEffect, useState} from "react";
import {Switch} from "@/components/ui/switch";
import {useRouter} from "next/navigation";

export const UserButton = ({user}: Session) => {
	const {setTheme, theme} = useTheme();
	const [checked, setChecked] = useState(false);
	const router = useRouter();

	function setSwitchState() {
		switch(theme) {
			case "dark":
				return setChecked(true);
			case "light":
				return setChecked(false);
			case "system":
				return setChecked(false);
		}
	}

	useEffect(() => {
		setSwitchState()
	}, [])

	if (user) {
		return (
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger>
					<Avatar className="h-7 w-7">
						{user?.image && user.name && (
							<Image src={user.image} alt={user.name} fill />
						)}
						{!user.image && (
							<AvatarFallback className="font-bold">{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
						)}
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="p-6" align="end">
					<div className="mb-4 p-4 flex flex-col items-center bg-primary/5 rounded-sm gap-1">
						{user?.image && user.name && (
							<Image src={user.image} alt={user.name} width={36} height={36} className="rounded-full" />
						)}
						<p className="font-medium text-xs">{user.name}</p>
						<span className="text-xs text-primary/50">{user.email}</span>
					</div>
					<DropdownMenuSeparator/>
					<DropdownMenuItem onClick={() => router.push("/dashboard/orders")} className="group py-2 font-medium cursor-pointer ease-in-out">
						<Truck size={14} className="mr-3 group-hover:translate-x-1 transition-all duration-300 ease-in-out" />
						My orders
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => router.push("/dashboard/settings")} className="group py-2 font-medium cursor-pointerease-in-out">
						<Settings size={14} className="mr-3 group-hover:rotate-180 transition-all duration-500 ease-in-out" />
						Settings
					</DropdownMenuItem>
					{theme && (
						<DropdownMenuItem className="py-2 font-medium cursor-pointer ease-in-out">
							<div className="flex items-center w-full justify-between group" onClick={(e) => e.stopPropagation()}>
								<div className="flex items-center">
									<div className="relative flex mr-3">
										<Sun size={14} className="absolute group-hover:text-yellow-500 group-hover:rotate-180 dark:scale-0 dark:-rotate-90 ease-in-out" />
										<Moon size={14} className="group-hover:text-blue-300 dark:scale-100 scale-0" />
									</div>
									<p className="dark:text-blue-300 text-secondary-foreground/75 text-yellow-500">
										{theme[0].toUpperCase() + theme.slice(1)} mode
									</p>
								</div>
								<Switch className="scale-75 ml-2" checked={checked} onCheckedChange={(e) => {
									setChecked((prev) => !prev)

									if (e) setTheme("dark")
									else setTheme("light")
								}} />
							</div>
						</DropdownMenuItem>
					)}
					<DropdownMenuItem className="focus:bg-destructive/10 focus:text-destructive group py-2 font-medium cursor-pointer transition-all duration-500 ease-in-out" onClick={() => signOut()}>
						<LogOut size={14} className="mr-3 group-hover:scale-90 transition-transform ease-in-out" />
						Sign out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

		);
	}
};