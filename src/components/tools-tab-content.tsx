"use client";
import { capitalizeFirstLetter, cn, getDomainName } from "@/lib/utils";
import { useStore } from "@/stores/store";
import { Metadata } from "@/types/metadata";
import { ExternalLink, MoreHorizontal, StarIcon, Trash } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  deleteURLFromDatabase,
  updateFavoriteStatusInDatabase,
} from "@/app/actions";
import moment from "moment";
import { useState } from "react";

interface ToolsContentProps {
  metadata: Metadata[];
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
      toast.success(toastMessage, {
        description: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
        closeButton: true,
      });
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

      toast.success(`${metadata.url} has been deleted.`, {
        description: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
        closeButton: true,
      });
    } catch (error) {
      console.error("Error deleting URL:", error);
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

interface ToolsViewProps {
  filteredMetadata: Metadata[];
  handleDelete: (metadata: Metadata) => void;
  handleToggleFavorite: (metadata: Metadata) => void;
}

const ToolsExpandedView = ({
  filteredMetadata,
  handleDelete,
  handleToggleFavorite,
}: ToolsViewProps) => {
  return (
    <div className="-mt-8 grid grid-cols-1 gap-x-8  md:grid-cols-2">
      {filteredMetadata.map((metadataItem) => (
        <div
          key={metadataItem.id}
          className="mt-8 flex flex-col gap-4 border-t"
        >
          <div className="mt-6 flex items-center justify-between">
            <Link
              href={metadataItem.domain}
              target={"_blank"}
              className=" flex items-center justify-start gap-2"
            >
              <h3 className="text-pretty rounded-md text-2xl font-semibold decoration-yellow-400 underline-offset-4 hover:underline">
                {capitalizeFirstLetter(getDomainName(metadataItem.domain))}
              </h3>
              <ExternalLink size={12} />
            </Link>
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger className="flex aspect-square w-[24px] items-center justify-center p-1 text-muted-foreground hover:text-yellow-400">
                  <MoreHorizontal size={12} />
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem
                    onClick={() => handleToggleFavorite(metadataItem)}
                  >
                    {
                      <StarIcon
                        size={12}
                        className={cn(
                          "mr-2",
                          metadataItem.favorite && "text-yellow-400",
                        )}
                      />
                    }
                    {metadataItem.favorite
                      ? "Remove from favorites"
                      : "Add to favorites"}
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem onClick={() => handleDelete(metadataItem)}>
                    {<Trash size={12} className="mr-2 text-red-400 " />}
                    Delete
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
          {metadataItem.imageUrl && (
            <Link
              href={metadataItem.domain}
              target={"_blank"}
              className="relative aspect-video"
            >
              <Image
                src={metadataItem.imageUrl}
                alt={metadataItem.title}
                quality={30}
                layout="fill"
                objectFit="cover"
              />
            </Link>
          )}
          <h3 className="text-pretty font-semibold">{metadataItem.title}</h3>
          <p className="text-pretty text-sm text-muted-foreground">
            {metadataItem.description}
          </p>
        </div>
      ))}
    </div>
  );
};

// TODO: Add Menubar back into CollapsedView, need to be able to delete and add to favorites
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
            {metadataItem.imageUrl && (
              <Link
                href={metadataItem.domain}
className={cn(hoveredImageId === metadataItem.id && "border-yellow-400", " relative col-span-3 aspect-video overflow-clip rounded-xl border transition-all duration-1000")}
                target={"_blank"}
              >
                <div
                  className="relative aspect-video"
                  onMouseEnter={() => handleImageHover(metadataItem.id)}
                  onMouseLeave={handleImageLeave}
                >
                  <Image
                    src={metadataItem.imageUrl}
                    alt={metadataItem.title}
                    quality={30}
                    layout="fill"
                    objectFit="cover"
                  />
                  {hoveredImageId === metadataItem.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 backdrop-blur-sm transition-all">
                      <p className="text-white">Open in a new tab</p>
                    </div>
                  )}
                </div>
              </Link>
            )}

            <div className="col-span-9 space-y-0.5">
              <Link
                href={metadataItem.domain}
                target={"_blank"}
                className=" flex items-center justify-start gap-2"
              >
                <h3
                  className={cn(
                    hoveredImageId === metadataItem.id
                      ? "text-yellow-400"
                      : "text-foreground",
                    "text-pretty rounded-md text-xl font-semibold decoration-yellow-400 underline-offset-4 transition-all hover:underline",
                  )}
                >
                  {capitalizeFirstLetter(getDomainName(metadataItem.domain))}
                </h3>
                <ExternalLink size={12} />
              </Link>
              <h3 className="text-pretty text-sm font-semibold">
                {metadataItem.title}
              </h3>
              <p className="text-pretty pt-2 text-xs text-muted-foreground">
                {metadataItem.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
