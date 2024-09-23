import {db} from "@/server";
import placeholder from "@/public/image-placeholder.svg"
import {DataTable} from "@/app/dashboard/products/data-table";
import {columns} from "@/app/dashboard/products/columns";

export default async function ProductsPage() {
	const products = await db.query.products.findMany({
		with: {
			productVariants: {with: {variantImages: true, variantTags: true}}
		},
		orderBy: (products, {desc}) => [desc(products.id)]
	})

	if (!products) throw new Error("Products not found")

	const dataTable = products.map((product) => {
		return {
			id: product.id,
			title: product.title,
			price: product.price,
			variants: product.productVariants,
			image: product.productVariants[0]?.variantImages[0]?.url || placeholder.src
		}
	})
	if (!dataTable) throw new Error("Data not found")

	return (
		<div>
			<DataTable columns={columns} data={dataTable} />
		</div>
	)
}