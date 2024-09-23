"use client";

import {ReactNode, useEffect, useState} from "react";
import {VariantsWithImagesTags} from "@/lib/infer-types";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {VariantSchema} from "@/types/variant-schema";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {InputTags} from "@/app/dashboard/products/input-tags";
import VariantImages from "@/app/dashboard/products/variant-images";
import {useAction} from "next-safe-action/hooks";
import {createVariant} from "@/server/actions/create-variant";
import {toast} from "sonner";
import {deleteVariant} from "@/server/actions/delete-variant";


export const ProductVariant = ({
	editMode,
	productID,
	variant,
	children
}: {
	editMode: boolean,
	productID?: number,
	variant?: VariantsWithImagesTags,
	children: ReactNode
}) => {
	const form = useForm<z.infer<typeof VariantSchema>>({
		resolver: zodResolver(VariantSchema),
		defaultValues: {
			tags: [],
			variantImages: [],
			color: "#000000",
			editMode,
			productID,
			id: undefined,
			productType: ""
		}
	})

	const [open, setOpen] = useState(false);

	const setEdit = () => {
		if (!editMode) {
			form.reset();
			return
		}

		if (editMode && variant) {
			form.setValue("editMode", true)
			form.setValue("id", variant.id)
			form.setValue("productID", variant.productID)
			form.setValue("productType", variant.productType)
			form.setValue("color", variant.color)
			form.setValue("tags", variant.variantTags.map((tag) => tag.tag))
			form.setValue("variantImages", variant.variantImages.map((image) => ({
				name: image.name,
				size: image.size,
				url: image.url
			})))
		}
	}

	useEffect(() => {
		setEdit();
	}, []);

	const {execute, status} = useAction(createVariant, {
		onExecute() {
			if (editMode && variant) {
				toast.loading("Editing variant", {duration: 500})
			} else {
				toast.loading("Creating variant", {duration: 500})
			}
			setOpen(false);
		},
		onSuccess: ({data}) => {
			toast.dismiss()
			if (data?.success) {
				toast.success(data.success)
				form.reset();
			}
			if (data?.error) {
				toast.error(data.error)
			}
		}
	})

	const deleteAction = useAction(deleteVariant, {
		onExecute() {
			toast.loading("Deleting variant", {duration: 500})
			setOpen(false);
		},
		onSuccess: ({data}) => {
			toast.dismiss()
			if (data?.success) {
				toast.success(data.success)
			}
			if (data?.error) {
				toast.error(data.error)
			}
		}
	})

	function onSubmit(values: z.infer<typeof VariantSchema>) {
		execute(values)
	}

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger>{children}</DialogTrigger>
			<DialogContent className="lg:max-w-screen-lg overflow-y-auto max-h-[90vh]">
				<DialogHeader>
					<DialogTitle>{editMode ? "Edit" : "Create"} your variant</DialogTitle>
					<DialogDescription>
						Manage your product variants here.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="productType"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Variant title</FormLabel>
									<FormControl>
										<Input placeholder="Variant title" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="color"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Variant color</FormLabel>
									<FormControl>
										<Input type="color" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="tags"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Variant tags</FormLabel>
									<FormControl>
										<InputTags {...field} onChange={(e) => field.onChange(e)} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<VariantImages />
						<div className="flex gap-4 items-center justify-end">
							{editMode && variant &&
								<Button
									type="button"
									variant="destructive"
									disabled={deleteAction.status === "executing"}
									onClick={(e) => {
										e.preventDefault();
										deleteAction.execute({id: variant.id})
									}}
								>Delete</Button>
							}
							<Button
								type="submit"
								disabled={status === "executing" || !form.formState.isValid || !form.formState.isDirty}
							>
								{editMode ? "Update" : "Create"}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}