"use client"

import { addProjectUrlToDatabase, fetchProjectURLs } from "@/actions/project-actions";
import { capitalizeFirstLetter, getDomainName, toastError, toastSuccess } from "@/lib/utils";
import { useStore } from "@/stores/store";
import { LinkIcon, SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";
import TextProjectSubtitle from "./text-project-subtitle";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";

export const ProjectURLForm = () => {
    const { urls, selectedProject, projects, projectUrls } = useStore();
    const [edit, setEdit] = useState<boolean>(false);
    const [selectedUrl, setSelectedUrl] = useState<string>("")
    const [showFullURL, setShowFullURL] = useState<boolean>(false);
    const [filterUnusedURLs, setFilterUnusedURLs] = useState<any[]>([]);
    const [filteredProjectURLs, setFileredProjectURLs] = useState<any[]>();

    const handleCategoryChange = (value: string) => {
        // Set local state
        setSelectedUrl(value);
        // Set edit state to change button disabled state
        setEdit(true);
    };

    const handleShowFullURL = () => {
        // Set local state
        setShowFullURL((showFullURL) => !showFullURL);
        // Set local storage
        setShowFullURLLocalStorage(!showFullURL)
    };

    const setShowFullURLLocalStorage = (value: boolean) => {
        // Convert the boolean value to a string before storing in localStorage
        localStorage.setItem("showFullURL", value.toString());
        // Update the showFullURL state with the parsed boolean value from localStorage
        setShowFullURL(value);
    };

    const handleAddUrl = async (value: string) => {
        const UrlSchema = z.string().url();
        try {
            // Validate the URL
            const validatedUrl = UrlSchema.parse(value);
            // Check if the URL exists in global urls fetched from the database
            const url = urls.find((url) => url.url === validatedUrl);

            if (url) {
                // Get the ID of the selected project
                const projectId = projects.find((project) => project.project === selectedProject)?.id;

                if (projectId) {
                    // Add the URL to the database
                    await addProjectUrlToDatabase(projectId, url.id);
                    // Filter out the URL from the filtered URLs
                    setFilterUnusedURLs(filterUnusedURLs.filter((url) => url.url !== validatedUrl))
                    // Resets
                    setSelectedUrl("");
                    setEdit(false);

                    toastSuccess("URL added successfully");
                } else {
                    toastError("Error adding URL: Project ID not found");
                }
            } else {
                toastError("URL does not exist in the database");
            }
        } catch (error) {
            toastError("Error adding URL: " + error);
        }
    };

    const handleFilterUrls = () => {
        // Get the ID of the selected project
        const projectId = projects.find((project) => project.project === selectedProject)?.id;
        // Get the IDs of URLs associated with the selected project
        const projectUrlIds = projectUrls
            .filter((url) => url.projectId === projectId)
            .map((url) => url.urlId);
        // Filter out the URLs that are already connected to the selected project
        const unusedURLs = urls.filter((url) => !projectUrlIds.includes(url.id));
        // Set the filtered URLs in the state
        setFilterUnusedURLs(unusedURLs);
    }

    useEffect(() => {
        handleFilterUrls();
    }, []);

    useEffect(() => {
        handleFetchProjectUrls();
    }, [filterUnusedURLs]);

    useEffect(() => {
        // Get the value from localStorage
        const showFullURLFromLocalStorage = localStorage.getItem("showFullURL");
        if (showFullURLFromLocalStorage) {
            setShowFullURL(JSON.parse(showFullURLFromLocalStorage));
        }
    }, []);


    const handleFetchProjectUrls = async () => {
        const fetchedUrls = await fetchProjectURLs(953000)
        setFileredProjectURLs(fetchedUrls)
    }


    // FIX: Update filteredProjectURLs when a url is added
    // TODO: Create a component to display the urls in their respective categories.
    // TODO: Fetch metdadata through API route on each individual component, with loading state.

    return (
        <div className="flex w-full flex-col">
            <button onClick={() => handleFetchProjectUrls()}>Fetch ProjectURLs</button>
            <div className="flex flex-col items-start sm:flex-row sm:items-center">
                <div className="flex items-center gap-2 pr-4">
                    <LinkIcon size={18} />
                    <TextProjectSubtitle title="Add a new link" />
                </div>
                <div className="mt-1.5 flex items-center gap-2 sm:mt-0 sm:border-l sm:pl-4">
                    <Checkbox
                        id="showFullURL"
                        checked={showFullURL}
                        onCheckedChange={handleShowFullURL}
                        className={`form-checkbox h-4 w-4`}
                    />
                    <label
                        htmlFor="newCategoryCheckbox"
                        className={
                            showFullURL
                                ? "text-sm text-yellow-400"
                                : "" + "select-none text-sm text-muted-foreground/70"
                        }
                    >
                        Show full URL
                    </label>

                </div>
            </div>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Select onValueChange={handleCategoryChange} value={selectedUrl}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a URL" />
                    </SelectTrigger>
                    <SelectContent>
                        {filterUnusedURLs
                            .sort((a, b) => a.category.localeCompare(b.category))
                            .map((url, index) => {
                                return (
                                    <SelectItem key={index} value={url.url.toLowerCase()}>
                                        {showFullURL ? (
                                            <div>
                                                {url.url}
                                                <span className="hidden text-muted-foreground/70 sm:inline">
                                                    {" "}
                                                    - {url.category}
                                                </span>
                                            </div>
                                        ) : (
                                            <div>
                                                {capitalizeFirstLetter(getDomainName(url.url))}
                                                <span className="hidden text-muted-foreground/70 sm:inline">
                                                    {" "}
                                                    - {url.category}
                                                </span>
                                            </div>
                                        )}
                                    </SelectItem>
                                );
                            })}
                    </SelectContent>
                </Select>
                <Button
                    onClick={() => handleAddUrl(selectedUrl)}
                    variant="outline"
                    className="flex w-24 gap-2"
                    disabled={!edit}
                >
                    Push
                    <SaveIcon size={18} />
                </Button>
            </div>
            <div className="mt-6 flex flex-col gap-2 border border-red-500 p-4">
                <span className="text-red-500">Debug</span>
                {JSON.stringify(filteredProjectURLs)}
            </div>

            {filteredProjectURLs &&
                <div className="mt-6 border p-4">
                    {filteredProjectURLs.map((item, index) => {
                        return (
                            <div key={index} className="flex justify-between">
                                <p>{item.urls.url}</p>
                                <p>Category: {item.urls.category}</p>
                            </div>
                        );
                    })}
                </div>
            }
        </div >
    );
};
