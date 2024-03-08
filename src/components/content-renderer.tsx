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

	// Fetch initial data from database, to be used in fetchMetadata
	const fetchAllData = async () => {
		try {
			setIsLoading(true);
			setError(null);
			const urlsData = await fetchDataFromDatabase();
			if (urlsData) {
				setUrls(urlsData);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
			setError("Failed to fetch data. Please try again later.");
		} finally {
			// setIsLoading(false);
		}
	};

	// Fetch metadata from each url from the database, set global variables with the data returned
	const fetchMetadata = async () => {
		if (!urls || urls.length === 0) {
			return;
		}
		const promises = urls.map(async (urlObject) => {
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
		const filteredMetadata = metadata.filter((item) => item !== null);
		setToolsMetadata(filteredMetadata);
		const categories = Array.from(
			new Set(
				filteredMetadata.map((item) => capitalizeFirstLetter(item.category)),
			),
		);
		setToolCategories(categories);
		setIsLoading(false);
	};

	useEffect(() => {
		fetchAllData();
	}, []);

	useEffect(() => {
		if (urls.length > 0) {
			fetchMetadata();
		}
	}, [urls]);

	if (isLoading) {
		return <MainTabsSkeleton />;
	} else if (error !== null) {
		return <p className="mt-2 text-red-500">{error}</p>;
	} else {
		return <MainTabs toolCategories={toolCategories} />;
	}
};

export default ContentRenderer;
