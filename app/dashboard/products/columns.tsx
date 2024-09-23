"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {MoreHorizontal, PlusCircle} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useAction} from "next-safe-action/hooks";
import {deleteProduct} from "@/server/actions/delete-product";
import {toast} from "sonner";
import Link from "next/link";
import {VariantsWithImagesTags} from "@/lib/infer-types";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import {ProductVariant} from "@/app/dashboard/products/product-variant";


type ProductColumn = {
	title: string
	price: number
	image: string
	variants: VariantsWithImagesTags[]
	id: number
}

export const columns: ColumnDef<ProductColumn>[] = [
	{
		accessorKey: "id",
		header: "ID",
	},
	{
		accessorKey: "title",
		header: "Title",
	},
	{
		accessorKey: "variants",
		header: "Variants",
		cell: ({row}) => {
			const variants = row.getValue("variants") as VariantsWithImagesTags[];

			return (
				<div className="flex gap-2 items-center flex-wrap">
					{variants.map((variant) => (
						<div key={variant.id}>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<ProductVariant productID={variant.productID} variant={variant} editMode={true}>
											<div className="w-5 h-5 rounded-full" key={variant.id} style={{background: variant.color}} />
										</ProductVariant>
									</TooltipTrigger>
									<TooltipContent>
										<p>{variant.productType}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					))}
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<span>
									<ProductVariant editMode={false} productID={row.original.id}>
										<PlusCircle className="w-4 h-4" />
									</ProductVariant>
								</span>
							</TooltipTrigger>
							<TooltipContent>
								Create a new variant
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			)
		}
	},
	{
		accessorKey: "price",
		header: "Price",
		cell: ({row}) => {
			const price = parseFloat(row.getValue("price"));
			const formatted = new Intl.NumberFormat('en-US', {
				currency: "USD",
				style: "currency"
			}).format(price);
			return <div className="font-medium text-xs">{formatted}</div>;
		}
	},
	{
		accessorKey: "image",
		header: "Image",
		cell: ({row}) => {
			const url = row.getValue("image") as string;
			const title = row.getValue("title") as string;
			return <Image src={url} alt={title} width={50} height={50} className="rounded-md" />
		}
	},
	{
		accessorKey: "actions",
		header: "Actions",
		cell: ({row}) => {
			const product = row.original;

			const {execute, status} = useAction(deleteProduct, {
				onSuccess: ({data}) => {
					if (data?.success) {
						toast.success(data.success)
					}
					if (data?.error) {
						toast.error(data.error)
					}
				},
				onExecute: () => {
					toast.loading("Deleting products")
				}
			})

			return (
				<DropdownMenu modal={false}>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem className="focus:bg-primary/10 cursor-pointer">
							<Link href={`/dashboard/add-product?id=${product.id}`}>
								Edit product
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem
							className="focus:bg-destructive/10 focus:text-destructive cursor-pointer"
							onClick={() => execute({id: product.id})}>
							Delete product
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	}
]
