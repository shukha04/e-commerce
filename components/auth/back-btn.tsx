"use client"

import {Button} from "@/components/ui/button";
import Link from "next/link";

export const BackButton = ({href, label}: {href: string, label: string}) => {
	return (
		<div className="w-full">
			<span className="text-muted-foreground text-center block text-sm">or</span>
			<Button className="font-medium w-full" asChild variant="link">
				<Link href={href} aria-label={label}>
					{label}
				</Link>
			</Button>
		</div>
	);
};