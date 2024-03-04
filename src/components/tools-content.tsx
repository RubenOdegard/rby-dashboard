"use client";
import { capitalizeFirstLetter, cn, getDomainName } from "@/lib/utils";
import { useStore } from "@/stores/store";
import { Metadata } from "@/types/metadata";
import { DeleteIcon, ExternalLink, StarIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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

interface ToolsContentProps {
  metadata: Metadata[];
}

const ToolsContent = ({ metadata }: ToolsContentProps) => {
  // Get selected category from Zustand store
  const selectedCategory = useStore((state) => state.selectedCategory);
  const lowercaseSelectedCategory = selectedCategory.toLowerCase();
  const { setUrls, urls, toggleFavorite } = useStore(); // Destructure setUrls and toggleFavorite from the store

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

      // TODO: Add toast message
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // Delete the URL from the database
      await deleteURLFromDatabase(id);

      // Delete the URL from the Zustand store
      setUrls(urls.filter((url) => url.id !== id));

      // TODO: Add toast message
    } catch (error) {
      console.error("Error deleting URL:", error);
    }
  };

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
                <MenubarTrigger className="text-muted-foreground hover:text-yellow-400">
                  ...
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
                  <MenubarItem onClick={() => handleDelete(metadataItem.id)}>
                    {<DeleteIcon size={12} className="mr-2 " />}
                    Delete
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
          {metadataItem.imageUrl && (
            <div className="relative aspect-video">
              <Image
                src={metadataItem.imageUrl}
                alt={metadataItem.title}
                quality={30}
                layout="fill"
                objectFit="cover"
              />
            </div>
          )}
          <h3 className="text-pretty font-semibold">{metadataItem.title}</h3>
          <p className="text-sm text-muted-foreground">
            {metadataItem.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ToolsContent;
