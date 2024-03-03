import { Button } from "@/components/ui/button";
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
import { ReactNode, useEffect } from "react";
import AddUrlForm from "./add-url-form";

interface MainTabsProps {
  ToolsContent: ReactNode;
  ProjectsContent: ReactNode;
  toolCategories: string[];
}

export function MainTabs({
  ToolsContent,
  ProjectsContent,
  toolCategories,
}: MainTabsProps) {
  const { selectedCategory, setSelectedCategory } = useStore();

  useEffect(() => {
    const storedCategory = localStorage.getItem("selectedCategory");
    if (storedCategory) {
      setSelectedCategory(storedCategory);
    } else {
      setSelectedCategory("all");
    }
  }, []);

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
            <CardDescription className="flex items-center justify-between gap-2">
              <Button className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground opacity-0 ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                Add Tool
              </Button>
              <Select
                defaultValue="all"
                onValueChange={handleCategoryChange}
                value={selectedCategory}
              >
                <SelectTrigger className="mx-auto max-w-sm">
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

              <AddUrlForm />
            </CardDescription>
          </CardHeader>
          <CardContent className="-mb-4 space-y-3">{ToolsContent}</CardContent>
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
          <CardContent className="space-y-2">{ProjectsContent}</CardContent>
          <CardFooter></CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
