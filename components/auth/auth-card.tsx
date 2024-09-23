import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Socials from "@/components/auth/socials";
import {BackButton} from "@/components/auth/back-btn";
import {ReactNode} from "react";

type CardWrapperProps = {
	children: ReactNode
	cardTitle: string
	backBtnHref: string
	backBtnLbl: string
	showSocials?: boolean
}

export const AuthCard = ({
	children,
	cardTitle,
	backBtnHref,
	backBtnLbl,
	showSocials
}: CardWrapperProps) => {
	return (
		<Card className="max-w-xl mx-auto">
			<CardHeader>
				<CardTitle>{cardTitle}</CardTitle>
			</CardHeader>
			<CardContent>
				{children}
			</CardContent>
			{showSocials &&
				<CardFooter>
					<Socials />
				</CardFooter>
			}
			<CardFooter>
				<BackButton href={backBtnHref} label={backBtnLbl} />
			</CardFooter>
		</Card>
	);
};