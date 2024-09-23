"use client"

import * as z from "zod";
import {AuthCard} from "@/components/auth/auth-card";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {LogIn} from "lucide-react";
import {cn} from "@/lib/utils";
import {RegisterSchema} from "@/types/register-schema";
import {useAction} from "next-safe-action/hooks";
import {emailRegister} from "@/server/actions/email-register";
import {FormSuccess} from "@/components/auth/form-success";
import {FormError} from "@/components/auth/form-error";

export const RegisterForm = () => {
	const form = useForm<z.infer<typeof RegisterSchema>>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			name: "",
			email: "",
			password: ""
		}
	});

	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")
	const {execute, status} = useAction(emailRegister, {
		onSuccess({data}) {
			if (data?.error) setError(data?.error)
			if (data?.success) setSuccess(data?.success)
		}
	})

	const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
		execute(values)
	}

	return (
		<AuthCard cardTitle="Create an account!" backBtnHref="/auth/login" backBtnLbl="Already have an account?" showSocials>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div>
							<FormField
								control={form.control}
								name="name"
								render={({field}) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input {...field} type="text" placeholder="Name" autoComplete="given-name" disabled={status === "executing"} />
										</FormControl>
										<FormDescription />
										<FormMessage />
									</FormItem>
								)}
							/>
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
											<Input {...field} type="password" placeholder="Password" autoComplete="new-password" disabled={status === "executing"} />
										</FormControl>
										<FormDescription />
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormSuccess message={success} />
							<FormError message={error} />
						</div>
						<Button type="submit" className={cn("w-full mt-8 flex gap-4", status === "executing" ? "animate-pulse" : "")}>
							<LogIn className="w-4 h-4" />
							<span>
								{"Register"}
							</span>
						</Button>
					</form>
				</Form>
		</AuthCard>
	);
}