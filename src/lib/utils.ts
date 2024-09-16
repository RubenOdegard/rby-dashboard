import { type ClassValue, clsx } from "clsx";
import moment from "moment";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getDomainName(url: string) {
	const domain = new URL(url).hostname;
	return domain;
}

export const generateRandomId = () => {
	return Math.floor(Math.random() * 1000000);
};

export function toastSuccess(string: string) {
	return toast.success(string, {
		description: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
	});
}

export function toastError(string: string) {
	return toast.error(string, {
		description: moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a"),
	});
}

export function getProjectIdFromUrl(selectedProject: string, projects: any) {
	const projectId = projects.find((project: any) => project.project === selectedProject)?.id;
	return projectId;
}
