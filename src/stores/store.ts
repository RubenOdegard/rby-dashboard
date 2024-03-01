import create from "zustand";
import { Metadata } from "@/types/metadata";

interface StoreState {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedProject: string;
  setSelectedProject: (project: string) => void;
  toolsMetadata: Metadata[];
  setToolsMetadata: (metadata: Metadata[]) => void;
  toolCategories: string[];
  setToolCategories: (categories: string[]) => void;
}

export const useStore = create<StoreState>((set) => ({
  selectedCategory: "Select a category",
  setSelectedCategory: (category) =>
    set(() => ({ selectedCategory: category })),
  selectedProject: "Select a project",
  setSelectedProject: (project) => set(() => ({ selectedProject: project })),
  toolsMetadata: [],
  setToolsMetadata: (metadata) => set(() => ({ toolsMetadata: metadata })),
  toolCategories: [],
  setToolCategories: (categories) =>
    set(() => ({ toolCategories: categories })),
}));
