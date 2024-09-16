"use client";

import {
	deleteProjectFromDatabaseByName,
	fetchProjectDataFromDatabase,
	insertProjectToDatabase,
} from "@/actions/project-actions";
import DialogPlusButton from "@/components/dialog-plus-button";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { generateRandomId, toastError, toastSuccess } from "@/lib/utils";
import { useStore } from "@/stores/store";
import type { ProjectFormData } from "@/types/projectFormData";
import type { Projects } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, GithubIcon, LinkIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	project: z.string().min(1, { message: "Project name is required" }),
	livePreview: z.string().optional(),
	github: z.string().optional(),
});

const ProjectNewForm = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ProjectFormData>({
		resolver: zodResolver(formSchema),
	});

	const { projects, setProjects, selectedProject, setSelectedProject } = useStore();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const handleDialogChange = () => {
		reset();
		setDialogOpen((prev) => !prev);
	};

	const handleAddProject = async (data: Projects) => {
		formSchema.parse(data);

		try {
			const id = generateRandomId();
			await insertProjectToDatabase({
				id: id,
				project: data.project,
				livePreview: data.livePreview || "",
				github: data.github || "",
				owner: "",
			});

			setProjects([
				...projects,
				{
					id: id,
					project: data.project,
					livePreview: data.livePreview || "",
					github: data.github || "",
				},
			]);

			toastSuccess(`Successfully added ${data.project}`);
		} catch (error) {
			toastError(`Error adding ${data.project}`);
			console.error(error);
			return;
		}
		reset();
		fetchProjectDataFromDatabase();
		setDialogOpen(false);
	};

	const openDeleteDialog = () => {
		setDeleteDialogOpen(true);
	};

	const closeDeleteDialog = () => {
		setDeleteDialogOpen(false);
	};

	const handleDeleteProject = async () => {
		if (!selectedProject) {
			return;
		}

		try {
			await deleteProjectFromDatabaseByName(selectedProject); // Try to delete from database
			console.log("deleted from database", selectedProject);
			setProjects(projects.filter((project) => project.project !== selectedProject)); // Delete from local state on success
			setSelectedProject(projects[0]?.project || ""); // Reset selected project

			localStorage.setItem("selectedProject", projects[0]?.project || "");

			// Confirm deletion to user and close dialog
			toastSuccess(`Successfully deleted project ${selectedProject}`);
			closeDeleteDialog();
		} catch (error) {
			toastError(`Error deleting project: ${selectedProject}`);
			console.error("Error deleting project:", error);
		}
	};

	return (
		<>
			{/* Add Project Dialog */}
			<Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
				<DialogTrigger asChild={true}>
					<DialogPlusButton icon={false}>
						<span className="mr-2 inline sm:hidden">
							Add a new <strong>Project</strong>
						</span>
					</DialogPlusButton>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add a new Project</DialogTitle>
						<DialogDescription>
							<form onSubmit={handleSubmit(handleAddProject)} className="flex flex-col space-y-6">
								<div className="mt-1 flex flex-col gap-1 border-t">
									{/* Project Name */}
									<label htmlFor="url" className="mb-1 mt-4 flex items-center gap-1.5 text-white">
										<LinkIcon size={14} className="rounded-sm text-yellow-400" />
										Name
									</label>
									<Input
										type="text"
										id="project"
										placeholder="Developer Dashboard"
										{...register("project")}
										className=""
									/>
									{errors.project && <p className="mt-1 text-red-500">{errors.project.message}</p>}

									{/* Live Preview */}
									<label
										htmlFor="livePreview"
										className="mb-1 mt-4 flex items-center gap-1.5 text-white"
									>
										<EyeIcon size={14} className="rounded-sm text-yellow-400" /> Live preview{" "}
										<span className="text-muted-foreground/70">(optional)</span>
									</label>
									<Input
										type="text"
										id="livePreview"
										placeholder="https://example.com"
										{...register("livePreview")}
										className=""
									/>
									{errors.livePreview && (
										<p className="mt-1 text-red-500">{errors.livePreview.message}</p>
									)}

									{/* GitHub Repository */}
									<label htmlFor="github" className="mb-1 mt-4 flex items-center gap-1.5 text-white">
										<GithubIcon size={14} className="rounded-sm text-yellow-400" />
										Github repository <span className="text-muted-foreground/70">(optional)</span>
									</label>
									<Input
										type="text"
										id="github"
										placeholder="https://github.com/rubenodegard/example"
										{...register("github")}
										className=""
									/>
									{errors.github && <p className="mt-1 text-red-500">{errors.github.message}</p>}
								</div>
								<Button type="submit" className="rounded">
									Add Project
								</Button>
							</form>
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>

			{/* Delete Project Button */}
			<Button
				variant="destructive"
				size="manual"
				onClick={() => openDeleteDialog()}
				className="aspect-square h-10 w-full p-0.5 sm:w-10"
			>
				<TrashIcon className="size-4 hidden sm:inline" />
				<span className="inline sm:hidden">Delete Project</span>
			</Button>

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Deletion</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete the project <strong>{selectedProject}</strong>? This action
							cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<div className="flex justify-end gap-4">
						<Button variant="secondary" onClick={closeDeleteDialog}>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDeleteProject}>
							Confirm Delete
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default ProjectNewForm;
