"use client"

import {AuthCard} from "@/components/auth/auth-card";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {zodResolver} from "@hookform/resolvers/zod";
import {LoginSchema} from "@/types/login-schema";
import * as z from "zod";
import {Input} from "@/components/ui/input";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {useAction} from "next-safe-action/hooks";
import {emailSignIn} from "@/server/actions/email-signin";
import {cn} from "@/lib/utils";
import {useState} from "react";
import {LogIn} from "lucide-react";
import {FormSuccess} from "@/components/auth/form-success";
import {FormError} from "@/components/auth/form-error";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp"


export const LoginForm = () => {
	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: ""
		}
	});

	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")
	const [showTwoFactor, setShowTwoFactor] = useState(false)

	const {execute, status} = useAction(emailSignIn, {
		onSuccess({data}) {
			if (data?.error) setError(data.error)
			if (data?.success) setSuccess(data.success)
			if (data?.twoFactor) setShowTwoFactor(true)
		}
	})

	const onSubmit = (values: z.infer<typeof LoginSchema>) => {
		execute(values)
	}

	return (
		<AuthCard cardTitle="Welcome back!" backBtnHref="/auth/register" backBtnLbl="Create a new account" showSocials>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div>
						{showTwoFactor ? (
							<FormField
								control={form.control}
								name="code"
								render={({field}) => (
									<FormItem>
										<FormLabel>Two factor code</FormLabel>
										<FormControl>
											<InputOTP disabled={status === "executing"} maxLength={6} {...field}>
												<InputOTPGroup>
													<InputOTPSlot index={0} />
													<InputOTPSlot index={1} />
													<InputOTPSlot index={2} />
													<InputOTPSlot index={3} />
													<InputOTPSlot index={4} />
													<InputOTPSlot index={5} />
												</InputOTPGroup>
											</InputOTP>
										</FormControl>
										<FormDescription />
										<FormMessage />
									</FormItem>
								)}
							/>
						) : (
							<>
								<FormField
									control={form.control}
									name="email"
									render={({field}) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input {...field} type="email" placeholder="Email" autoComplete="email" disabled={status === "executing"} />
											</FormControl>
											<FormDescription />
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="password"
									render={({field}) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input {...field} type="password" placeholder="Password" autoComplete="current-password" disabled={status === "executing"} />
											</FormControl>
											<FormDescription />
											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}
						<FormSuccess message={success} />
						<FormError message={error} />
						<Button size="sm" variant="link" className="px-0" asChild>
							<Link href="/auth/forgot">Forgot your password?</Link>
						</Button>
					</div>
					<Button type="submit" className={cn("w-full mt-4 flex gap-4", status === "executing" ? "animate-pulse" : "")}>
						<LogIn className="w-4 h-4" />
						<span>
							{showTwoFactor ? "Verify" : "Sign in"}
						</span>
					</Button>
				</form>
			</Form>
		</AuthCard>
	);
};