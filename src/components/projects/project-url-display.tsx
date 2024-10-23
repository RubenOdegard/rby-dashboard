"use client";

import { deleteProjectUrlFromDatabaseByUrl, fetchProjectUrls } from "@/actions/project-actions";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { SelectProjectUrl, SelectUrl } from "@/db/schema";
import { getProjectIdFromUrl, toastError, toastSuccess } from "@/lib/utils";
import { useStore } from "@/stores/store";
import type { Metadata } from "@/types/metadata";
import autoAnimate from "@formkit/auto-animate";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { FolderIcon, InfoIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ImageWithLink from "../collections/image-with-link";
import TextDescription from "../collections/text-description";
import TextDomain from "../collections/text-domain";
import TextTitle from "../collections/text-title";

interface FilteredProjectUrlsType {
	urls: SelectUrl;
	projectUrls: SelectProjectUrl;
}

interface MetadataModified extends Metadata {
	urls: SelectUrl;
	projectUrls: SelectProjectUrl;
}

const ProjectUrlDisplay = () => {
	const { selectedProject, projects, filterUnusedUrls } = useStore();
	const [filteredProjectUrLs, setFilteredProjectUrLs] = useState<FilteredProjectUrlsType[]>();
	const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);
	const [metadata, setMetadata] = useState<MetadataModified[]>([]);
	const { user } = useKindeBrowserClient();
	const [open, setOpen] = useState(false);
	const [dialogUrlState, setDialogUrlState] = useState<MetadataModified | null>(null);

	const openDialog = (metadata: MetadataModified) => {
		setDialogUrlState(metadata);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleImageHover = (id: number) => {
		setHoveredImageId(id);
	};

	const handleImageLeave = () => {
		setHoveredImageId(null);
	};

	const handleDeleteProjectUrl = async (project: string, urlId: number) => {
		// Check if user is logged in
		if (!user) {
			toastError("Error deleting url.");
			return;
		}

		const projectId = projects.find((item) => item.project === project)?.id;

		// Early return if we cant find the project
		if (!projectId) {
			toastError("Project not found");
			return;
		}

		try {
			// Delete the URL from the database
			await deleteProjectUrlFromDatabaseByUrl(projectId, urlId);
			// Remove the deleted URL from the local state
			setFilteredProjectUrLs((prev) => (prev ? prev.filter((urlObject) => urlObject.urls.id !== urlId) : []));
			// Remove the deleted URL from the local state
			setMetadata((prev) => (prev ? prev.filter((meta) => meta.urls.id !== urlId) : []));
			// Show success toast
			toastSuccess("Successfully deleted URL from project");
		} catch (error) {
			toastError(`Error deleting ${urlId}: ${error}`);
		}
	};

	const fetchMetadata = async () => {
		// Early return  if we dont have any project URLs
		if (!filteredProjectUrLs || filteredProjectUrLs.length === 0) {
			return;
		}

		// Map over the project URLs and fetch the metadata
		const promises = filteredProjectUrLs.map(async (urlObject) => {
			try {
				const response = await fetch(`/api/fetchMetadata?url=${encodeURIComponent(urlObject.urls.url)}`);
				if (!response.ok) {
					throw new Error(`Failed to fetch metadata for ${urlObject.urls.url}`);
				}
				const data = await response.json();
				return { ...urlObject, ...data };
			} catch (error) {
				throw new Error(`Failed to fetch metadata: ${error}`);
			}
		});

		// Wait for all promises to resolve
		const metadata = await Promise.all(promises);
		// Filter out any null values
		const filteredMetadata = metadata.filter((item) => item !== null);
		// Sort the metadata
		filteredMetadata.sort((a, b) => {
			const categoryComparison = a.urls.category.localeCompare(b.urls.category);

			if (categoryComparison !== 0) {
				return categoryComparison;
			}

			// Sort by title
			return a.title.localeCompare(b.title);
		});
		setMetadata(filteredMetadata);
	};

	const parent = useRef(null);
	// biome-ignore lint/correctness/useExhaustiveDependencies: <Animation library is not exhaustive>
	useEffect(() => {
		parent.current && autoAnimate(parent.current);
	}, [parent]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <Manual overwrite, useEffect has to be dependent on filterUnusedURLs to correctly handle component remount>
	useEffect(() => {
		try {
			fetchMetadata();
		} catch (error) {
			throw new Error(`Error fetching metadata: ${error}`);
		}
	}, [filteredProjectUrLs]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <Manual overwrite, useEffect has to be dependent on filterUnusedURLs to correctly handle component remount>
	useEffect(() => {
		const fetchFilteredUrls = async () => {
			// Get project id
			const projectId = await getProjectIdFromUrl(selectedProject, projects);
			if (projectId) {
				// Fetch filtered urls
				const fetchedUrls = await fetchProjectUrls(projectId);
				if (fetchedUrls) {
					// Cast to unknown type before setting a new type after filtering
					const filteredUrls = fetchedUrls.filter(
						(item) => item.url !== null,
					) as unknown as FilteredProjectUrlsType[];
					// Set state
					setFilteredProjectUrLs(filteredUrls);
				}
			} else {
				toastError("Error when loading URL's");
			}
		};
		// call internal function
		fetchFilteredUrls();
	}, [filterUnusedUrls]);

	return (
		<div>
			{/* Information text if there is no urls tied to a project. */}
			{filteredProjectUrLs && filteredProjectUrLs.length < 1 && (
				<div className="flex items-center gap-2">
					<InfoIcon size={20} className="text-yellow-400" />
					<p>No URLs have been added to this project.</p>
				</div>
			)}
			<div className="flex w-full flex-col">
				<ul ref={parent} className="-mt-8 grid grid-cols-1 gap-x-8 md:grid-cols-2">
					{metadata.map((item: MetadataModified, index) => (
						<li key={item.urls.id} className="mt-8 flex flex-col border-t pt-4">
							<div className="mt-6 flex items-center justify-between">
								<TextDomain
									domain={item.domain}
									isHovered={hoveredImageId === item.urls.id}
									handleMouseEnter={() => handleImageHover(item.urls.id)}
									handleMouseLeave={handleImageLeave}
								/>
								<Button
									variant="destructive"
									size="manual"
									className="flex items-center justify-center"
									onClick={() => openDialog(metadata[index])}
								>
									<XIcon size={12} className="size-5 p-1" />
								</Button>
								{open && (
									<AlertDialog open={open} onOpenChange={handleClose}>
										<AlertDialogTrigger className="hidden" />
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
												<AlertDialogDescription>
													This will remove the URL{" "}
													<span className="italic text-foreground">
														({dialogUrlState?.domain})
													</span>{" "}
													from <strong>{selectedProject}.</strong>
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction
													onClick={() =>
														handleDeleteProjectUrl(selectedProject, dialogUrlState!.urls.id)
													}
												>
													Delete URL
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								)}
							</div>
							<ImageWithLink
								imageUrl={item.imageUrl}
								domain={item.domain}
								id={item.urls.id}
								favorite={item.urls.favorite}
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
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default ProjectUrlDisplay;
