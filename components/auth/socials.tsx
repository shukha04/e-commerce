"use client"

import {Button} from "@/components/ui/button";
import {signIn} from "next-auth/react";
import {FcGoogle} from "react-icons/fc";
import {FaFacebook} from "react-icons/fa";

export default function Socials() {
	return (
		<div className="flex flex-wrap w-full gap-4">
			<Button className="flex flex-grow min-w-56 gap-4" variant="outline" onClick={() => signIn("google", {
				redirect: false,
				callbackUrl: "/"
			})}>
				<p>Sign in with Google</p>
				<FcGoogle className="w-5 h-5" />
			</Button>
			<Button className="flex flex-grow min-w-56 gap-4" variant="outline" onClick={() => signIn("facebook", {
				redirect: false,
				callbackUrl: "/"
			})}>
				<p>Sign in with Facebook</p>
				<FaFacebook className="w-5 h-5" />
			</Button>
		</div>
	)
}