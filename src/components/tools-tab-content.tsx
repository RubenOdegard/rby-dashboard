"use client";
import {
	capitalizeFirstLetter,
	getDomainName,
	toastError,
	toastSuccess,
} from "@/lib/utils";
import { useStore } from "@/stores/store";
import { Metadata } from "@/types/metadata";
import { useState } from "react";
import TextDescription from "./text-description";
import TextTitle from "./text-title";
import TextDomain from "./text-domain";
import ImageWithLink from "./image-with-link";
import MenubarActions from "./menubar-actions";
import {
	deleteURLFromDatabase,
	updateFavoriteStatusInDatabase,
} from "@/app/actions";

interface ToolsContentProps {
	metadata: Metadata[];
}

interface ToolsViewProps {
	filteredMetadata: Metadata[];
	handleDelete: (metadata: Metadata) => void;
	handleToggleFavorite: (metadata: Metadata) => void;
}

const ToolsTabContent = ({ metadata }: ToolsContentProps) => {
	// Get selected category from Zustand store
	const selectedCategory = useStore((state) => state.selectedCategory);
	const lowercaseSelectedCategory = selectedCategory.toLowerCase();
	const { setUrls, urls, toggleFavorite, viewExpanded } = useStore();

	// Filter metadata based on selected category
	let filteredMetadata: Metadata[] = [];
	if (lowercaseSelectedCategory === "all") {
		filteredMetadata = metadata;
	} else if (lowercaseSelectedCategory === "favorites") {
		filteredMetadata = metadata.filter((item) => item.favorite === true);
	} else {
		filteredMetadata = metadata.filter(
			(item) => item.category.toLowerCase() === lowercaseSelectedCategory,
		);
	}

	const handleToggleFavorite = async (metadata: Metadata) => {
		try {
			// Toggle favorite status in the Zustand store
			toggleFavorite(metadata.id, !metadata.favorite);

			// Update the database with the new favorite status
			await updateFavoriteStatusInDatabase(metadata.id, !metadata.favorite);

			// Conditionally update the toast message and push to user
			const toastMessage = metadata.favorite
				? `Removed ${capitalizeFirstLetter(
						getDomainName(metadata.url),
				  )} from your favorites.`
				: `Added ${capitalizeFirstLetter(
						getDomainName(metadata.url),
				  )} to your favorites.`;
			toastSuccess(toastMessage);
		} catch (error) {
			console.error("Error toggling favorite:", error);
		}
	};

	const handleDelete = async (metadata: Metadata) => {
		try {
			// Delete the URL from the database
			await deleteURLFromDatabase(metadata.id);

			// Delete the URL from the Zustand store
			setUrls(urls.filter((url) => url.id !== metadata.id));
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

export default ToolsTabContent;

const ToolsExpandedView = ({
	filteredMetadata,
	handleDelete,
	handleToggleFavorite,
}: ToolsViewProps) => {
	const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);

	const handleImageHover = (id: number) => {
		setHoveredImageId(id);
	};

	const handleImageLeave = () => {
		setHoveredImageId(null);
	};
	return (
		<div className="-mt-8 grid grid-cols-1 gap-x-8  md:grid-cols-2">
			{filteredMetadata.map((metadataItem) => (
				<div
					key={metadataItem.id}
					className="mt-8 flex flex-col gap-4 border-t"
				>
					<div className="mt-6 flex items-center justify-between">
						<TextDomain
							domain={metadataItem.domain}
							isHovered={hoveredImageId === metadataItem.id}
							handleMouseEnter={() => handleImageHover(metadataItem.id)}
							handleMouseLeave={handleImageLeave}
						/>
						<MenubarActions
							metadataItem={metadataItem}
							onToggleFavorite={handleToggleFavorite}
							onDelete={handleDelete}
						/>
					</div>
					<ImageWithLink
						imageUrl={metadataItem.imageUrl}
						domain={metadataItem.domain}
						id={metadataItem.id}
						handleImageHover={handleImageHover}
						handleImageLeave={handleImageLeave}
					/>
					<TextTitle title={metadataItem.title} />
					<TextDescription description={metadataItem.description} />
				</div>
			))}
		</div>
	);
};

const ToolsCollapsedView = ({
	filteredMetadata,
	handleDelete,
	handleToggleFavorite,
}: ToolsViewProps) => {
	const [hoveredImageId, setHoveredImageId] = useState<number | null>(null);

	const handleImageHover = (id: number) => {
		setHoveredImageId(id);
	};

	const handleImageLeave = () => {
		setHoveredImageId(null);
	};

	return (
		<div className="-mt-8">
			{filteredMetadata.map((metadataItem) => (
				<div
					key={metadataItem.id}
					className="mt-8 flex flex-col gap-4 border-t"
				>
					<div className="mt-6 grid grid-cols-12 items-center justify-center gap-x-8">
						<ImageWithLink
							imageUrl={metadataItem.imageUrl}
							domain={metadataItem.domain}
							id={metadataItem.id}
							handleImageHover={handleImageHover}
							handleImageLeave={handleImageLeave}
							className="col-span-3"
						/>
						<div className="col-span-9 space-y-0.5">
							<div className="flex items-center justify-between">
								<TextDomain
									domain={metadataItem.domain}
									isHovered={hoveredImageId === metadataItem.id}
									handleMouseEnter={() => handleImageHover(metadataItem.id)}
									handleMouseLeave={handleImageLeave}
								/>
								<MenubarActions
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
		</div>
	);
};
