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
  toggleFavorite: (url: Urls) => void;
}

// Define the base data for URLs
const baseUrls: Urls[] = [
  {
    url: "https://vercel.com",
    category: "hosting",
    projects: null,
    favorite: true,
  },
  {
    url: "https://docker.com",
    category: "infrastructure",
    projects: null,
    favorite: true,
  },
  {
    url: "https://railway.app",
    category: "hosting",
    projects: null,
    favorite: false,
  },
  {
    url: "https://cursor.sh",
    category: "infrastructure",
    projects: null,
    favorite: false,
  },
  {
    url: "https://supabase.com",
    category: "infrastructure",
    projects: null,
    favorite: false,
  },
  {
    url: "https://sanity.io",
    category: "CMS",
    projects: null,
    favorite: false,
  },
];

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

  // Initialize URLs array with base data
  urls: baseUrls,

  // Function to set URLs array
  setUrls: (urls) => set(() => ({ urls })),

  toggleFavorite: (urlToUpdate) =>
    set((state) => ({
      urls: state.urls.map((url) =>
        url.url === urlToUpdate.url ? { ...url, favorite: !url.favorite } : url,
      ),
    })),
}));
