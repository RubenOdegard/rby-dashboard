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

// Initialize Zustand store with initial state
export const useStore = create<StoreState>((set) => ({
  // Function to set selected category
  selectedCategory: "",
  setSelectedCategory: (category) =>
    set(() => ({ selectedCategory: category })),

  // Function to set selected project
  selectedProject: "",
  setSelectedProject: (project) => set(() => ({ selectedProject: project })),

  // Function to set tools
  toolsMetadata: [],
  setToolsMetadata: (metadata) => set(() => ({ toolsMetadata: metadata })),

  // Function to set categories
  toolCategories: [],
  setToolCategories: (categories) =>
    set(() => ({ toolCategories: categories })),

  // Function to set view
  viewExpanded: false,
  setViewExpanded: (view) => set(() => ({ viewExpanded: view })),

  // Function to set failed URLs
  failedUrls: [],
  setFailedUrls: (urls) => set(() => ({ failedUrls: urls })),

  // URLs array
  urls: [],
  // Function to set URLs array
  setUrls: (urls) => set(() => ({ urls })),

  // Toggle favorite for a URL
  toggleFavorite: (id: number, newFavoriteStatus: boolean) =>
    set((state) => ({
      urls: state.urls.map((url) =>
        url.id === id ? { ...url, favorite: newFavoriteStatus } : url,
      ),
    })),
}));
