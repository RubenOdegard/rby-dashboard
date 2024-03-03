import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
    setSelectedCategory("all");
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <Tabs defaultValue="tools" className="w-full max-w-sm py-4">
      <TabsList className="mx-auto grid w-full grid-cols-2">
        <TabsTrigger value="tools">Tools</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
      </TabsList>
      <TabsContent value="tools">
        <Card>
          <CardHeader>
            <CardDescription>
              <Select
                defaultValue="all"
                onValueChange={handleCategoryChange}
                value={selectedCategory}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
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
            </CardDescription>
          </CardHeader>
          {/* FIX: Remove margin/padding bottom inside the CardContent, not with a className maybe?*/}
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
