import { create } from "zustand";
import { Metadata } from "@/types/metadata";
import { Urls } from "@/types/urls";

export interface StoreState {
	// Selected category type
	selectedCategory: string;
	setSelectedCategory: (category: string) => void;

	// Selected project type
	selectedProject: string;
	setSelectedProject: (project: string) => void;

	// Array of tools type
	toolsMetadata: Metadata[];
	setToolsMetadata: (metadata: Metadata[]) => void;

	// Set of categories for tools type
	toolCategories: string[];
	setToolCategories: (categories: string[]) => void;

	// View type
	viewExpanded: boolean;
	setViewExpanded: (view: boolean) => void;

	// Failed URLs
	failedUrls: string[];
	setFailedUrls: (urls: string[]) => void;

	// URLs array
	urls: Urls[];
	setUrls: (urls: Urls[]) => void; // Add setter for URLs

	// Toggle favorite for a URL
	toggleFavorite: (id: number, newFavoriteStatus: boolean) => void;
}

export const useStore = create<StoreState>((set) => {
	// Initialize viewExpanded from localStorage if available, or set to false
	const viewExpandedFromLocalStorage =
		typeof window !== "undefined" ? localStorage.getItem("viewExpanded") : null;
	const initialViewExpanded = viewExpandedFromLocalStorage
		? JSON.parse(viewExpandedFromLocalStorage)
		: false;

	return {
		selectedCategory: "all",
		setSelectedCategory: (category) =>
			set(() => ({ selectedCategory: category })),

		selectedProject: "",
		setSelectedProject: (project) => set(() => ({ selectedProject: project })),

		toolsMetadata: [],
		setToolsMetadata: (metadata) => set(() => ({ toolsMetadata: metadata })),

		toolCategories: [],
		setToolCategories: (categories) =>
			set(() => ({ toolCategories: categories })),

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

		toggleFavorite: (id: number, newFavoriteStatus: boolean) =>
			set((state) => ({
				urls: state.urls.map((url) =>
					url.id === id ? { ...url, favorite: newFavoriteStatus } : url,
				),
			})),
	};
});
