"use client";

import {
    fetchProjectURLsFromDatabase,
    fetchProjectDataFromDatabase,
} from "@/actions/project-actions";
import { fetchURLDataFromDatabase } from "@/actions/collection-url-action";
import { useEffect, useState } from "react";
import { useStore } from "@/stores/store";
import { capitalizeFirstLetter } from "@/lib/utils";
import { MainTabs } from "./main-tabs";
import { Loader } from "./loader";

const ContentRenderer = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isMedataLoading, setIsMetaDataLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {
        urls,
        setUrls,
        toolCategories,
        setToolsMetadata,
        setToolCategories,
        setFailedUrls,
        projects,
        setProjects,
        setProjectUrls
    } = useStore();

    // Fetch initial data from database
    const fetchAllData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch urls
            const urlsData = await fetchURLDataFromDatabase();
            if (urlsData) {
                setUrls(urlsData);
            }

            // Fetch projects
            const projectsData = await fetchProjectDataFromDatabase();
            if (projectsData) {
                setProjects(projectsData);
            }

            // Fetch project-urls
            const projectUrlsData = await fetchProjectURLsFromDatabase();
            if (projectUrlsData) {
                setProjectUrls(projectUrlsData);
            }

        } catch (error) {
            setIsLoading(false);
            setError("Failed to fetch data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch metadata from each url from the database, set global variables with the data returned
    const fetchMetadata = async () => {
        // Early escape. Dont fetch medata if there is no urls
        if (!urls || urls.length === 0) {
            setIsLoading(false);
            return;
        }

        setIsMetaDataLoading(false);
        setError(null);

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
                setIsMetaDataLoading(false);
                setError("Failed to fetch metadata. Please try again later.");
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
        setIsMetaDataLoading(false);
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        if (urls.length > 0) {
            fetchMetadata();
        }
    }, [urls]);

    if (isLoading || isMedataLoading) {
        return <Loader />;
        // } else if (error !== null) {
        // 	return <p className="mt-2 text-red-500">{error}</p>;
    } else {
        return <MainTabs toolCategories={toolCategories} projects={projects} />;
    }
};

export default ContentRenderer;
