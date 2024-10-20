import type { SelectUrl } from "@/db/schema";
import type { Metadata } from "@/types/metadata";
import type { ProjectUrls, Projects, Urls } from "@/types/types";
import { create } from "zustand";

export interface StoreState {
	// Selected category type
	selectedCategory: string;
	setSelectedCategory: (category: string) => void;

	// Selected project type
	selectedProject: string;
	setSelectedProject: (project: string) => void;

	// Selected project type
	selectedTab: string;
	setSelectedTab: (project: string) => void;

	// Array of collections type
	collectionsMetadata: Metadata[];
	setCollectionsMetadata: (metadata: Metadata[]) => void;

	// Set of categories for collections type
	collectionCategories: string[];
	setCollectionCategories: (categories: string[]) => void;

	// View type
	viewExpanded: boolean;
	setViewExpanded: (view: boolean) => void;

	// Failed URLs
	failedUrls: string[];
	setFailedUrls: (urls: string[]) => void;

	// URLs array
	urls: Urls[];
	setUrls: (urls: Urls[]) => void;

	// Projects array
	projects: Projects[];
	setProjects: (projects: Projects[]) => void;

	// projectUrls
	projectUrls: ProjectUrls[];
	setProjectUrls: (projectUrls: ProjectUrls[]) => void;

	// Toggle favorite for a URL
	toggleFavorite: (id: number, newFavoriteStatus: boolean) => void;

	// FilteredUnusedURLs
	filterUnusedUrls: SelectUrl[];
	setFilterUnusedUrls: (filterUnusedUrls: SelectUrl[]) => void;
}

export const useStore = create<StoreState>((set) => {
	// Initialize viewExpanded from localStorage if available, or set to false
	const viewExpandedFromLocalStorage = typeof window !== "undefined" ? localStorage.getItem("viewExpanded") : null;
	const initialViewExpanded = viewExpandedFromLocalStorage ? JSON.parse(viewExpandedFromLocalStorage) : false;

	return {
		selectedCategory: "all",
		setSelectedCategory: (category) => set(() => ({ selectedCategory: category })),

		selectedProject: "",
		setSelectedProject: (project) => set(() => ({ selectedProject: project })),

		selectedTab: "",
		setSelectedTab: (tab) => set(() => ({ selectedTab: tab })),

		collectionsMetadata: [],
		setCollectionsMetadata: (metadata) => set(() => ({ collectionsMetadata: metadata })),

		collectionCategories: [],
		setCollectionCategories: (categories) => set(() => ({ collectionCategories: categories })),

		viewExpanded: initialViewExpanded,
		setViewExpanded: (view) => {
			set(() => ({ viewExpanded: view }));
			if (typeof window !== "undefined") {
				localStorage.setItem("viewExpanded", JSON.stringify(view));
			}
		},

		failedUrls: [],
		setFailedUrls: (urls) => set(() => ({ failedUrls: urls })),

		urls: [],
		setUrls: (urls) => set(() => ({ urls })),

		projects: [],
		setProjects: (projects) => set(() => ({ projects })),

		projectUrls: [],
		setProjectUrls: (projectUrls) => set(() => ({ projectUrls })),

		filterUnusedUrls: [],
		setFilterUnusedUrls: (filterUnusedUrls: SelectUrl[]) => set(() => ({ filterUnusedUrls })),

		toggleFavorite: (id: number, newFavoriteStatus: boolean) =>
			set((state) => ({
				urls: state.urls.map((url) => (url.id === id ? { ...url, favorite: newFavoriteStatus } : url)),
			})),
	};
});
