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
import { Projects } from "@/types/projects";
import AddProjectForm from "./add-project-form";

interface MainTabsProps {
  toolCategories: string[];
  projects: Projects[];
}

export function MainTabs({ toolCategories, projects }: MainTabsProps) {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedProject,
    setSelectedProject,
    selectedTab,
    setSelectedTab,
    toolsMetadata,
  } = useStore();

  // Load the selected category and project from local storage
  useEffect(() => {
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

    const storedTab = localStorage.getItem("selectedTab");
    if (storedTab) {
      setSelectedTab(storedTab);
    } else {
      setSelectedTab("tools");
    }
  }, []);

  // Push the selected category to local storage so it persists on refresh
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    localStorage.setItem("selectedCategory", category);
  };

  const handleProjectChange = (project: string) => {
    setSelectedProject(project);
    localStorage.setItem("selectedProject", project);
  };

  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    localStorage.setItem("selectedTab", tab);
  };

  return (
    <Tabs defaultValue={selectedTab} className="w-full max-w-6xl py-4">
      <TabsList className="mx-auto mb-8 grid w-full max-w-sm grid-cols-2">
        <TabsTrigger value="tools" onClick={() => handleTabChange("tools")}>
          Collections
        </TabsTrigger>
        <TabsTrigger
          value="projects"
          onClick={() => handleTabChange("projects")}
        >
          Projects
        </TabsTrigger>
      </TabsList>
      <TabsContent value="tools">
        <Card>
          <CardHeader>
            <div className="grid grid-cols-12 items-center gap-2">
              <div className="col-span-2 row-start-1 hidden sm:col-span-2 sm:flex md:col-start-1">
                <ViewSelection divider={true} />
              </div>
              <div className="col-span-12 row-start-1 mx-auto w-full sm:col-span-8">
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
                        <span className="text-muted-foreground">
                          {" ("}
                          {
                            toolsMetadata.filter((metadata) => {
                              const match =
                                metadata.category.toLowerCase() ===
                                category.toLowerCase();
                              return match;
                            }).length
                          }
                          {")"}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-12 row-start-2 mt-2 flex w-full justify-center sm:col-span-2 sm:row-start-1 sm:mt-0 sm:justify-end">
                <AddUrlForm />
              </div>
            </div>
          </CardHeader>
          <CardContent className="-mb-4">
            <ToolsTabContent metadata={toolsMetadata} />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="projects">
        <Card>
          <CardHeader>
            <CardDescription className="flex flex-col gap-4 sm:flex-row">
              <Select
                onValueChange={handleProjectChange}
                value={selectedProject}
              >
                <SelectTrigger className="w-full text-white">
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project: Projects) => (
                    <SelectItem
                      key={project.id}
                      value={project.project}
                      className="capitalize"
                    >
                      {project.project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <AddProjectForm />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectsTabContent />
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
