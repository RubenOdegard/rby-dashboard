import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/stores/store";
import { useEffect } from "react";
import AddUrlForm from "./add-url-form";
import ToolsTabContent from "./tools-tab-content";
import ProjectsTabContent from "./projects-tab-content";
import { ViewSelection } from "./view-selection";

interface MainTabsProps {
  toolCategories: string[];
}

export function MainTabs({ toolCategories }: MainTabsProps) {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedProject,
    setSelectedProject,
    toolsMetadata,
  } = useStore();

  // Load the selected category and project from local storage
  useEffect(() => {
    // Handle
    const storedCategory = localStorage.getItem("selectedCategory");
    if (storedCategory) {
      setSelectedCategory(storedCategory);
    } else {
      setSelectedCategory("all");
    }
    const storedProject = localStorage.getItem("selectedProject");
    if (storedProject) {
      setSelectedProject(storedProject);
    } else {
      setSelectedProject("");
    }
  }, []);

  // Push the selected category to local storage so it persists on refresh
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    localStorage.setItem("selectedCategory", category);
  };

  return (
    <Tabs defaultValue="tools" className="w-full max-w-6xl py-4">
      <TabsList className="mx-auto mb-8 grid w-full max-w-sm grid-cols-2">
        <TabsTrigger value="tools">Tools</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
      </TabsList>
      <TabsContent value="tools">
        <Card>
          <CardHeader>
            {/* // NOTE: Removed <CardDescription> because of hydration errors with child elements. */}
            <div className="grid w-full grid-cols-12 items-center gap-2">
              <div className="col-span-6 row-start-1 md:col-span-2 md:col-start-1">
                {/* // NOTE: Rendering the view selection component, toggle between collapsed and expanded view.*/}
                <ViewSelection divider={true} />
              </div>

              {/* // NOTE: Rendering a select component to filter tools by category.*/}
              <div className="col-span-12 mx-auto w-full md:col-span-6 md:col-start-4 md:max-w-sm">
                <Select
                  defaultValue="all"
                  onValueChange={handleCategoryChange}
                  value={selectedCategory}
                >
                  <SelectTrigger className="mx-auto md:max-w-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="favorites">Favorites</SelectItem>
                    {toolCategories.map((category, index) => (
                      <SelectItem
                        key={index}
                        value={category}
                        className="capitalize"
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* // NOTE: Rendering a popup dialog with a form to add a new URL.*/}
              <div className="col-span-6 row-start-1 justify-self-end md:col-span-2 md:col-start-11">
                <AddUrlForm />
              </div>
            </div>
          </CardHeader>
          <CardContent className="-mb-4 space-y-3">
            <ToolsTabContent metadata={toolsMetadata} />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="projects">
        <Card>
          <CardHeader>
            <CardDescription>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Dual Livestream Chat</SelectItem>
                  <SelectItem value="dark">Developer Portfolio</SelectItem>
                  <SelectItem value="system">Developer Dashboard</SelectItem>
                </SelectContent>
              </Select>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ProjectsTabContent />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
