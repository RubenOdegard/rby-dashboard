"use client";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Metadata } from "@/types/metadata";
import { Urls } from "@/types/urls";
import { useStore } from "@/stores/store";
import { Diagnostics } from "@/components/diagnostics";
import ContentRenderer from "@/components/content-renderer";

export default function Home() {
  const [toolsMetadata, setToolsMetadata] = useState<Metadata[]>([]);
  const [toolCategories, setToolCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const urls: Urls[] = [
    {
      url: "https://vercel.com",
      category: "hosting",
      projects: null,
      favorite: true,
    },
    {
      url: "https://docker.com",
      category: "infrastructure",
      projects: null,
      favorite: true,
    },
    {
      url: "https://railway.app",
      category: "hosting",
      projects: null,
      favorite: false,
    },
    {
      url: "https://cursor.io",
      category: "infrastructure",
      projects: null,
      favorite: false,
    },
    {
      url: "https://supabase.com",
      category: "infrastructure",
      projects: null,
      favorite: false,
    },
    {
      url: "https://sanity.io",
      category: "CMS",
      projects: null,
      favorite: false,
    },
  ];

  const fetchData = async () => {
    try {
      // Initate loading to true and error to null on each function run
      setIsLoading(true);
      setError(null);

      const promises = urls.map(async ({ url, category, favorite }) => {
        try {
          // Set a timeout of 5 seconds
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          const response = await fetch(
            `/api/fetchMetadata?url=${encodeURIComponent(url)}`,
            {
              signal: controller.signal,
            },
          );
          clearTimeout(timeoutId); // Clear the timeout if request completes before timeout

          // Throw error if response is not ok
          if (!response.ok) {
            throw new Error(`Failed to fetch metadata for ${url}`);
          }
          // Parse response as JSON and return metadata
          const data = await response.json();
          return { ...data, category, favorite };
        } catch (error) {
          // Handle error, and add failed urls to global failedUrls
          console.error("Error fetching metadata for", url, ":", error);
          const prevUrls: string[] = useStore.getState().failedUrls;
          useStore.getState().setFailedUrls([...prevUrls, url]);
          return null;
        }
      });

      // Wait for all promises to resolve
      const metadata = await Promise.all(promises);
      // Filter out null values and add to global toolsMetadata
      const filteredMetadata = metadata.filter((item) => item !== null);
      setToolsMetadata(filteredMetadata);
      // Get unique categories and add to global toolCategories
      const categories = Array.from(
        new Set(
          filteredMetadata.map((item) => capitalizeFirstLetter(item.category)),
        ),
      );
      setToolCategories(categories);
    } catch (error) {
      // Handle error
      console.error("Error fetching metadata:", error);
      setError("Failed to fetch metadata. Please try again later.");
    } finally {
      // Finally, set isLoading to false
      setIsLoading(false);
    }
  };

  // Initiate fetchData on component mount
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="pb-12 text-4xl font-semibold tracking-wide">
        Developer Dashboard
      </h1>
      <Diagnostics />
      <ContentRenderer
        isLoading={isLoading}
        error={error}
        toolsMetadata={toolsMetadata}
        toolCategories={toolCategories}
      />
    </main>
  );
}
