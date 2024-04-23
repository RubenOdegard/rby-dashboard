// Hooks
import { useStore } from "@/stores/store";

// Icons
import { EyeIcon, GithubIcon } from "lucide-react";

// UI Components
import { Separator } from "@/components/ui/separator";
import { ProjectURLForm } from "@/components/projects/project-url-form";
import ProjectUrlDisplay from "@/components/projects/project-url-display";
import ProjectLinkDisplay from "@/components/projects/project-link-display";

// Types
import { Projects } from "@/types/types";
import ProjectTextTitle from "@/components/projects/project-text-title";

const ProjectsTabContent = () => {
	// Get selected category from Zustand store
	const { projects, selectedProject } = useStore();
	// Convert selected project to lowercase
	const lowercaseSelectedProject = selectedProject.toLowerCase();
	// Filter projects based on the selected project
	const filteredProjects = projects.filter(
		(project) => project.project.toLowerCase() === lowercaseSelectedProject,
	);

	return (
		<div className="-mt-2 flex flex-col gap-4">
			{filteredProjects.map((project: Projects) => (
				<div key={project.id} className="mt-2 flex flex-col gap-4 border-t">
					<ProjectTextTitle
						title={project.project}
						className="pb-2 pt-6 text-yellow-500 sm:pb-8 sm:pt-12"
					/>
					<section className="flex flex-col gap-2 rounded-lg border p-6 md:p-8">
						<ProjectLinkDisplay
							icon={<GithubIcon className="size-4 md:size-5" />}
							link={project.livePreview}
							title="Github Repository"
							id={project.id}
							type="github"
						/>
						<Separator className="my-3" />
						<ProjectLinkDisplay
							icon={<EyeIcon className="size-4 md:size-5" />}
							link={project.github}
							title="Live Demo"
							id={project.id}
							type="preview"
						/>
					</section>
					<section className="flex flex-col gap-2 rounded-lg border p-6 md:p-16">
						<ProjectURLForm />
					</section>
					<section className="flex flex-col gap-2 rounded-lg border p-6 md:p-16">
						<ProjectUrlDisplay />
					</section>
				</div>
			))}
		</div>
	);
};

export default ProjectsTabContent;
