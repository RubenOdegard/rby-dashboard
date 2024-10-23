"use client";
import { deleteUrlFromDatabaseByUrl } from "@/actions/collection-url-action";
import { Button } from "@/components/ui/button";
import { toastError, toastSuccess } from "@/lib/utils";
import { useStore } from "@/stores/store";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function Diagnostics() {
	const setFailedUrls = useStore((state) => state.setFailedUrls);
	const failedUrls = useStore((state) => state.failedUrls);
	const [uniqueFailedUrls, setUniqueFailedUrls] = useState<string[]>([]);

	useEffect(() => {
		// Update unique failed URLs only when `failedUrls` changes
		const uniqueUrls = Array.from(new Set(failedUrls));
		setUniqueFailedUrls(uniqueUrls);
	}, [failedUrls]);

	// If there are no failed URLs, do not render the component
	if (uniqueFailedUrls.length === 0) {
		return null;
	}

	const handleDelete = async (urlToDelete: string) => {
		try {
			// Delete url from database
			await deleteUrlFromDatabaseByUrl(urlToDelete);

			// Remove url from state
			const newUrls = failedUrls.filter((url) => url !== urlToDelete);

			// Update state
			setFailedUrls(newUrls);

			toastSuccess(`Deleted ${urlToDelete} from the database.`);
		} catch (error) {
			toastError(`Failed to delete ${urlToDelete} from the database. Error: ${error}`);
		}
	};

	return (
		<div className=" flex w-full max-w-md flex-col rounded-lg border p-6">
			<p className="font-semibold text-red-500">{failedUrls.length > 1 ? "Failed to fetch:" : null}</p>
			<ul className="mt-2">
				{uniqueFailedUrls.map((url) => (
					<li key={url} className="mb-2 flex items-center gap-2">
						<Button
							variant="outline"
							size="manual"
							className="size-6 p-1"
							onClick={() => handleDelete(url)}
						>
							<XIcon size={12} />
						</Button>
						<span className="truncate">{url}</span>
					</li>
				))}
			</ul>
		</div>
	);
}
