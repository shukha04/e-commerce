"use client";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Session} from "next-auth";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {SettingsSchema} from "@/types/settings-schema"
import Image from "next/image";
import {Switch} from "@/components/ui/switch";
import {FormError} from "@/components/auth/form-error";
import {FormSuccess} from "@/components/auth/form-success";
import {useState} from "react";
import {useAction} from "next-safe-action/hooks";
import {settings} from "@/server/actions/settings";
import {UploadButton} from "@/app/api/uploadthing/upload";

type SettingsForm = {
	session: Session
}

export default function SettingsCard({session}: SettingsForm) {
	const [error, setError] = useState<string | undefined>(undefined);
	const [success, setSuccess] = useState<string | undefined>(undefined);
	const [avatarUploading, setAvatarUploading] = useState<boolean>(false);

	const form = useForm<z.infer<typeof SettingsSchema>>({
		resolver: zodResolver(SettingsSchema),
		defaultValues: {
			password: undefined,
			newPassword: undefined,
			name: session.user?.name || undefined,
			email: session.user?.email || undefined,
			image: session.user?.image || undefined,
			isTwoFactorEnabled: session.user.isTwoFactorEnabled || undefined
		}
	})

	const {execute, status} = useAction(settings, {
		onSuccess({data}) {
			if (data?.error) setError(data.error)
			if (data?.success) setSuccess(data.success)
		}
	})

	const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
		execute(values);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Your settings</CardTitle>
				<CardDescription>Update your account settings</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Name" disabled={status === "executing"} type="text" {...field} />
									</FormControl>
									<FormDescription>
										This is your public display name.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="image"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Avatar</FormLabel>
									<div className="flex items-center gap-4">
										{!form.getValues("image") && (
											<div className="font-bold">
												{session.user?.name?.charAt(0).toUpperCase()}
											</div>
										)}
										{form.getValues("image") && (
											<Image className="rounded-full" src={form.getValues("image")!} width={42} height={42} alt="User image" />
										)}
										<UploadButton
											className="scale-75 ut-button:ring-primary ut-button:bg-primary/75 hover:ut-button:bg-primary/100 ut-button:transition-all ut-button:duration-500 ut-label:hidden ut-allowed-content:hidden"
											endpoint="avatarUploader"
											onUploadBegin={() => {
												setAvatarUploading(true);
											}}
											onUploadError={(error) => {
												form.setError("image", {
													type: "validate",
													message: error.message
												})
												setAvatarUploading(false)
												return
											}}
											onClientUploadComplete={(res) => {
												form.setValue("image", res[0].url!);
												setAvatarUploading(false);
											}}
											content={{button({ready}) {
												if (ready) return <div>Change avatar</div>
												return <div>Uploading...</div>
											}}}
										/>
									</div>
									<FormControl>
										<Input placeholder="User Image" type="hidden" disabled={status === "executing"} {...field} />
									</FormControl>
									<FormDescription>
										This is your public display image.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input placeholder="Password" disabled={status === "executing" || session.user.isOAuth} type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="newPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>New password</FormLabel>
									<FormControl>
										<Input placeholder="New password" disabled={status === "executing" || session.user.isOAuth} type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="isTwoFactorEnabled"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Two factor authenticator</FormLabel>
									<FormDescription>
										Enable teo factor authenticator for your account
									</FormDescription>
									<FormControl>
										<Switch disabled={status === "executing" || session.user.isOAuth} checked={field.value} onCheckedChange={field.onChange} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormError message={error} />
						<FormSuccess message={success} />
						<Button type="submit" disabled={status === "executing" || avatarUploading}>Update your settings</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}