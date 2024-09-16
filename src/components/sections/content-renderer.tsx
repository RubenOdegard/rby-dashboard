"use client";

import { fetchUrlDataFromDatabase } from "@/actions/collection-url-action";
import { fetchProjectDataFromDatabase, fetchProjectUrlsFromDatabase } from "@/actions/project-actions";
import { Loader } from "@/components/loader";
import { MainTabs } from "@/components/sections/main-tabs";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useStore } from "@/stores/store";
import { useEffect, useState } from "react";

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

	const fetchAllData = async () => {
		try {
			setIsLoading(true);
			setError(null);

			const urlsData = await fetchUrlDataFromDatabase();
			if (urlsData) {
				setUrls(urlsData);
			}

			const projectsData = await fetchProjectDataFromDatabase();
			if (projectsData) {
				setProjects(projectsData);
			}

			const projectUrlsData = await fetchProjectUrlsFromDatabase();
			if (projectUrlsData) {
				setProjectUrls(projectUrlsData);
			}
		} catch (error) {
			setIsLoading(false);
			setError("Failed to fetch data. Please try again later.");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchMetadata = async () => {
		if (!urls || urls.length === 0) {
			setIsLoading(false);
			return;
		}

		setIsMetaDataLoading(false);
		setError(null);

		const promises = urls.map(async (urlObject) => {
			try {
				const response = await fetch(`/api/fetchMetadata?url=${encodeURIComponent(urlObject.url)}`);
				if (!response.ok) {
					throw new Error(`Failed to fetch metadata for ${urlObject.url}`);
				}
				const data = await response.json();
				return { ...urlObject, ...data };
			} catch (error) {
				setIsMetaDataLoading(false);
				setError("Failed to fetch metadata. Please try again later.");
				console.error(error);
				const prevUrls = useStore.getState().failedUrls;
				setFailedUrls([...prevUrls, urlObject.url]);
				return null;
			}
		});

		const metadata = await Promise.all(promises);
		const filteredMetadata = metadata.filter((item) => item !== null);
		const categories = Array.from(new Set(filteredMetadata.map((item) => capitalizeFirstLetter(item.category))));

		setCollectionsMetadata(filteredMetadata);
		setCollectionCategories(categories);
		setIsMetaDataLoading(false);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		fetchAllData();
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (urls.length > 0) {
			fetchMetadata();
		}
	}, [urls]);

	if (isLoading || isMedataLoading) {
		return <Loader />;
		// } else if (error !== null) {
		// 	return <p className="mt-2 text-red-500">{error}</p>;
	}

	return <MainTabs collectionCategories={collectionCategories} projects={projects} />;
};

export default ContentRenderer;
