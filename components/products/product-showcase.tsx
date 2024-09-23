"use client";

import {
	Carousel, CarouselApi,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel"
import {VariantsWithImagesTags} from "@/lib/infer-types";
import {useState, useEffect} from "react";
import {useSearchParams} from "next/navigation";
import Image from "next/image";
import {cn} from "@/lib/utils";

export default function ProductShowcase({variants}: {variants: VariantsWithImagesTags[]}) {
	const [api, setApi] = useState<CarouselApi>();
	const [activeThumbnail, setActiveThumbnail] = useState([0]);
	const searchParams = useSearchParams();
	const selectedColor = searchParams.get("type" || variants[0].productType);

	const updatePreview = (index: number) => {
		api?.scrollTo(index)
	}

	useEffect(() => {
		if (!api) {
			return
		}

		api.on("slidesInView", (e) => {
			setActiveThumbnail(e.slidesInView())
		})
	}, [api])

	return (
		<Carousel setApi={setApi} opts={{loop: true}}>
			<CarouselContent>
				{variants.map((variant) => variant.productType === selectedColor && variant.variantImages.map((image) => {
					return (
						<CarouselItem key={image.url}>
							{image.url ? (
								<Image priority className="rounded-md" width={1280} height={720} alt={image.name} src={image.url} />
							) : null}
						</CarouselItem>
					)
				}))}
			</CarouselContent>
			<div className="flex overflow-clip py-2 gap-4">
				{variants.map((variant) => variant.productType === selectedColor && variant.variantImages.map((image, i) => {
					return (
						<div key={image.url}>
							{image.url ? (
								<Image
									priority
									className={cn(i === activeThumbnail[0] ? "opacity-100" : "opacity-50", "rounded-md transition-all duration-300 ease-in-out cursor-pointer hover:opacity-75")}
									width={72}
									height={48}
									alt={image.name}
									src={image.url}
									onClick={() => updatePreview(i)}
								/>
							) : null}
						</div>
					)
				}))}
			</div>
		</Carousel>

	)
}