import {CheckCircle} from "lucide-react";

export const FormSuccess = ({message}: {message?: string}) => {
	if (!message) return null;

	return (
		<div className="p-3 rounded-lg flex gap-4 items-center border-teal-400 border bg-teal-400/15 text-teal-400 mt-4 text-xs font-medium">
			<CheckCircle className="w-4 h-4" />
			<p>{message}</p>
		</div>
	);
}