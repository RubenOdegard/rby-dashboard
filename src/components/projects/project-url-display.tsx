"use client";

import {
	deleteProjectUrlFromDatabaseByURL,
	fetchProjectURLs,
} from "@/actions/project-actions";
import { getProjectIDFromURL, toastError, toastSuccess } from "@/lib/utils";
import { useStore } from "@/stores/store";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { SelectProjectUrl, SelectUrl } from "@/db/schema";
import { XIcon } from "lucide-react";

interface FilteredProjectURLsType {
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
		</div>
	);
};

export default ProjectUrlDisplay;
