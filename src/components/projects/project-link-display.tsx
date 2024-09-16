import { updateProjectInDatabaseGithub, updateProjectInDatabaseLivePreview } from "@/actions/project-actions";
import ProjectTextSubtitle from "@/components/projects/project-text-subtitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, toastError, toastSuccess } from "@/lib/utils";
import { SaveIcon } from "lucide-react";
import { type ReactNode, useState } from "react";
import { z } from "zod";

const ProjectLinkDisplay = ({
	icon,
	link,
	title,
	id,
	type,
}: {
	icon: ReactNode;
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
		if (!updateLink) {
			setEdit(false);
			return;
		}
		try {
			urlSchema.parse(updateLink);
			if (updateLink !== prevUpdateLink) {
				if (type === "github") {
					await updateProjectInDatabaseGithub(id, updateLink);
					toastSuccess("Github link updated successfully");
				} else if (type === "preview") {
					await updateProjectInDatabaseLivePreview(id, updateLink);
					toastSuccess("Live Demo link updated successfully");
				}
			}
		} catch (error) {
			toastError(`Not a valid URL: ${error}`);
			setUpdateLink(prevUpdateLink);
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
								if (e.target.value !== "") {
									setEdit(true);
								}
							}}
							className={cn(edit && "border-yellow-400", "mt-2", "focus:border-none")}
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

export default ProjectLinkDisplay;
