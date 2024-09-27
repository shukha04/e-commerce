import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {db} from "@/server";
import {desc} from "drizzle-orm";
import {orderProduct} from "@/server/schema";
import Sales from "@/app/dashboard/analytics/sales";
import Earnings from "@/app/dashboard/analytics/earnings";

export const revalidate = 0;

export default async function AnalyticsPage() {
	const totalOrders = await db.query.orderProduct.findMany({
		orderBy: [desc(orderProduct.id)],
		limit: 10,
		with: {
			order: {
				with: {
					user: true
				}
			},
			product: true,
			productVariants: {
				with: {
					variantImages: true
				}
			}
		}
	})

	if (totalOrders.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>No Orders Yet</CardTitle>
				</CardHeader>
			</Card>
		)
	}

	if (totalOrders) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Your analytics</CardTitle>
					<CardDescription>Check your sales, new customers and more</CardDescription>
				</CardHeader>
				<CardContent className="flex gap-8 lg:flex-row flex-col">
					<Sales totalOrders={totalOrders} />
					<Earnings totalOrders={totalOrders} />
				</CardContent>
			</Card>
		)
	}
}