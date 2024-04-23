"use client";

// TODO: Sort imports

import {
	addProjectUrlToDatabase,
	fetchProjectURLs,
} from "@/actions/project-actions";
import {
	capitalizeFirstLetter,
	getDomainName,
	getProjectIDFromURL,
	toastError,
	toastSuccess,
} from "@/lib/utils";
import { useStore } from "@/stores/store";
import { LinkIcon, SaveIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import ProjectTextSubtitle from "@/components/projects/project-text-subtitle";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SelectProjectUrl, SelectUrl } from "@/db/schema";

interface FilteredProjectURLsType {
	urls: SelectUrl;
	project_urls: SelectProjectUrl;
}

export const ProjectURLForm = () => {
	const {
		urls,
		selectedProject,
		projects,
		projectUrls,
		filterUnusedURLs,
		setFilterUnusedURLs,
	} = useStore();
	const [edit, setEdit] = useState<boolean>(false);
	const [selectedUrl, setSelectedUrl] = useState<string>("");
	const [showFullURL, setShowFullURL] = useState<boolean>(false);
	const [filteredProjectURLs, setFilteredProjectURLs] =
		useState<FilteredProjectURLsType[]>();

	const handleShowFullURL = () => {
		setShowFullURL((showFullURL) => !showFullURL);
		setShowFullURLLocalStorage(!showFullURL);
	};

	const setShowFullURLLocalStorage = (value: boolean) => {
		localStorage.setItem("showFullURL", value.toString());
	};

	const handleSelectURL = async (value: string) => {
		try {
			// Set local state
			if (value) {
				setSelectedUrl(value);
			}
			// fetch projectid from database
			const projectId = await getProjectIDFromURL(selectedProject, projects);
			if (projectId) {
				const fetchedUrls = await fetchProjectURLs(projectId);
				// Ensure fetchedUrls is not null before setting state
				if (fetchedUrls) {
					// Filter out any null values in the 'urls' property
					const filteredUrls = fetchedUrls.filter(
						(item) => item.urls !== null,
					) as FilteredProjectURLsType[];
					setFilteredProjectURLs(filteredUrls);
				}
			}
		} catch (error) {
			toastError("Project not found");
		}
		// Set edit state to change button disabled state
		setEdit(true);
	};

	const handleAddUrl = async (value: string) => {
		const UrlSchema = z.string().url();
		try {
			// Validate the URL
			const validatedUrl = UrlSchema.parse(value);
			// Check if the URL exists in global urls fetched from the database
			const url = urls.find((url) => url.url === validatedUrl);
			if (url) {
				// Get the ID of the selected project
				const projectId = await getProjectIDFromURL(selectedProject, projects);
				if (projectId) {
					// Add the URL to the database
					await addProjectUrlToDatabase(projectId, url.id);
					// Filter out the URL from the filtered URLs
					setFilterUnusedURLs(
						filterUnusedURLs.filter((url) => url.url !== validatedUrl),
					);
					toastSuccess("Successfully added URL to project");
					// Resets
					setSelectedUrl("");
					setEdit(false);
				} else {
					toastError("Error adding URL: Project ID not found");
				}
			} else {
				toastError("URL does not exist in the database");
			}
		} catch (error) {
			toastError("Error adding URL: " + error);
		}
	};

	const handleFilterUrls = () => {
		// Get the ID of the selected project
		const projectId = projects.find(
			(project) => project.project === selectedProject,
		)?.id;
		// Get the IDs of URLs associated with the selected project
		const projectUrlIds = projectUrls
			.filter((url) => url.projectId === projectId)
			.map((url) => url.urlId);
		// Filter out the URLs that are already connected to the selected project
		const unusedURLs = urls
			.filter((url) => !projectUrlIds.includes(url.id))
			.map(({ id, url, category, favorite, createdAt }) => ({
				id,
				url,
				category,
				favorite,
				createdAt: createdAt || "",
			}));
		setFilterUnusedURLs(unusedURLs);
	};

	useEffect(() => {
		handleFilterUrls();
		// Get the value from localStorage
		const showFullURLFromLocalStorage = localStorage.getItem("showFullURL");
		if (!showFullURLFromLocalStorage) {
			localStorage.setItem("showFullURL", JSON.stringify(showFullURL));
		} else {
			setShowFullURL(JSON.parse(showFullURLFromLocalStorage));
		}
	}, []);

	return (
		<div className="flex w-full flex-col">
			<div className="flex flex-col items-start sm:flex-row sm:items-center">
				<div className="flex items-center gap-2 pr-4">
					<LinkIcon size={18} />
					<ProjectTextSubtitle title="Add a new link" />
				</div>
				<div className="mt-1.5 flex items-center gap-2 sm:mt-0 sm:border-l sm:pl-4">
					<Checkbox
						id="showFullURL"
						checked={showFullURL}
						onCheckedChange={handleShowFullURL}
						className={`form-checkbox h-4 w-4`}
					/>
					<label
						htmlFor="newCategoryCheckbox"
						className={
							showFullURL
								? "text-sm text-yellow-400"
								: "" + "select-none text-sm text-muted-foreground/70"
						}
					>
						Show full URL
					</label>
				</div>
			</div>
			<div className="mt-3 flex flex-col gap-3 sm:flex-row sm:gap-4">
				<Select onValueChange={handleSelectURL} value={selectedUrl}>
					<SelectTrigger>
						<SelectValue placeholder="Select a URL" />
					</SelectTrigger>
					<SelectContent>
						{filterUnusedURLs &&
							filterUnusedURLs
								.sort((a, b) => a.category.localeCompare(b.category))
								.map((url: SelectUrl, index) => {
									return (
										<SelectItem key={index} value={url.url.toLowerCase()}>
											{showFullURL ? (
												<div>
													{url.url}
													<span className="hidden text-muted-foreground/70 sm:inline">
														{" "}
														- {url.category}
													</span>
												</div>
											) : (
												<div>
													{capitalizeFirstLetter(getDomainName(url.url))}
													<span className="hidden text-muted-foreground/70 sm:inline">
														{" "}
														- {url.category}
													</span>
												</div>
											)}
										</SelectItem>
									);
								})}
					</SelectContent>
				</Select>
				<Button
					onClick={() => handleAddUrl(selectedUrl)}
					variant="outline"
					className="flex w-24 gap-2"
					disabled={!edit}
				>
					Push
					<SaveIcon size={18} />
				</Button>
			</div>
		</div>
	);
};
