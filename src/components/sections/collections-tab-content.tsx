"use client";

import { deleteUrlFromDatabaseById, updateFavoriteStatusInDatabase } from "@/actions/collection-url-action";
import CollectionEditUrlButton from "@/components/collections/collection-edit-url-button";
import ImageWithLink from "@/components/collections/image-with-link";
import TextDescription from "@/components/collections/text-description";
import TextDomain from "@/components/collections/text-domain";
import TextTitle from "@/components/collections/text-title";
import { capitalizeFirstLetter, getDomainName, toastError, toastSuccess } from "@/lib/utils";
import { useStore } from "@/stores/store";
import type { Metadata } from "@/types/metadata";
import autoAnimate from "@formkit/auto-animate";
import { useEffect, useRef, useState } from "react";

interface CollectionContentProps {
	metadata: Metadata[];
}

const CollectionsTabContent = ({ metadata }: CollectionContentProps) => {
	const selectedCategory = useStore((state) => state.selectedCategory);
	const lowercaseSelectedCategory = selectedCategory.toLowerCase();
	const { setUrls, urls, toggleFavorite, viewExpanded, setSelectedCategory } = useStore();

	let filteredMetadata: Metadata[] = [];
	if (lowercaseSelectedCategory === "all") {
		filteredMetadata = metadata;
	} else if (lowercaseSelectedCategory === "favorites") {
		filteredMetadata = metadata.filter((item) => item.favorite === true);
	} else {
		filteredMetadata = metadata.filter((item) => item.category.toLowerCase() === lowercaseSelectedCategory);
	}

	const handleToggleFavorite = async (metadata: Metadata) => {
		try {
			// Toggle favorite in local state
			toggleFavorite(metadata.id, !metadata.favorite);
			// Toggle favorite in database
			await updateFavoriteStatusInDatabase(metadata.id, !metadata.favorite);
			// Notify user
			const toastMessage = metadata.favorite
				? `Removed ${capitalizeFirstLetter(getDomainName(metadata.url))} from your favorites.`
				: `Added ${capitalizeFirstLetter(getDomainName(metadata.url))} to your favorites.`;
			toastSuccess(toastMessage);
		} catch (error) {
			console.error("Error toggling favorite:", error);
		}
	};

	const handleDelete = async (metadata: Metadata) => {
		try {
			// Get category
			const category = metadata.category.toLowerCase();
			// Filter urls by category
			const categoryUrls = urls.filter((url) => url.category.toLowerCase() === category);
			// Delete url from database
			await deleteUrlFromDatabaseById(metadata.id);
			// If deleting the last url in a category, set selectedCategory to "All"
			if (categoryUrls.length === 1 && category !== "all") {
				// await for 1000ms to match animation
				await new Promise((resolve) => setTimeout(resolve, 1000));
				setSelectedCategory("all");
			}

			// Remove url from state
			if (Array.isArray(urls)) {
				setUrls(urls.filter((url) => url.id !== metadata.id));
			}

			// Handle case where there is only 1 url in the category when deleting
			if (urls.length === 1) {
				window.location.reload();
			}

			// Notify user of deletion
			toastSuccess(`${metadata.url} has been deleted.`);
		} catch (error) {
			toastError(`Error deleting ${metadata.url}. ${error}`);
		}
	};

	return viewExpanded ? (
		<ToolsExpandedView
			filteredMetadata={filteredMetadata}
			handleDelete={handleDelete}
			handleToggleFavorite={handleToggleFavorite}
		/>
	) : (
		<ToolsCollapsedView
			filteredMetadata={filteredMetadata}
			handleDelete={handleDelete}
			handleToggleFavorite={handleToggleFavorite}
		/>
	);
};

export default CollectionsTabContent;

interface CollectionsViewProps {
	filteredMetadata: Metadata[];
	handleDelete: (metadata: Metadata) => void;
	handleToggleFavorite: (metadata: Metadata) => void;
}

