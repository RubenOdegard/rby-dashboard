"use client";

// Hooks
import { useStore } from "@/stores/store";
import { useState } from "react";

// Actions
import { updateProjectInDatabaseGithub, updateProjectInDatabaseLivePreview } from "@/actions/project-actions";

// Icons
import { EyeIcon, GithubIcon, SaveIcon } from "lucide-react";

// UI Components
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import TextProjectSubtitle from "./text-project-subtitle";
import TextProjectTitle from "./text-project-title";
import { ProjectURLForm } from "./project-url-form";

// Utils
import { z } from "zod";
import { toastError, toastSuccess } from "@/lib/utils";

// Types
import { Projects, } from "@/types/types";

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
                        <ProjectURLForm />
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

