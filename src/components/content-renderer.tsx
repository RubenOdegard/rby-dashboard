import { Metadata } from "@/types/metadata";
import { MainTabs } from "./main-tabs";
import { MainTabsSkeleton } from "./main-tabs-skeleton";
import ProjectsContent from "./projects-content";
import ToolsContent from "./tools-content";

interface ContentRendererProps {
  isLoading: boolean;
  error: string | null;
  toolsMetadata: Metadata[];
  toolCategories: string[];
}

const ContentRenderer = ({
  isLoading,
  error,
  toolsMetadata,
  toolCategories,
}: ContentRendererProps) => {
  switch (true) {
    case isLoading:
      return <MainTabsSkeleton />;
    case error !== null:
      return <p className="mt-2 text-red-500">{error}</p>;
    default:
      return (
        <MainTabs
          ToolsContent={<ToolsContent metadata={toolsMetadata} />}
          ProjectsContent={<ProjectsContent />}
          toolCategories={toolCategories}
        />
      );
  }
};
export default ContentRenderer;
