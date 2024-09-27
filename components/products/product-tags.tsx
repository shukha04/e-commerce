"use client";

import {Badge} from "@/components/ui/badge";
import {cn} from "@/lib/utils";
import {useRouter, useSearchParams} from "next/navigation";

export default function ProductTags() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const setFilter = (tag: string) => {
		if (tag) {
			router.push(`?tag=${tag}`);
		} else {
			router.push(`/`);
		}
	}
	const tag = searchParams.get("tag")

	return (
		<div className="flex gap-4 my-4 items-center justify-center">
			<Badge
				onClick={() => setFilter("")}
				className={cn("cursor-pointer bg-black hover:bg-black/75 hover:opacity-100", !tag ? "opacity-100" : "opacity-50")}
			>
				All
			</Badge>
			<Badge
				onClick={() => setFilter("blue")}
				className={cn("cursor-pointer bg-blue-500 hover:bg-blue-600 hover:opacity-100", tag === "blue" ? "opacity-100" : "opacity-50")}
			>
				Blue
			</Badge>
			<Badge
				onClick={() => setFilter("green")}
				className={cn("cursor-pointer bg-green-500 hover:bg-green-600 hover:opacity-100", tag === "green" ? "opacity-100" : "opacity-50")}
			>
				Green
			</Badge>
			<Badge
				onClick={() => setFilter("purple")}
				className={cn("cursor-pointer bg-purple-500 hover:bg-purple-600 hover:opacity-100", tag === "purple" ? "opacity-100" : "opacity-50")}
			>
				Purple
			</Badge>
		</div>
	)
}