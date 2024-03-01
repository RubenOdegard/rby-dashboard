"use client";
import { MainTabs } from "@/components/main-tabs";
import { useState } from "react";

interface Metadata {
  title: string;
  description: string;
  imageUrl: string | undefined;
  category: string;
}

function MetadataFetcher() {
  const [metadataList, setMetadataList] = useState<Metadata[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urls, setUrls] = useState([
    { url: "https://vercel.com", category: "hosting", language: null },
    { url: "https://docker.com", category: "infrastructure", language: null },
  ]);

  const fetchMetadata = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const promises = urls.map(async ({ url, category }) => {
        const response = await fetch(
          `/api/fetchMetadata?url=${encodeURIComponent(url)}`,
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch metadata for ${url}`);
        }
        const data = await response.json();
        return { ...data, category };
      });

      const metadata = await Promise.all(promises);
      setMetadataList(metadata);
    } catch (error) {
      console.error("Error fetching metadata:", error);
      setError("Failed to fetch metadata. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const metadataByCategory: { [category: string]: Metadata[] } = {};
  metadataList.forEach((metadata) => {
    if (!metadataByCategory[metadata.category]) {
      metadataByCategory[metadata.category] = [];
    }
    metadataByCategory[metadata.category].push(metadata);
  });

  return (
    <div>
      <button
        className="mt-8 rounded-md border px-4 py-1.5 text-white"
        onClick={fetchMetadata}
        disabled={isLoading}
      >
        {isLoading ? "Fetching Metadata..." : "Fetch Metadata"}
      </button>

      {error && <p className="mt-2 text-red-500">{error}</p>}

      {Object.entries(metadataByCategory).map(([category, metadataArray]) => (
        <div key={category} className="mt-8">
          <h2 className="text-xl font-semibold capitalize underline underline-offset-8">
            {category}
          </h2>
          <div className="flex flex-col gap-6 divide-y pt-4">
            {metadataArray.map((metadata, index) => (
              <div key={index} className="flex flex-col gap-2 pt-4">
                <h3 className="font-semibold">{metadata.title}</h3>
                {metadata.imageUrl && (
                  <img
                    src={metadata.imageUrl}
                    alt="Thumbnail"
                    className="mt-2"
                  />
                )}
                <p>{metadata.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

import React from "react";

const ToolsContent = () => {
  return <div>ToolsContent</div>;
};

const ProjectsContent = () => {
  return <div>ProjectsContent</div>;
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-semibold tracking-wide">
        Developer Dashboard
      </h1>
      <MainTabs
        ToolsContent={<ToolsContent />}
        ProjectsContent={<ProjectsContent />}
      />
      <MetadataFetcher />
    </main>
  );
}
