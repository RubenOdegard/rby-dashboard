import { useStore } from "@/stores/store";
import { Metadata } from "@/types/metadata";

interface ToolsContentProps {
  metadata: Metadata[];
}

const ToolsContent = ({ metadata }: ToolsContentProps) => {
  const selectedCategory = useStore((state) => state.selectedCategory);
  const lowercaseSelectedCategory = selectedCategory.toLowerCase();

  const filteredMetadata = metadata.filter(
    (item) => item.category.toLowerCase() === lowercaseSelectedCategory,
  );

  return (
    <div className="-mt-8 flex flex-col gap-8 divide-y">
      {filteredMetadata.map((metadataItem, index) => (
        <div key={index} className="flex flex-col gap-4">
          <h3 className="text-pretty mb-2 mt-8 font-semibold">
            {metadataItem.title}
          </h3>
          {metadataItem.imageUrl && (
            <img src={metadataItem.imageUrl} alt="Thumbnail" />
          )}
          <p className="text-sm">{metadataItem.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ToolsContent;
