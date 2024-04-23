"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/db/db";
import {
	InsertProject,
	projects,
	projectUrls,
	SelectProject,
	SelectProjectUrl,
	urls,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";

// FIX: When adding to the database, check if it exists first

const { isAuthenticated } = getKindeServerSession();

// Function to fetch all projects from database
export async function fetchProjectDataFromDatabase(): Promise<SelectProject[]> {
	if (!(await isAuthenticated())) {
		throw new Error("Not authenticated");
	}
	const result = await db.select().from(projects).all();
	return result;
}

// Function to fetch all projects from database
export async function fetchProjectURLsFromDatabase(): Promise<
	SelectProjectUrl[]
> {
	if (!(await isAuthenticated())) {
		throw new Error("Not authenticated");
	}
	const result = await db.select().from(projectUrls).all();
	return result;
}

// Function to fetch all urls based on project id
export async function fetchURLDataFromProjectId(id: number) {
	if (!(await isAuthenticated())) {
		throw new Error("Not authenticated");
	}
	const result = await db
		.select()
		.from(projectUrls)
		.where(eq(projectUrls.projectId, id))
		.all();
	return result;
}

// Function to insert data based on Urls interface from types
export async function insertProjectToDatabase({
	id,
	project,
	livePreview,
	github,
}: InsertProject) {
	if (!(await isAuthenticated())) {
		throw new Error("Not authenticated");
	}
	try {
		await db.insert(projects).values({
			id: id,
			project: project,
			livePreview: livePreview,
			github: github,
		});
		revalidatePath("/");
	} catch (error) {
		console.error("Error inserting project:", error);
		throw error;
	}
}

// Functiont o update the github link in the database based on project id
export async function updateProjectInDatabaseGithub(
	id: number,
	value: string | undefined | null,
) {
	if (!(await isAuthenticated())) {
		throw new Error("Not authenticated");
	}
	try {
		await db.update(projects).set({ github: value }).where(eq(projects.id, id));
		revalidatePath("/");
	} catch (error) {
		console.error(`Error updating github link for ${id}:`, error);
		throw error;
	}
}
//
// Functiont o update the github link in the database based on project id
export async function updateProjectInDatabaseLivePreview(
	id: number,
	value: string | undefined | null,
) {
	if (!(await isAuthenticated())) {
		throw new Error("Not authenticated");
	}
	try {
		await db
			.update(projects)
			.set({ livePreview: value })
			.where(eq(projects.id, id));
		revalidatePath("/");
	} catch (error) {
		console.error(`Error updating live preview link for ${id}:`, error);
	}
}

// Function to insert data based on Urls interface from types
export async function addProjectUrlToDatabase(
	projectId: number,
	urlId: number,
) {
	if (!(await isAuthenticated())) {
		throw new Error("Not authenticated");
	}
	try {
		await db.insert(projectUrls).values({
			projectId: projectId,
			urlId: urlId,
		});
		revalidatePath("/");
	} catch (error) {
		console.error("Error inserting project:", error);
	}
}

// Function to fetch all urls based on project id
export async function fetchProjectURLs(projectId: number) {
	if (!(await isAuthenticated())) {
		throw new Error("Not authenticated");
	}
	const result = await db
		.select()
		.from(urls)
		.fullJoin(projectUrls, eq(urls.id, projectUrls.urlId))
		.where(eq(projectUrls.projectId, projectId))
		.execute();
	return result;
}

// Function to delete a project_url from the database by url
export async function deleteProjectUrlFromDatabaseByURL(
	projectId: number,
	urlID: number,
) {
	if (!(await isAuthenticated())) {
		throw new Error("Not authenticated");
	}
	try {
		await db
			.delete(projectUrls)
			.where(
				and(eq(projectUrls.projectId, projectId), eq(projectUrls.urlId, urlID)),
			)
			.execute();
		revalidatePath("/");
	} catch (error) {
		throw new Error(
			`Error deleting project_url with projectId ${projectId} and url ${urlID}: ${error}`,
		);
	}
}
