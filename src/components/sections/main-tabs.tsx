import CollectionNewUrlForm from "@/components/collections/collection-new-url-form";
import { CollectionViewSelection } from "@/components/collections/collection-view-selection";
import ProjectNewForm from "@/components/projects/project-new-form";
import CollectionsTabContent from "@/components/sections/collections-tab-content";
import ProjectsTabContent from "@/components/sections/projects-tab-content";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/stores/store";
import type { Projects } from "@/types/types";
import { useEffect } from "react";

export function MainTabs({ collectionCategories, projects }: { collectionCategories: string[]; projects: Projects[] }) {
	const {
		selectedCategory,
		setSelectedCategory,
		selectedProject,
		setSelectedProject,
		selectedTab,
		setSelectedTab,
		collectionsMetadata,
	} = useStore();

	const sortedProjects = [...projects].sort((a, b) => a.project.localeCompare(b.project));
	const sortedCollections = [...collectionCategories].sort((a, b) => a.localeCompare(b));

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
			setSelectedTab("collections");
		}
	}, [setSelectedTab, setSelectedCategory, setSelectedProject]);

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
		<Tabs defaultValue={selectedTab} className="w-full max-w-6xl px-4 py-4 sm:px-8">
			<TabsList className="mx-auto mb-8 grid w-full max-w-sm grid-cols-2">
				<TabsTrigger value="collections" onClick={() => handleTabChange("collections")}>
					Collections
				</TabsTrigger>
				<TabsTrigger value="projects" onClick={() => handleTabChange("projects")}>
					Projects
				</TabsTrigger>
			</TabsList>
			<TabsContent value="collections">
				<Card className="pb-6">
					<CardHeader>
						<div className="grid grid-cols-12 items-center gap-2">
							<div className="col-span-2 row-start-1 hidden sm:col-span-2 sm:flex md:col-start-1">
								<CollectionViewSelection divider={true} />
							</div>
							<div className="col-span-12 row-start-1 mx-auto w-full sm:col-span-8">
								<Select
									defaultValue="all"
									onValueChange={handleCategoryChange}
									value={selectedCategory}
								>
									<SelectTrigger className="mx-auto capitalize md:max-w-sm">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All</SelectItem>
										<SelectItem value="favorites">Favorites</SelectItem>
										<SelectSeparator />
										{sortedCollections.map((category) => (
											<SelectItem key={category} value={category} className="capitalize">
												{category}
												<span className="text-muted-foreground">
													{" ("}
													{
														collectionsMetadata.filter((metadata) => {
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
								<CollectionNewUrlForm />
							</div>
						</div>
					</CardHeader>
					<CardContent className="-mb-4">
						<CollectionsTabContent metadata={collectionsMetadata} />
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value="projects">
				<Card>
					<CardHeader>
						<CardDescription className="flex flex-col gap-4 sm:flex-row">
							<Select onValueChange={handleProjectChange} value={selectedProject}>
								<SelectTrigger className="w-full capitalize text-white">
									<SelectValue placeholder="Select a project" />
								</SelectTrigger>
								<SelectContent>
									{sortedProjects.map((project: Projects) => (
										<SelectItem key={project.id} value={project.project} className="capitalize">
											{project.project}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<ProjectNewForm />
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ProjectsTabContent />
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	);
}
