import { useStore } from "@/stores/store";

export function Diagnostics() {
  const failedUrls = useStore((state) => state.failedUrls);

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
