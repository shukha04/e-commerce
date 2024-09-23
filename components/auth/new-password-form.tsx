"use client"

import {AuthCard} from "@/components/auth/auth-card";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useAction} from "next-safe-action/hooks";
import {cn} from "@/lib/utils";
import {useState} from "react";
import {FormSuccess} from "@/components/auth/form-success";
import {FormError} from "@/components/auth/form-error";
import {NewPasswordSchema} from "@/types/new-password-schema";
import {newPassword} from "@/server/actions/new-password";
import {Lock} from "lucide-react";
import {useSearchParams} from "next/navigation";

export const NewPasswordForm = () => {
	const form = useForm<z.infer<typeof NewPasswordSchema>>({
		resolver: zodResolver(NewPasswordSchema),
		defaultValues: {
			password: ""
		}
	});

	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")

	const {execute, status} = useAction(newPassword, {
		onSuccess({data}) {
			if (data?.error) setError(data.error)
			if (data?.success) setSuccess(data.success)
		}
	})

	const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
		execute({...values, token})
	}

	return (
		<AuthCard cardTitle="Enter new password" backBtnHref="/auth/login" backBtnLbl="Back to login">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div>
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
					<Button type="submit" className={cn("w-full mt-2 flex gap-4", status === "executing" ? "animate-pulse" : "")}>
						<Lock className="w-4 h-4" />
						<span>
							Reset password
						</span>
					</Button>
				</form>
			</Form>
		</AuthCard>
	);
};