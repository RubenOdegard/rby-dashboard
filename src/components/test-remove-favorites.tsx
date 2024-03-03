import React from "react";
import { useStore } from "@/stores/store";

const TestRemoveFavorites = () => {
  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const urls = useStore((state) => state.urls);

  const handleToggleFavorite = () => {
    // Find the URL object for "https://vercel.com"
    const vercelUrl = urls.find((url) => url.url === "https://vercel.com");

    // Call toggleFavorite function with the URL object
    if (vercelUrl) {
      toggleFavorite(vercelUrl);
    }
  };

  return (
    <button onClick={handleToggleFavorite}>
      Toggle Favorite for "https://vercel.com"
    </button>
  );
};

export default TestRemoveFavorites;
