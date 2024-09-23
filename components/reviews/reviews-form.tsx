"use client";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {useSearchParams} from "next/navigation";
import {ReviewSchema} from "@/types/reviews-schema";
import { Textarea } from "@/components/ui/textarea"
import {motion} from "framer-motion";
import {Star} from "lucide-react";
import {cn} from "@/lib/utils";
import {useAction} from "next-safe-action/hooks";
import {addReview} from "@/server/actions/add-review";
import {toast} from "sonner";

export default function ReviewsForm() {
	const params = useSearchParams();
	const productID = Number(params.get("productID"));

	const form = useForm<z.infer<typeof ReviewSchema>>({
		resolver: zodResolver(ReviewSchema),
		defaultValues: {
			rating: 0,
			comment: "",
			productID
		}
	})

	const {execute, status} = useAction(addReview, {
		onSuccess({data}) {
			if (data?.error) {
				toast.error(data.error)
			}
			if (data?.success) {
				toast.success("Review added!")
				form.reset()
			}
		}
	})

	const onSubmit = (values: z.infer<typeof ReviewSchema>) => {
		execute({
			comment: values.comment,
			rating: values.rating,
			productID
		})
	}

	return (
		<Popover>
			<PopoverTrigger asChild>
				<div className="w-full">
					<Button className="font-medium w-full" variant="secondary">Leave a review</Button>
				</div>
			</PopoverTrigger>
			<PopoverContent>
				<Form {...form}>
					<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField control={form.control} name="comment" render={({field}) => (
							<FormItem>
								<FormLabel>Comment</FormLabel>
								<FormControl>
									<Textarea placeholder="Leave a review" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)} />
						<FormField control={form.control} name="rating" render={({field}) => (
							<FormItem>
								<FormLabel>Rating</FormLabel>
								<FormControl>
									<Input type="hidden" placeholder="Leave a rate" {...field}  />
								</FormControl>
								<div className="flex">
									{[1,2,3,4,5].map((value) => {
										return (
											<motion.div
												className="relative cursor-pointer"
												whileHover={{scale: 1.2}}
												whileTap={{scale: 0.8}}
												key={value}
											>
												<Star
													onClick={() => {
														form.setValue("rating", value, {
															shouldValidate: true
														})
													}}
													className={cn("text-primary bg-transparent transition-all duration-300 ease-in-out", form.getValues("rating") >= value ? "fill-primary" : "fill-muted")}
												/>
											</motion.div>
										)
									})}
								</div>
								<FormMessage />
							</FormItem>
						)} />
						<Button disabled={status === "executing"} className="w-full" type="submit">{status === "executing" ? "Adding review..." : "Leave a review"}</Button>
					</form>
				</Form>
			</PopoverContent>
		</Popover>
	)
}