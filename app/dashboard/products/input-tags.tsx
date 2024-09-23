"use client";

import {Input, InputProps} from "@/components/ui/input";
import {Dispatch, forwardRef, SetStateAction, useState} from "react";
import {useFormContext} from "react-hook-form";
import {cn} from "@/lib/utils";
import {AnimatePresence, motion} from "framer-motion";
import {Badge} from "@/components/ui/badge";
import {X} from "lucide-react";

type InputTagsProps = InputProps & {
	value: string[],
	onChange: Dispatch<SetStateAction<string[]>>
}

export const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(({onChange, value, ...props}, ref) => {
	const [pendingDataPoint, setPendingDataPoint] = useState<string>("")
	const [focused, setFocused] = useState<boolean>(false)

	function addPendingDataPoint() {
		if (pendingDataPoint) {
			const newDataPoint = new Set([...value, pendingDataPoint]);
			onChange(Array.from(newDataPoint));
			setPendingDataPoint("")
		}
	}
	const {setFocus} = useFormContext();

	return (
		<div
			className={cn("cursor-text flex min-h-10 w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", focused ? "ring-offset-2 outline-none ring-ring ring-2" : "ring-offset-0 outline-none ring-ring ring-0")}
			onClick={() => setFocus("tags")}
		>
			<motion.div className="rounded-md min-h-[2.5rem] p-2 flex gap-2 flex-wrap items-center">
				<AnimatePresence>
					{value.map((tag) => (
						<motion.div key={tag} animate={{scale: 1}} initial={{scale: 0}} exit={{scale: 0}}>
							<Badge variant="secondary" className="pr-0.5 text-wrap">
								<span>{tag}</span>
								<button onClick={() => onChange(value.filter((i) => i !== tag))}>
									<X className="w-4 h-4 p-0.5 ml-2 bg-primary/10 rounded-full" />
								</button>
							</Badge>
						</motion.div>
					))}
				</AnimatePresence>
				<div className="flex">
					<Input
						className="focus-visible:border-transparent border-transparent focus-visible:ring-0 focus-visible:ring-offset-0 h-1"
						placeholder="Add tags"
						value={pendingDataPoint}
						onFocus={() => setFocused(true)}
						onBlurCapture={() => setFocused(false)}
						onChange={(e) => setPendingDataPoint(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault()
								addPendingDataPoint()
							}
							if (e.key === "Backspace" && !pendingDataPoint && value.length > 0) {
								e.preventDefault();
								const newValue = [...value];
								newValue.pop();
								onChange(newValue);
							}
						}}
						name="tags"
						{...props}
					/>
				</div>
			</motion.div>
		</div>
	)
})

InputTags.displayName = "InputTags"