const ToolsExpandedView = ({ filteredMetadata, handleDelete, handleToggleFavorite }: CollectionsViewProps) => {
	const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);

	const handleImageHover = (id: number) => {
		setHoveredImageId(id);
	};

	const handleImageLeave = () => {
		setHoveredImageId(null);
	};

	const sortedUrls = [...filteredMetadata].sort((a, b) => {
		const one = a.createdAt;
		const two = b.createdAt;
		if (one < two) {
			return -1;
		}
		if (one > two) {
			return 1;
		}
		return 0;
	});

	// Animations
	const parent = useRef(null);
	// biome-ignore lint/correctness/useExhaustiveDependencies: <Animation library is not exhaustive>
	useEffect(() => {
		parent.current && autoAnimate(parent.current);
	}, [parent]);

	return (
		<ul ref={parent} className="-mt-8 grid grid-cols-1 gap-x-8 md:grid-cols-2">
			{sortedUrls.map((metadataItem) => (
				<div key={metadataItem.id} className="mt-8 flex flex-col border-t">
					<div className="mt-6 flex items-center justify-between">
						<TextDomain
							domain={metadataItem.domain}
							isHovered={hoveredImageId === metadataItem.id}
							handleMouseEnter={() => handleImageHover(metadataItem.id)}
							handleMouseLeave={handleImageLeave}
						/>
						<CollectionEditUrlButton
							metadataItem={metadataItem}
							onToggleFavorite={handleToggleFavorite}
							onDelete={handleDelete}
						/>
					</div>
					<ImageWithLink
						imageUrl={metadataItem.imageUrl}
						domain={metadataItem.domain}
						id={metadataItem.id}
						favorite={metadataItem.favorite}
						handleImageHover={handleImageHover}
						handleImageLeave={handleImageLeave}
						className="order-first mt-4"
					/>

					<TextTitle title={metadataItem.title} className="mt-4" />
					<TextDescription description={metadataItem.description} />
				</div>
			))}
		</ul>
	);
};

const ToolsCollapsedView = ({ filteredMetadata, handleDelete, handleToggleFavorite }: CollectionsViewProps) => {
	const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);

	const handleImageHover = (id: number) => {
		setHoveredImageId(id);
	};

	const handleImageLeave = () => {
		setHoveredImageId(null);
	};

	const sortedUrls = [...filteredMetadata].sort((a, b) => {
		const categoryComparison = a.category.localeCompare(b.category);

		if (categoryComparison !== 0) {
			return categoryComparison;
		}

		return a.title.localeCompare(b.title);
	});

	// Animations
	const parent = useRef(null);
	// biome-ignore lint/correctness/useExhaustiveDependencies: <Animation library is not exhaustive>
	useEffect(() => {
		parent.current && autoAnimate(parent.current);
	}, [parent]);

	return (
		<ul ref={parent} className="-mt-8">
			{sortedUrls.map((metadataItem) => (
				<div key={metadataItem.id} className="mt-8 flex flex-col gap-4 border-t">
					<div className="mt-6 grid grid-cols-6 items-center justify-center gap-x-8 sm:grid-cols-12">
						<ImageWithLink
							imageUrl={metadataItem.imageUrl}
							domain={metadataItem.domain}
							id={metadataItem.id}
							favorite={metadataItem.favorite}
							handleImageHover={handleImageHover}
							handleImageLeave={handleImageLeave}
							className="col-span-6 row-start-1 sm:col-span-4 md:col-span-4"
						/>
						<div className="col-span-6 row-start-2 mt-4 space-y-1 sm:col-span-8 sm:row-start-1 sm:mt-0">
							<div className="flex items-center justify-between">
								<TextDomain
									domain={metadataItem.domain}
									isHovered={hoveredImageId === metadataItem.id}
									handleMouseEnter={() => handleImageHover(metadataItem.id)}
									handleMouseLeave={handleImageLeave}
								/>
								<CollectionEditUrlButton
									metadataItem={metadataItem}
									onToggleFavorite={handleToggleFavorite}
									onDelete={handleDelete}
								/>
							</div>
							<TextTitle title={metadataItem.title} />
							<TextDescription description={metadataItem.description} />
						</div>
					</div>
				</div>
			))}
		</ul>
	);
};
