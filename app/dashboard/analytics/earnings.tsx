"use client";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {TotalOrders} from "@/lib/infer-types";
import {Badge} from "@/components/ui/badge";
import {useRouter, useSearchParams} from "next/navigation";
import {cn} from "@/lib/utils";
import {useMemo} from "react";
import {weeklyChart} from "@/app/dashboard/analytics/weekly-chart";
import {ResponsiveContainer, BarChart, Bar, Tooltip} from "recharts";
import {monthlyChart} from "@/app/dashboard/analytics/monthly-chart";

export default function Earnings({totalOrders}: {totalOrders: TotalOrders[]}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const filter = searchParams.get("filter") || "week"

	const chartItems = totalOrders.map((order) => ({
		date: order.order.created!,
		revenue: order.order.total
	}))

	const activeChart = useMemo(() => {
		const weekly = weeklyChart(chartItems)
		if (filter === "week") {
			return weekly
		}
		const monthly = monthlyChart(chartItems)
		if (filter === "month") {
			return monthly
		}
	}, [filter])

	const activeTotal = useMemo(() => {
		if (filter === "month") {
			return monthlyChart(chartItems).reduce((acc, item) => acc + item.revenue, 0)
		}
		if (filter === "week") {
			return weeklyChart(chartItems).reduce((acc, item) => acc + item.revenue, 0)
		}
	}, [filter])

	return (
		<Card className="flex-1 shrink-0 h-full">
			<CardHeader>
				<CardTitle>Your Revenue: ${activeTotal?.toFixed(2)}</CardTitle>
				<CardDescription>Here are your recent earnings</CardDescription>
				<div className="flex items-center gap-2">
					<Badge
						className={cn("cursor-pointer", filter === "week" ? "bg-primary" : "bg-primary/50")}
						onClick={() => router.push("/dashboard/analytics/?filter=week", {scroll: false})}
					>
						This Week
					</Badge>
					<Badge
						className={cn("cursor-pointer", filter === "month" ? "bg-primary" : "bg-primary/50")}
						onClick={() => router.push("/dashboard/analytics/?filter=month", {scroll: false})}
					>
						This Month
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="h-96">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart data={activeChart}>
						<Tooltip content={(props) => (
							<div>
								{props.payload?.map((item) => (
									<div className="bg-primary py-2 px-4 rounded-md text-secondary" key={item.payload.date}>
										<p>Revenue: ${Number(item.value).toFixed(2)}</p>
										<p>{item.payload.date}</p>
									</div>
								))}
							</div>
						)} />
						<Bar dataKey="revenue" className="fill-primary" />
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	)
}