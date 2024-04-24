"use client";

// TODO: Sort imports

import {
	deleteProjectUrlFromDatabaseByURL,
	fetchProjectURLs,
} from "@/actions/project-actions";
import { getProjectIDFromURL, toastError, toastSuccess } from "@/lib/utils";
import { useStore } from "@/stores/store";
import { useEffect, useRef, useState } from "react";
import autoAnimate from "@formkit/auto-animate";

import { Button } from "@/components/ui/button";
import { SelectProjectUrl, SelectUrl } from "@/db/schema";
import { FolderIcon, XIcon } from "lucide-react";
import TextDomain from "../collections/text-domain";
import ImageWithLink from "../collections/image-with-link";
import TextDescription from "../collections/text-description";
import TextTitle from "../collections/text-title";
import { Metadata } from "@/types/metadata";

interface FilteredProjectURLsType {
	urls: SelectUrl;
	project_urls: SelectProjectUrl;
}

interface MetadataModified extends Metadata {
	urls: SelectUrl;
	project_urls: SelectProjectUrl;
}

const ProjectUrlDisplay = () => {
	const {
		urls,
		selectedProject,
		projects,
		filterUnusedURLs,
		setFilterUnusedURLs,
	} = useStore();
	const [filteredProjectURLs, setFilteredProjectURLs] =
		useState<FilteredProjectURLsType[]>();
	const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);
	const [metadata, setMetadata] = useState<MetadataModified[]>([]);

	const handleImageHover = (id: number) => {
		setHoveredImageId(id);
	};

	const handleImageLeave = () => {
		setHoveredImageId(null);
	};

	const handleDeleteProjectUrl = async (project: string, urlID: number) => {
		const projectId = projects.find((item) => item.project === project)?.id;

		if (!projectId) {
			toastError("Project not found");
			return;
		}

		try {
			await deleteProjectUrlFromDatabaseByURL(projectId, urlID);
			// Find the corresponding URL in the global URLs list
			const deletedUrl = urls.find((url) => url.id === urlID);

			if (deletedUrl) {
				const safeDeletedUrl = {
					...deletedUrl,
					createdAt: deletedUrl.createdAt || new Date().toString(),
				};
				setFilterUnusedURLs([...filterUnusedURLs, safeDeletedUrl]);
			}
			toastSuccess("Successfully deleted URL from project");
		} catch (error) {
			toastError(`Error deleting ${urlID}: ${error}`);
		}
	};

	const fetchMetadata = async () => {
		if (!filteredProjectURLs || filteredProjectURLs.length === 0) {
			return;
		}

		const promises = filteredProjectURLs.map(async (urlObject) => {
			try {
				const response = await fetch(
					`/api/fetchMetadata?url=${encodeURIComponent(urlObject.urls.url)}`,
				);
				if (!response.ok) {
					throw new Error(`Failed to fetch metadata for ${urlObject.urls.url}`);
				}
				const data = await response.json();
				return { ...urlObject, ...data };
			} catch (error) {
				throw new Error(`Failed to fetch metadata: ${error}`);
			}
		});

		const metadata = await Promise.all(promises);
		const filteredMetadata = metadata.filter((item) => item !== null);
		setMetadata(filteredMetadata);
	};

	// Animations
	const parent = useRef(null);
	useEffect(() => {
		parent.current && autoAnimate(parent.current);
	}, [parent]);

	// Fetch metadata
	useEffect(() => {
		try {
			fetchMetadata();
		} catch (error) {
			throw new Error(`Error fetching metadata: ${error}`);
		}
	}, [filteredProjectURLs]);

	// Fetch filtered URLs
	useEffect(() => {
		const fetchFilteredUrls = async () => {
			const projectId = await getProjectIDFromURL(selectedProject, projects);
			if (projectId) {
				const fetchedUrls = await fetchProjectURLs(projectId);
				if (fetchedUrls) {
					const filteredUrls = fetchedUrls.filter(
						(item) => item.urls !== null,
					) as FilteredProjectURLsType[];
					setFilteredProjectURLs(filteredUrls);
				}
			} else {
				toastError("Error when loading URL's");
			}
		};
		fetchFilteredUrls();
	}, [filterUnusedURLs]);

	// TODO: Sort the metadata alphabetically by category into a new variablem, and render JSX from that.

	return (
		<div>
			<div className="mt-6 flex flex-col gap-2 overflow-scroll  border border-red-500 p-4">
				<span className="text-red-500">Debug</span>
				{JSON.stringify(filteredProjectURLs)}
			</div>
			{filteredProjectURLs && (
				<div className="mt-6 border p-4">
					{filteredProjectURLs.map((item, index) => {
						return (
							<div key={index} className="flex justify-between">
								<Button
									variant="outline"
									size="manual"
									className="size-6 p-1"
									onClick={() =>
										handleDeleteProjectUrl(selectedProject, item.urls.id)
									}
								>
									<XIcon size={12} className="" />
								</Button>
								<p>{item.urls.url}</p>
								<p>Category: {item.urls.category}</p>
							</div>
						);
					})}
				</div>
			)}
			<ul
				ref={parent}
				className="-mt-8 grid grid-cols-1 gap-x-8 md:grid-cols-2"
			>
				{metadata.map((item: MetadataModified) => (
					<div key={item.urls.id} className="mt-8 flex flex-col border-t">
						<div className="mt-6 flex items-center justify-between">
							<TextDomain
								domain={item.domain}
								isHovered={hoveredImageId === item.urls.id}
								handleMouseEnter={() => handleImageHover(item.urls.id)}
								handleMouseLeave={handleImageLeave}
							/>
						</div>
						<ImageWithLink
							imageUrl={item.imageUrl}
							domain={item.domain}
							id={item.urls.id}
							handleImageHover={handleImageHover}
							handleImageLeave={handleImageLeave}
							className="order-first mt-4"
						/>

						<TextTitle title={item.title} className="mt-4" />
						<TextDescription description={item.description} />
						<div className="flex">
							<div className="mt-4 flex text-yellow-200">
								{item.urls.category && (
									<span className="flex items-center gap-1.5">
										<FolderIcon className="size-4" /> {item.urls.category}
									</span>
								)}
							</div>
						</div>
					</div>
				))}
			</ul>
		</div>
	);
};

export default ProjectUrlDisplay;
