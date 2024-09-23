import {auth} from "@/server/auth";
import {redirect} from "next/navigation";
import SettingsCard from "@/app/dashboard/settings/settings-card";

export default async function SettingsPage() {
	const session = await auth();

	if (!session) {
		redirect("/auth/login")
	} else {
		return (
			<SettingsCard session={session}/>
		)
	}
}