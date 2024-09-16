"use client";

import { addProjectUrlToDatabase, fetchProjectUrls } from "@/actions/project-actions";
import ProjectTextSubtitle from "@/components/projects/project-text-subtitle";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SelectProjectUrl, SelectUrl } from "@/db/schema";
import { capitalizeFirstLetter, getDomainName, getProjectIdFromUrl, toastError, toastSuccess } from "@/lib/utils";
import { useStore } from "@/stores/store";
import { LinkIcon, SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

interface FilteredProjectUrLsType {
	urls: SelectUrl;
	projectUrls: SelectProjectUrl;
}

export const ProjectUrlForm = () => {
	const { urls, selectedProject, projects, projectUrls, filterUnusedUrls, setFilterUnusedUrls } = useStore();
	const [edit, setEdit] = useState<boolean>(false);
	const [selectedUrl, setSelectedUrl] = useState<string>("");
	const [showFullUrl, setShowFullUrl] = useState<boolean>(false);
	const [_filteredProjectUrLs, setFilteredProjectUrLs] = useState<FilteredProjectUrLsType[]>();

	const handleShowFullUrl = () => {
		setShowFullUrl((showFullUrl) => !showFullUrl);
		localStorage.setItem("showFullUrl", (!showFullUrl).toString());
	};

	const handleSelectUrl = async (value: string) => {
		try {
			if (value) {
				setSelectedUrl(value);
			}

			const projectId = await getProjectIdFromUrl(selectedProject, projects);
			if (projectId) {
				const fetchedUrls = await fetchProjectUrls(projectId);

				if (Array.isArray(fetchedUrls)) {
					const filteredUrls = fetchedUrls.filter((item: SelectUrl) => item.url !== null);
					setFilteredProjectUrLs(filteredUrls as FilteredProjectUrLsType[]);
				}
			}
		} catch (error) {
			toastError("Project not found");
			console.error(error);
		}

		setEdit(true);
	};

	const handleAddUrl = async (value: string) => {
		const UrlSchema = z.string().url();
		try {
			const validatedUrl = UrlSchema.parse(value);
			const url = urls.find((url) => url.url === validatedUrl);
			if (url) {
				const projectId = await getProjectIdFromUrl(selectedProject, projects);
				if (projectId) {
					await addProjectUrlToDatabase(projectId, url.id);
					setFilterUnusedUrls(filterUnusedUrls.filter((url) => url.url !== validatedUrl));
					toastSuccess("Successfully added URL to project");
					setSelectedUrl("");
					setEdit(false);
				} else {
					toastError("Error adding URL: Project ID not found");
				}
			} else {
				toastError("URL does not exist in the database");
			}
		} catch (error) {
			toastError(`Error adding URL: ${error}`);
		}
	};

	const handleFilterUrls = () => {
		const projectId = projects.find((project) => project.project === selectedProject)?.id;
		const projectUrlIds = projectUrls.filter((url) => url.projectId === projectId).map((url) => url.urlId);
		const unusedUrLs = urls
			.filter((url) => !projectUrlIds.includes(url.id))
			.map(({ id, url, category, favorite, createdAt }) => ({
				id,
				url,
				category,
				favorite,
				createdAt: createdAt || "",
				owner: "",
			}));

		setFilterUnusedUrls(unusedUrLs);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <Needs a rewrite to remove biome-ignore and prevent infinite loop>
	useEffect(() => {
		handleFilterUrls();
		const showFullUrlFromLocalStorage = localStorage.getItem("showFullUrl");
		if (showFullUrlFromLocalStorage) {
			setShowFullUrl(JSON.parse(showFullUrlFromLocalStorage));
		} else {
			localStorage.setItem("showFullUrl", JSON.stringify(showFullUrl));
		}
	}, [showFullUrl]);

	return (
		<div className="flex w-full flex-col">
			<div className="flex flex-col items-start sm:flex-row sm:items-center">
				<div className="flex items-center gap-2 pr-4">
					<LinkIcon size={18} />
					<ProjectTextSubtitle title="Add a new link" />
				</div>
				<div className="mt-1.5 flex items-center gap-2 sm:mt-0 sm:border-l sm:pl-4">
					<Checkbox
						id="showFullUrl"
						checked={showFullUrl}
						onCheckedChange={handleShowFullUrl}
						className={"form-checkbox h-4 w-4"}
					/>
					<label
						htmlFor="newCategoryCheckbox"
						className={
							showFullUrl
								? "text-sm text-yellow-400"
								: "" + "select-none text-sm text-muted-foreground/70"
						}
					>
						Show full URL
					</label>
				</div>
			</div>
			<div className="mt-3 flex flex-col gap-3 sm:flex-row sm:gap-4">
				<Select onValueChange={handleSelectUrl} value={selectedUrl}>
					<SelectTrigger>
						<SelectValue placeholder="Select a URL" />
					</SelectTrigger>
					<SelectContent>
						{filterUnusedUrls
							?.sort((a, b) => a.category.localeCompare(b.category))
							.map((url: SelectUrl) => {
								return (
									<SelectItem key={url.id} value={url.url.toLowerCase()}>
										{showFullUrl ? (
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
