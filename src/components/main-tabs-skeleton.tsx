import { Card, CardDescription, CardHeader } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoaderIcon } from "lucide-react";

export function MainTabsSkeleton() {
  return (
    <Tabs defaultValue="tools" className="w-full max-w-sm py-4">
      <TabsList className="mx-auto grid w-full grid-cols-2">
        <TabsTrigger value="tools">Tools</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
      </TabsList>
      <TabsContent value="tools">
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center justify-center">
              {<LoaderIcon className="animate-spin text-yellow-400" />}
            </CardDescription>
          </CardHeader>
        </Card>
      </TabsContent>
      <TabsContent value="projects">
        <Card>
          <CardHeader>
            <CardDescription>Content</CardDescription>
          </CardHeader>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
