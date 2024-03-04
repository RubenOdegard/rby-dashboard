"use client";
import { useStore } from "@/stores/store";

// TODO: Implement a function to delete the failred urls from database.
// Maybe a wipe-all button, or selectivly delete failed urls.

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
    <div className="w-full max-w-sm py-4">
      <p className="text-red-500">Failed URLs:</p>
      <ul>
        {uniqueFailedUrls.map((url, index) => (
          <li key={index}>{url}</li>
        ))}
      </ul>
    </div>
  );
}
