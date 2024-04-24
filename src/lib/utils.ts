import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";
import { toast } from "sonner";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

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

export function getProjectIDFromURL(selectedProject: string, projects: any) {
	const projectId = projects.find(
		(project: any) => project.project === selectedProject,
	)?.id;
	return projectId;
}

// !!! Custom function to create a timeout promise, which will race against the database call !!!
// !!! This serves as a way to cancel the database call if it takes too long. !!!
export function createTimeout(duration: number) {
	return new Promise((_, reject) => {
		setTimeout(() => {
			reject(new Error("Operation timed out"));
		}, duration);
	});
}

// !!! User auth needs to be checked before a database call !!!
// !!! Additionally check if the users id === the user id on the selected row in a table !!!
// !!! Users can only edit their own data. If this is not checked, a authenticated user can edit other users data !!!
export const checkUserAuthOrThrowError = async () => {
	const { isAuthenticated } = getKindeServerSession();
	if (await isAuthenticated()) {
		return true;
	} else {
		throw new Error("Not authenticated");
	}
};
