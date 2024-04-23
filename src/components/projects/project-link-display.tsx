// Hooks
import { useState } from "react";

// Actions
import {
	updateProjectInDatabaseGithub,
	updateProjectInDatabaseLivePreview,
} from "@/actions/project-actions";

// Icons
import { SaveIcon } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Utils
import { z } from "zod";
import { cn, toastError, toastSuccess } from "@/lib/utils";
import ProjectTextSubtitle from "@/components/projects/project-text-subtitle";

// FIX: Add error handling for URL validation, reset input to empty string if invalid

const ProjectLinkDisplay = ({
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
	const [prevUpdateLink, setPrevUpdateLink] = useState<
		string | undefined | null
	>(link);

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
					{icon}
					<ProjectTextSubtitle title={title} />
				</div>
				<div className="w-full text-xs sm:pr-6 sm:text-base">
					{edit || !updateLink ? (
						<Input
							type="text"
							value={updateLink || ""}
							onChange={(e) => {
								setUpdateLink(e.target.value);
								// Check if the input is not empty to maintain edit state
								if (e.target.value !== "") {
									setEdit(true);
								}
							}}
							className={cn(
								edit && "border-yellow-400",
								"mt-2",
								"focus:border-none",
							)}
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
					<Button
						onClick={() => handleUpdateLink(id)}
						variant="outline"
						className="flex w-24 gap-2"
					>
						<SaveIcon className="size-4 md:size-5 text-yellow-400" />
						Save
					</Button>
				) : (
					<Button
						onClick={() => setEdit(!edit)}
						variant="outline"
						className="flex w-24 gap-2"
					>
						<SaveIcon className="size-4 md:size-5" />
						Edit
					</Button>
				)}
			</div>
		</div>
	);
};

export default ProjectLinkDisplay;