import { Card, CardDescription, CardHeader } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoaderIcon } from "lucide-react";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";

export function MainTabsSkeleton() {
  return (
    <Tabs defaultValue="tools" className="w-full max-w-6xl py-4">
      <TabsList className="mx-auto mb-8 grid w-full max-w-sm grid-cols-2">
        <TabsTrigger value="tools">Tools</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
      </TabsList>
      <TabsContent value="tools">
        <Card>
          <CardHeader>
            <CardDescription className="flex flex-col items-center justify-center gap-6">
              <Select disabled={true}>
                <SelectTrigger className="mx-auto max-w-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent></SelectContent>
              </Select>
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
