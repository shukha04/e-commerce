"use client";

import {useForm} from "react-hook-form";
import * as z from "zod";
import {ProductSchema} from "@/types/product-schema";import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {DollarSign} from "lucide-react";
import Tiptap from "@/app/dashboard/add-product/tiptap";
import {zodResolver} from "@hookform/resolvers/zod";
import {useAction} from "next-safe-action/hooks";
import {createProduct} from "@/server/actions/create-product";
import {useRouter, useSearchParams} from "next/navigation";
import {toast} from "sonner";
import {getProducts} from "@/server/actions/get-product";
import {useEffect} from "react";

export default function ProductForm() {
	const form = useForm<z.infer<typeof ProductSchema>>({
		resolver: zodResolver(ProductSchema),
		defaultValues: {
			title: "",
			description: "",
			price: 0,
		}
	})

	const router = useRouter();
	const searchParams = useSearchParams();

	const editMode = searchParams.get("id");

	const checkProduct = async (id: number) => {
		if (editMode) {
			const {success, error} = await getProducts(id)
			if (error) {
				toast.error(error)
				router.push(`/dashboard/products`)
				return
			}
			if (success) {
				const id = parseFloat(editMode)
				form.setValue("title", success.title)
				form.setValue("description", success.description)
				form.setValue("price", success.price)
				form.setValue("id", id)
			}
		}
	}

	useEffect(() => {
		if (editMode) {
			checkProduct(parseInt(editMode))
		}
	}, [editMode]);

	const {execute, status} = useAction(createProduct, {
		onSuccess: ({data}) => {
			if (data?.success) {
				router.push("/dashboard/products")
				toast.success(data.success)
			}
			if (data?.error) {
				toast.error(data.error)
			}
		},
		onExecute: () => {
			if (editMode) {
				toast.loading(`Editing ${form.getValues("title")} product`)
			} else {
				toast.loading(`Creating ${form.getValues("title")} product`)
			}
		},
		onError: (error) => console.error(error)
	})

	async function onSubmit(values: z.infer<typeof ProductSchema>) {
		execute(values);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>{editMode ? "Edit products" : "Create a new products"}</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Product title</FormLabel>
									<FormControl>
										<Input placeholder="Product title" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Product description</FormLabel>
									<FormControl>
										<Tiptap value={field.value} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="price"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Product price</FormLabel>
									<FormControl>
										<div className="flex items-center gap-2">
											<DollarSign size={40} className="p-2 bg-muted rounded-md" />
											<Input {...field} type="number" placeholder="Product price" step=".01" min={0} />
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button disabled={status === "executing" || !form.formState.isValid || !form.formState.isDirty} type="submit">
							{editMode ? "Save changes" : "Create products"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}