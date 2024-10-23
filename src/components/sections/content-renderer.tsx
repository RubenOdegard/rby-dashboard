"use client";

import { fetchUrlDataFromDatabase } from "@/actions/collection-url-action";
import { fetchProjectDataFromDatabase, fetchProjectUrlsFromDatabase } from "@/actions/project-actions";
import { Loader } from "@/components/loader";
import { MainTabs } from "@/components/sections/main-tabs";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useStore } from "@/stores/store";
import type { ProjectUrls } from "@/types/types";
import { useCallback, useEffect, useState } from "react";

const ContentRenderer = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isMedataLoading, setIsMetaDataLoading] = useState(false);
	const [_error, setError] = useState<string | null>(null);
	const {
		urls,
		setUrls,
		collectionCategories,
		setCollectionsMetadata,
		setCollectionCategories,
		setFailedUrls,
		projects,
		setProjects,
		setProjectUrls,
	} = useStore();

	const fetchAllData = useCallback(async () => {
		try {
			// Set state
			setIsLoading(true);
			setError(null);

			// Fetch urls and set state
			const urlsData = await fetchUrlDataFromDatabase();
			if (urlsData) {
				setUrls(urlsData);
			}

			// Fetch projects and set state
			const projectsData = await fetchProjectDataFromDatabase();
			if (projectsData) {
				setProjects(projectsData);
			}

			// Fetch project urls and set state
			const projectUrlsData = await fetchProjectUrlsFromDatabase();
			if (projectUrlsData) {
				setProjectUrls(projectUrlsData as ProjectUrls[]);
			}
		} catch (error) {
			setIsLoading(false);
			setError("Failed to fetch data. Please try again later.");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}, [setUrls, setProjects, setProjectUrls]);

	const fetchMetadata = useCallback(async () => {
		if (!urls || urls.length === 0) {
			setIsLoading(false);
			return;
		}

		// Reset state
		setIsMetaDataLoading(false);
		setError(null);

		const promises = urls.map(async (urlObject) => {
			try {
				// Fetch metadata
				const response = await fetch(`/api/fetchMetadata?url=${encodeURIComponent(urlObject.url)}`);
				if (!response.ok) {
					throw new Error(`Failed to fetch metadata for ${urlObject.url}`);
				}
				const data = await response.json();
				// Add metadata to state
				return { ...urlObject, ...data };
			} catch (error) {
				setIsMetaDataLoading(false);
				setError("Failed to fetch metadata. Please try again later.");
				console.error(error);
				// Get previous failed urls
				const prevUrls = useStore.getState().failedUrls;
				// Add failed url to state
				setFailedUrls([...prevUrls, urlObject.url]);
				return null;
			}
		});

		// Wait for all promises to resolve
		const metadata = await Promise.all(promises);
		// Filter out null values
		const filteredMetadata = metadata.filter((item) => item !== null);
		// Sort the metadata
		const categories = Array.from(new Set(filteredMetadata.map((item) => capitalizeFirstLetter(item.category))));

		// Set state
		setCollectionsMetadata(filteredMetadata);
		setCollectionCategories(categories);
		setIsMetaDataLoading(false);
	}, [setCollectionsMetadata, setCollectionCategories, setFailedUrls, urls]);

	// Fetch data on initial render
	useEffect(() => {
		fetchAllData();
	}, [fetchAllData]);

	useEffect(() => {
		if (urls.length > 0) {
			fetchMetadata();
		}
	}, [urls, fetchMetadata]);

	// Return loader is data is loading
	if (isLoading || isMedataLoading) {
		return <Loader />;
	}

	return (
		<>
			{_error && <p className="mt-2 text-red-500">{_error}</p>}
			<MainTabs collectionCategories={collectionCategories} projects={projects} />
		</>
	);
};

export default ContentRenderer;
