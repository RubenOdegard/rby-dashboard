"use client";

import { fetchDataFromDatabase } from "@/app/actions";
import { useEffect, useState } from "react";
import { useStore } from "@/stores/store";
import { capitalizeFirstLetter } from "@/lib/utils";
import { MainTabs } from "./main-tabs";
import { MainTabsSkeleton } from "./main-tabs-skeleton";

const ContentRenderer = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    urls,
    setUrls,
    toolCategories,
    setToolsMetadata,
    setToolCategories,
    setFailedUrls,
  } = useStore();

  // Function to fetch data from the database and update state
  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch URLs from the database
      const urlsData = await fetchDataFromDatabase();
      if (urlsData) {
        // Update the URLs state
        setUrls(urlsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch metadata for each URL and update state
  const fetchMetadata = async () => {
    if (!urls || urls.length === 0) {
      return;
    }

    const promises = urls.map(async (urlObject) => {
      // Fetch metadata for each URL
      try {
        const response = await fetch(
          `/api/fetchMetadata?url=${encodeURIComponent(urlObject.url)}`,
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch metadata for ${urlObject.url}`);
        }
        const data = await response.json();
        return { ...urlObject, ...data };
      } catch (error) {
        console.error("Error fetching metadata for", urlObject.url, ":", error);
        const prevUrls = useStore.getState().failedUrls;
        setFailedUrls([...prevUrls, urlObject.url]);
        return null;
      }
    });

    const metadata = await Promise.all(promises);

    // Filter out null values and update the metadata state
    const filteredMetadata = metadata.filter((item) => item !== null);
    setToolsMetadata(filteredMetadata);

    // Get unique categories and update the categories state
    const categories = Array.from(
      new Set(
        filteredMetadata.map((item) => capitalizeFirstLetter(item.category)),
      ),
    );
    setToolCategories(categories);
  };

  // fetch data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // fetch metadata when URLs change and not empty
  useEffect(() => {
    if (urls.length > 0) {
      fetchMetadata();
    }
  }, [urls]);

  // Render content based on loading state and error
  if (isLoading) {
    return <MainTabsSkeleton />;
  } else if (error !== null) {
    return <p className="mt-2 text-red-500">{error}</p>;
  } else {
    return <MainTabs toolCategories={toolCategories} />;
  }
};

export default ContentRenderer;
