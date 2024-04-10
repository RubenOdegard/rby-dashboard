"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useStore } from "@/stores/store";
import {
	fetchProjectDataFromDatabase,
	insertProjectToDatabase,
} from "@/actions/project-actions";
import { generateRandomId, toastError, toastSuccess } from "@/lib/utils";
import { EyeIcon, GithubIcon, LinkIcon, PlusIcon } from "lucide-react";
import { ProjectFormData } from "@/types/projectFormData";
import { Projects } from "@/types/projects";
import DialogPlusButton from "./dialog-plus-button";

const formSchema = z.object({
	project: z.string().min(1, { message: "Project name is required" }),
	livePreview: z.string().optional(),
	github: z.string().optional(),
});

const AddProjectForm = () => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ProjectFormData>({
		resolver: zodResolver(formSchema),
	});

	// Get global vars from store
	const { projects, setProjects } = useStore();
	// Handle dialog state
	const [dialogOpen, setDialogOpen] = useState(false);

	const handleDialogChange = () => {
		reset();
		setDialogOpen((prev) => !prev);
	};

	const handleAddProject = async (data: Projects) => {
		// Validate the input fields
		formSchema.parse(data);

		try {
			const id = generateRandomId();
			await insertProjectToDatabase({
				id: id,
				project: data.project,
				livePreview: data.livePreview || "",
				github: data.github || "",
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
			return;
		}
		reset();
		fetchProjectDataFromDatabase();
		setDialogOpen(false);
	};

	return (
		<Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
			<DialogTrigger asChild>
				<DialogPlusButton />
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						<div className="flex flex-col gap-0.5 text-2xl">
							<div>Add a new Project</div>
						</div>
					</DialogTitle>
					<DialogDescription>
						<form
							onSubmit={handleSubmit(handleAddProject)}
							className="flex flex-col space-y-6"
						>
							<div className="mt-1 flex flex-col gap-1 border-t">
								<label
									htmlFor="url"
									className="mb-1 mt-4 flex items-center gap-1.5 text-white"
								>
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

								{errors.project && (
									<p className="mt-1 text-red-500">{errors.project.message}</p>
								)}

								<label
									htmlFor="livePreview"
									className="mb-1 mt-4 flex items-center gap-1.5 text-white"
								>
									<EyeIcon size={14} className="rounded-sm text-yellow-400" />{" "}
									Live preview{"  "}
									<span className="text-muted-foreground/70">(optional)</span>
								</label>
								<Input
									type="text"
									id="livePreview"
									placeholder="https://example.com"
									{...register("livePreview")}
									className=""
								/>

								{errors.project && (
									<p className="mt-1 text-red-500">{errors.project.message}</p>
								)}
								<label
									htmlFor="github"
									className="mb-1 mt-4 flex items-center gap-1.5 text-white"
								>
									<GithubIcon
										size={14}
										className="rounded-sm text-yellow-400"
									/>
									Github repository
									<span className="text-muted-foreground/70">(optional)</span>
								</label>
								<Input
									type="text"
									id="github"
									placeholder="https://github.com/rubenodegard/example"
									{...register("github")}
									className=""
								/>

								{errors.project && (
									<p className="mt-1 text-red-500">{errors.project.message}</p>
								)}
							</div>
							<Button type="submit" className="rounded">
								Add Project
							</Button>
						</form>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

export default AddProjectForm;
