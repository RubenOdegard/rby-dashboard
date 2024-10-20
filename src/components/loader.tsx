import { LoaderIcon } from "lucide-react";

export function Loader() {
	return (
		<div className="animate-pulse">
			<LoaderIcon className="mt-2 animate-spin text-yellow-400" />
		</div>
	);
}
