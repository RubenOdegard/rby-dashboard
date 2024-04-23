"use client";
import { useStore } from "@/stores/store";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteURLFromDatabaseByURL } from "@/actions/collection-url-action";

export function Diagnostics() {
	// Get failedUrls from Zustand store
	const failedUrls = useStore((state) => state.failedUrls);
	// Check if failedUrls is empty
	if (failedUrls.length === 0) {
		return null;
	}
	// Filter unique URLs using a Set
	const uniqueFailedUrls = Array.from(new Set(failedUrls));

	return (
		<div className="mb-4 mt-6 w-full max-w-md rounded-lg border p-6">
			<p className=" font-semibold text-red-500">
				Error when fetching URL&apos;s:
			</p>
			<ul className="mt-2">
				{uniqueFailedUrls.map((url, index) => (
					<div key={index} className="flex items-center gap-2">
						<Button
							variant="outline"
							size="manual"
							className="size-6 p-1"
							onClick={() => deleteURLFromDatabaseByURL(url)}
						>
							<XIcon size={12} className="" />
						</Button>
						<li key={index} className="truncate">
							{url}
						</li>
					</div>
				))}
			</ul>
		</div>
	);
}
