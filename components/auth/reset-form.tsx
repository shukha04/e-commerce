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
import { Mail} from "lucide-react";
import {FormSuccess} from "@/components/auth/form-success";
import {FormError} from "@/components/auth/form-error";
import {ResetSchema} from "@/types/reset-schema";
import {reset} from "@/server/actions/password-reset";

export const ResetForm = () => {
	const form = useForm<z.infer<typeof ResetSchema>>({
		resolver: zodResolver(ResetSchema),
		defaultValues: {
			email: ""
		}
	});

	const [error, setError] = useState("")
	const [success, setSuccess] = useState("")

	const {execute, status} = useAction(reset, {
		onSuccess({data}) {
			if (data?.error) setError(data.error)
			if (data?.success) setSuccess(data.success)
		}
	})

	const onSubmit = (values: z.infer<typeof ResetSchema>) => {
		execute(values);
	}

	return (
		<AuthCard cardTitle="Forgot your password?" backBtnHref="/auth/login" backBtnLbl="Back to login" showSocials>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div>
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
						<FormSuccess message={success} />
						<FormError message={error} />
					</div>
					<Button type="submit" className={cn("w-full mt-2 flex gap-4", status === "executing" ? "animate-pulse" : "")}>
						<Mail className="w-4 h-4" />
						<span>
							Send email
						</span>
					</Button>
				</form>
			</Form>
		</AuthCard>
	);
};