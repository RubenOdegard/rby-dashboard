"use client";
import { deleteUrlFromDatabaseByUrl } from "@/actions/collection-url-action";
import { Button } from "@/components/ui/button";
import { useStore } from "@/stores/store";
import { XIcon } from "lucide-react";

export function Diagnostics() {
	const failedUrls = useStore((state) => state.failedUrls);

	if (failedUrls.length === 0) {
		return null;
	}

	const uniqueFailedUrls = Array.from(new Set(failedUrls));

	return (
		<div className="mb-4 mt-6 w-full max-w-md rounded-lg border p-6">
			<p className=" font-semibold text-red-500">Error when fetching URL&apos;s:</p>
			<ul className="mt-2">
				{uniqueFailedUrls.map((url) => (
					<div key={url} className="flex items-center gap-2">
						<Button
							variant="outline"
							size="manual"
							className="size-6 p-1"
							onClick={() => deleteUrlFromDatabaseByUrl(url)}
						>
							<XIcon size={12} className="" />
						</Button>
						<li className="truncate">{url}</li>
					</div>
				))}
			</ul>
		</div>
	);
}
