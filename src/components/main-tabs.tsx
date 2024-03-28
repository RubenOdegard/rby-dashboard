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
						<div className="grid w-full grid-cols-12 items-center gap-2">
							<div className="col-span-2 row-start-1 hidden sm:col-span-2 sm:flex md:col-start-1">
								<ViewSelection divider={true} />
							</div>
							<div className="col-span-10 row-start-1 w-full sm:col-span-8">
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
							<div className="col-span-2 row-start-1 flex w-full justify-end sm:col-span-2">
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
