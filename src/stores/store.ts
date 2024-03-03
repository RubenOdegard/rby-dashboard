import { create } from "zustand";
import { Metadata } from "@/types/metadata";

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
}

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
}));
