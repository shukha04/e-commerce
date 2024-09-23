"use client";

import {ReviewsWithUser} from "@/lib/infer-types";
import {Card, CardDescription, CardTitle} from "@/components/ui/card";
import Stars from "@/components/reviews/stars";
import {getReviewAverage} from "@/lib/review-average";
import {useMemo} from "react";
import { Progress } from "@/components/ui/progress"


export default function ReviewChart({reviews}: {reviews: ReviewsWithUser[]}) {

	const getRatingByStars = useMemo(() => {
		const ratingValues = Array.from({length: 5}, () => 0)
		const totalReviews = reviews.length
		reviews.forEach((review) => {
			const starIndex = review.rating - 1
			if (starIndex >= 0 && starIndex < 5) {
				ratingValues[starIndex]++
			}
		})

		return ratingValues.map((rating) => (rating/totalReviews) * 100)
	}, [reviews])

	const totalRating = getReviewAverage(reviews.map((review) => review.rating));
	return (
		<Card className="flex flex-col p-8 rounded-md gap-4">
			<div className="flex gap-2 flex-col">
				<CardTitle>Product Rating:</CardTitle>
				<CardDescription className="text-lg font-medium">
					{totalRating.toFixed(1)} stars
				</CardDescription>
			</div>
			{getRatingByStars.map((rating, i) => (
				<div key={i} className="flex gap-2 justify-between items-center">
					<p className="text-xs font-medium flex gap-1">
						{i + 1} <span>stars</span>
					</p>
					<Progress value={rating} />
				</div>
			))}
		</Card>
	)
}