import { capitalizeFirstLetter, cn, getDomainName } from "@/lib/utils";
import { useStore } from "@/stores/store";
import { Metadata } from "@/types/metadata";
import { DeleteIcon, EditIcon, ExternalLink, StarIcon } from "lucide-react";
import Link from "next/link";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import TestRemoveFavorites from "./test-remove-favorites";

interface ToolsContentProps {
  metadata: Metadata[];
}

const ToolsContent = ({ metadata }: ToolsContentProps) => {
  const selectedCategory = useStore((state) => state.selectedCategory);
  const lowercaseSelectedCategory = selectedCategory.toLowerCase();

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

  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const urls = useStore((state) => state.urls);

  const handleToggleFavorite = (domain: string) => {
    // Find the URL object for the given domain
    const siteUrl = urls.find((url) => url.url === domain);
    // Call toggleFavorite function with the URL object
    if (siteUrl) {
      toggleFavorite(siteUrl);
    }
  };

  return (
    <div className="-mt-8 flex flex-col gap-8 divide-y">
      {filteredMetadata.map((metadataItem, index) => (
        <div key={index} className="flex flex-col gap-4">
          <div className="mt-6 flex items-center justify-between">
            <Link
              href={metadataItem.domain}
              target={"_blank"}
              className=" flex items-center justify-start gap-2"
            >
              <h3 className="text-pretty rounded-md text-lg font-semibold decoration-yellow-400 underline-offset-4 hover:underline">
                {capitalizeFirstLetter(getDomainName(metadataItem.domain))}
              </h3>
              <ExternalLink size={12} />
            </Link>
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>...</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem
                    onClick={() => handleToggleFavorite(metadataItem.domain)}
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
                  <MenubarItem className="line-through">
                    {<DeleteIcon size={12} className="mr-2 " />}
                    Delete
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
          {metadataItem.imageUrl && (
            <img src={metadataItem.imageUrl} alt="Thumbnail" />
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
