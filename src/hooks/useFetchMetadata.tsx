"use client";

import { useEffect, useState } from "react";

interface FetchResult {
	data: any;
	isLoading: boolean;
	error: string | null;
}

const useFetchMetaDataFromUrl = (url: string): FetchResult => {
	const [data, setData] = useState<any>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!url) {
			setIsLoading(false);
			setError("Invalid URL");
			return;
		}

		const fetchData = async () => {
			try {
				setIsLoading(true);
				setError(null);

				const response = await fetch(`/api/fetchMetadata?url=${encodeURIComponent(url)}`);
				if (!response.ok) {
					throw new Error(`Failed to fetch data from URL: ${url}`);
				}

				const json = await response.json();
				setData(json);
			} catch (error: any) {
				setError(error.message || "Error fetching data");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [url]);

	return { data, isLoading, error };
};

export default useFetchMetaDataFromUrl;
