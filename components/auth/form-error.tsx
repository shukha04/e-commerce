import {AlertCircle} from "lucide-react";

export const FormError = ({message}: {message?: string}) => {
	if (!message) return null;

	return (
		<div className="p-3 rounded-lg flex gap-4 items-center bg-destructive/15 text-destructive border-destructive border mt-4 text-xs font-medium">
			<AlertCircle className="w-4 h-4" />
			<p>{message}</p>
		</div>
	);
}