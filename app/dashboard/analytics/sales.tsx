import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {TotalOrders} from "@/lib/infer-types";
import Image from "next/image";
import userPlaceholder from "@/public/user-placeholder.png"

export default function Sales({totalOrders}: {totalOrders: TotalOrders[]}) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>New Sales</CardTitle>
				<CardDescription>Here are your recent sales</CardDescription>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Customer</TableHead>
							<TableHead>Item</TableHead>
							<TableHead>Price</TableHead>
							<TableHead>Quantity</TableHead>
							<TableHead>Image</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{totalOrders.map(({order, product, quantity, productVariants}) => (
							<TableRow key={order.id} className="font-medium">
								<TableCell>
									{order.user?.image && order.user.name ? (
										<div className="flex gap-2 items-center pr-4">
											<Image src={order.user.image!} width={25} height={25} alt={order.user.name!} className="rounded-full" />
											<p className="text-xs font-medium">{order.user.name}</p>
										</div>
									) : (
										<div className="flex gap-2 items-center pr-4">
											<Image src={userPlaceholder} width={25} height={25} alt="User not found" className="rounded-full"/>
											<p className="text-xs font-medium">User not found</p>
										</div>
									)}
								</TableCell>
								<TableCell>{product.title}</TableCell>
								<TableCell>{product.price}</TableCell>
								<TableCell>{quantity}</TableCell>
								<TableCell>
									<Image src={productVariants.variantImages[0].url} alt={product.title} width={48} height={48} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}