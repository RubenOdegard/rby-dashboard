"use client";
import { useStore } from "@/stores/store";
import { EyeIcon, GithubIcon, LinkIcon, SaveIcon } from "lucide-react";
import { Separator } from "./ui/separator";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import TextProjectSubtitle from "./text-project-subtitle";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { capitalizeFirstLetter, getDomainName, toastError, toastSuccess } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";
import TextProjectTitle from "./text-project-title";
import { addProjectUrlToDatabase, updateProjectInDatabaseGithub, updateProjectInDatabaseLivePreview } from "@/actions/project-actions";
import { z } from "zod";
import { Projects, Urls } from "@/types/types";

const ProjectsTabContent = () => {
    // Get selected category from Zustand store
    const { projects, selectedProject } = useStore();
    // Convert selected project to lowercase
    const lowercaseSelectedProject = selectedProject.toLowerCase();
    // Filter projects based on the selected project
    const filteredProjects = projects.filter((project) => project.project.toLowerCase() === lowercaseSelectedProject);

    return (
        <div className="-mt-2 flex flex-col gap-4">
            {filteredProjects.map((project: Projects) => (
                <div key={project.id} className="mt-2 flex flex-col gap-4 border-t">
                    <TextProjectTitle title={project.project} className="pb-2 pt-6 text-yellow-500 sm:pb-8 sm:pt-12" />
                    <div className="flex flex-col gap-2 rounded-lg border p-6 md:p-8">
                        <LinkDisplay
                            icon={<GithubIcon className="size-4 md:size-5" />}
                            link={project.livePreview}
                            title="Github Repository"
                            id={project.id}
                            type="github"
                        />
                        <Separator className="my-3" />
                        <LinkDisplay
                            icon={<EyeIcon className="size-4 md:size-5" />}
                            link={project.github}
                            title="Live Demo"
                            id={project.id}
                            type="preview"
                        />
                    </div>
                    <div className="flex flex-col gap-2 rounded-lg border p-6 md:p-16">
                        <EditProjectForm />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProjectsTabContent;

const LinkDisplay = ({
    icon,
    link,
    title,
    id,
    type,
}: {
    icon: React.ReactNode;
    link: string | undefined | null;
    title: string;
    id: number;
    type: "preview" | "github";
}) => {
    const [edit, setEdit] = useState<boolean>(false);
    const [updateLink, setUpdateLink] = useState<string | undefined | null>(link);
    const [prevUpdateLink, setPrevUpdateLink] = useState<string | undefined | null>(link);

    const handleUpdateLink = async (id: number) => {
        const urlSchema = z.string().url();
        try {
            if (updateLink !== prevUpdateLink) {
                urlSchema.parse(updateLink); // Validate URL using Zod
                if (type === "github") {
                    await updateProjectInDatabaseGithub(id, updateLink);
                    toastSuccess("Github link updated successfully");
                } else if (type === "preview") {
                    await updateProjectInDatabaseLivePreview(id, updateLink);
                    toastSuccess("Live Demo link updated successfully");
                }
            }
        } catch (error: any) {
            toastError("Error updating link: " + error?.message);
        }
        setPrevUpdateLink(updateLink);
        setEdit(false);
    };
    return (
        <div className="flex flex-col items-end justify-between sm:flex-row">
            <div className="flex w-full flex-col items-start text-lg">
                <div className="flex items-center gap-2">
                    {updateLink && (
                        <a href={updateLink} target="_blank" rel="noopener noreferrer">
                            {icon}
                        </a>
                    )}
                    <TextProjectSubtitle title={title} />
                </div>
                <div className="w-full text-xs sm:pr-6 sm:text-base">
                    {edit || !updateLink ? (
                        <Input
                            type="text"
                            value={updateLink || ""}
                            onChange={(e) => setUpdateLink(e.target.value)}
                            className="mt-2 border-yellow-400 focus:border-none"
                        />
                    ) : (
                        <span className="mt-2 flex">
                            <a
                                href={updateLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-10 w-full items-center rounded-md border px-3 py-2 font-mono text-sm text-muted-foreground hover:text-yellow-400 sm:text-base sm:leading-loose"
                            >
                                {updateLink}
                            </a>
                        </span>
                    )}
                </div>
            </div>
            <div className="mt-2 flex place-self-start sm:mt-0 sm:place-self-end">
                {edit ? (
                    <Button onClick={() => handleUpdateLink(id)} variant="outline" className="flex w-24 gap-2">
                        <SaveIcon className="size-4 md:size-5 text-yellow-400" />
                        Save
                    </Button>
                ) : (
                    <Button onClick={() => setEdit(!edit)} variant="outline" className="flex w-24 gap-2">
                        <SaveIcon className="size-4 md:size-5" />
                        Edit
                    </Button>
                )}
            </div>
        </div>
    );
};

const EditProjectForm = () => {
    const { urls, selectedProject, projects, projectUrls } = useStore();
    const [edit, setEdit] = useState<boolean>(false);
    const [selectedUrl, setSelectedUrl] = useState<string>("")
    const [showFullURL, setShowFullURL] = useState<boolean>(false);
    const [filterUnusedURLs, setFilterUnusedURLs] = useState<any[]>([]);

    const handleCategoryChange = (value: string) => {
        setSelectedUrl(value);
        setEdit(true);
    };

    const handleShowFullURL = () => {
        setShowFullURL((showFullURL) => !showFullURL);
    };


    const handleAddUrl = async (value: string) => {
        const UrlSchema = z.string().url();
        try {
            const validatedUrl = UrlSchema.parse(value);
            const url = urls.find((url) => url.url === validatedUrl);

            if (url) {
                const projectId = projects.find((project) => project.project === selectedProject)?.id;

                if (projectId) {
                    await addProjectUrlToDatabase(projectId, url.id);
                    setFilterUnusedURLs(filterUnusedURLs.filter((url) => url.url !== validatedUrl))
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

    // Rerender the component and filter the URLs when anything acociated with project change or urls change
    useEffect(() => {
        handleFilterUrls();
    }, [selectedProject, projectUrls, urls, selectedUrl]);



    // TODO: Add show full url to locale storage to persist on refresh


    return (
        <div className="flex w-full flex-col">
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
        </div >
    );
};
