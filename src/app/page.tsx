"use client";
import { MainTabs } from "@/components/main-tabs";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Metadata } from "@/types/metadata";
import ToolsContent from "@/components/tools-content";
import ProjectsContent from "@/components/projects-content";

function MetadataFetcher({
  onDataLoaded,
  onCategoriesLoaded,
}: {
  onDataLoaded: (data: Metadata[]) => void;
  onCategoriesLoaded: (categories: string[]) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urls, setUrls] = useState([
    { url: "https://vercel.com", category: "hosting", language: null },
    { url: "https://docker.com", category: "infrastructure", language: null },
    { url: "https://railway.app", category: "hosting", language: null },
    { url: "https://cursor.io", category: "infrastructure", language: null },
    { url: "https://supabase.com", category: "infrastructure", language: null },
    { url: "https://sanity.io", category: "CMS", language: null },
  ]);

  const fetchMetadata = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const promises = urls.map(async ({ url, category }) => {
        const response = await fetch(
          `/api/fetchMetadata?url=${encodeURIComponent(url)}`,
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch metadata for ${url}`);
        }
        const data = await response.json();
        return { ...data, category };
      });

      const metadata = await Promise.all(promises);
      onDataLoaded(metadata);
      const categories = Array.from(
        new Set(metadata.map((item) => capitalizeFirstLetter(item.category))),
      );
      onCategoriesLoaded(categories);
    } catch (error) {
      console.error("Error fetching metadata:", error);
      setError("Failed to fetch metadata. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch metadata only once on component mount
  useEffect(() => {
    fetchMetadata();
  }, []);

  return (
    <div>
      <button
        className="mt-8 rounded-md border px-4 py-1.5 text-white"
        onClick={fetchMetadata}
        disabled={isLoading}
      >
        {isLoading ? "Fetching Metadata..." : "Fetch Metadata"}
      </button>

      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
}

export default function Home() {
  const [toolsMetadata, setToolsMetadata] = useState<Metadata[]>([]);
  const [toolCategories, setToolCategories] = useState<string[]>([]);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-semibold tracking-wide">
        Developer Dashboard
      </h1>
      <MainTabs
        ToolsContent={<ToolsContent metadata={toolsMetadata} />}
        ProjectsContent={<ProjectsContent />}
        toolCategories={toolCategories}
      />
      <MetadataFetcher
        onDataLoaded={setToolsMetadata}
        onCategoriesLoaded={setToolCategories}
      />
    </main>
  );
}
