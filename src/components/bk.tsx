"use client";

import { MainTabs } from "./main-tabs";
import { MainTabsSkeleton } from "./main-tabs-skeleton";
import ProjectsContent from "./projects-content";
import ToolsContent from "./tools-content";
import { useEffect, useState } from "react";
import { useStore } from "@/stores/store";
import { capitalizeFirstLetter } from "@/lib/utils";
import { fetchDataFromDatabase } from "@/app/actions";

const ContentRenderer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    urls,
    setUrls,
    toolsMetadata,
    toolCategories,
    setToolsMetadata,
    setToolCategories,
    setFailedUrls,
  } = useStore();

  const fetchAllURLs = async () => {
    try {
      const res = await fetchDataFromDatabase();
      if (res) {
        // Global state
        setUrls(res);
      }
    } catch (error) {
      console.error("Error fetching URLs:", error);
      // Handle error
    }
  };

  const fetchMetadata = async () => {
    try {
      // Initiate loading to true and error to null on each function run
      setIsLoading(true);
      setError(null);

      // Fetch metadata for each url, using internal api route
      const promises = urls.map(async ({ id, url, category, favorite }) => {
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
          // Clear the timeout if request completes before timeout
          clearTimeout(timeoutId);
          // Throw error if response is not ok
          if (!response.ok) {
            throw new Error(`Failed to fetch metadata for ${url}`);
          }
          // Parse response as JSON and return metadata
          const data = await response.json();
          return { ...urls, ...data };
        } catch (error) {
          // Handle error, and add failed urls to global failedUrls
          console.error("Error fetching metadata for", url, ":", error);
          const prevUrls = useStore.getState().failedUrls;
          setFailedUrls([...prevUrls, url]);
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

  // Initiate data fetch on component mount
  useEffect(() => {
    fetchAllURLs();
  }, []);

  // Fetch metadata whenever urls change
  useEffect(() => {
    fetchMetadata();
  }, [urls]);

  // Conditionally render Content, Error or Skeleton
  // Do not need to use switch statement, but its easier to read than a triple turnary
  switch (true) {
    case isLoading:
      return <MainTabsSkeleton />;
    case error !== null:
      return <p className="mt-2 text-red-500">{error}</p>;
    default:
      return (
        <MainTabs
          ToolsContent={<ToolsContent metadata={toolsMetadata} />}
          ProjectsContent={<ProjectsContent />}
          toolCategories={toolCategories}
        />
      );
  }
};
export default ContentRenderer;
