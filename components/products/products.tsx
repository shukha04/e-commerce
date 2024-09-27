"use client";

import {VariantsWithProduct} from "@/lib/infer-types";
import Link from "next/link";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import formatPrice from "@/lib/format-price";
import {useMemo} from "react";
import {useSearchParams} from "next/navigation";

type ProductTypes = {
	variants: VariantsWithProduct[]
}

export default function Products({variants}: ProductTypes) {
	const searchParams = useSearchParams();
	const tag = searchParams.get("tag");

	const filtered = useMemo(() => {
		if (tag && variants) {
			return variants.filter((variant) => variant.variantTags.some((variantTag) => variantTag.tag === tag));
		}

		return variants
	}, [tag])

	return (
		<main className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
			{filtered.map((variant) => (
				<Link
					key={variant.id}
					className="py-2"
					href={`/products/${variant.id}?id=${variant.id}&productID=${variant.productID}&price=${variant.product.price}&title=${variant.product.title}&type=${variant.productType}&image=${variant.variantImages[0].url}`}
				>
					<Image className="rounded-md pb-2" src={variant.variantImages[0].url} width={720} height={480} alt={variant.product.title} loading="lazy" />
					<div className="flex justify-between">
						<div className="font-medium">
							<h2>{variant.product.title}</h2>
							<p className="text-sm text-muted-foreground">{variant.productType}</p>
						</div>
						<div>
							<Badge className="text-sm" variant="secondary">
								{formatPrice(variant.product.price)}
							</Badge>
						</div>
					</div>
				</Link>
			))}
		</main>
	)
}