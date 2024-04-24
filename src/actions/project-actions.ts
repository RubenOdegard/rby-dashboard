"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/db/db";
import {
	InsertProject,
	SelectProject,
	SelectProjectUrl,
	projectUrls,
	projects,
	urls,
} from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { checkUserAuthOrThrowError, createTimeout } from "@/lib/actions-utils";

// FIX: When adding to the database, check if it exists first

// TODO: Add authorization to all actions
// For this, each function either needs to use or insert a user id to the database together with the other data

export async function fetchProjectDataFromDatabase(): Promise<SelectProject[]> {
	try {
		await checkUserAuthOrThrowError();
		const result = await Promise.race([
			db.select().from(projects).all(),
			createTimeout(3000),
		]);
		// Might want to check if the result is actually the correct structure to not run into runtime errors on invalid structure
		const typedResult = result as SelectProject[];
		return typedResult;
	} catch (error) {
		console.error("Error fetching projects:", error);
		throw error;
	}
}

export async function fetchProjectURLsFromDatabase(): Promise<
	SelectProjectUrl[]
> {
	try {
		await checkUserAuthOrThrowError();
		const result = await Promise.race([
			db.select().from(projectUrls).all(),
			createTimeout(3000),
		]);
		const typedResult = result as SelectProjectUrl[];
		return typedResult;
	} catch (error) {
		console.error("Error fetching project URLs:", error);
		throw error;
	}
}

export async function fetchURLDataFromProjectId(id: number) {
	try {
		await checkUserAuthOrThrowError();
		const result = await Promise.race([
			db.select().from(projectUrls).where(eq(projectUrls.projectId, id)).all(),
			createTimeout(3000),
		]);
		const typedResult = result as SelectProjectUrl[];
		return typedResult;
	} catch (error) {
		console.error("Error fetching project:", error);
		throw error;
	}
}

export async function insertProjectToDatabase({
	id,
	project,
	livePreview,
	github,
}: InsertProject) {
	try {
		await checkUserAuthOrThrowError();
		await Promise.race([
			db.insert(projects).values({
				id: id,
				project: project,
				livePreview: livePreview,
				github: github,
			}),
			createTimeout(3000),
		]);
		revalidatePath("/");
	} catch (error) {
		console.error("Error inserting project:", error);
		throw error;
	}
}

export async function updateProjectInDatabaseGithub(
	id: number,
	value: string | undefined | null,
) {
	try {
		await checkUserAuthOrThrowError();
		await Promise.race([
			db.update(projects).set({ github: value }).where(eq(projects.id, id)),
			createTimeout(3000),
		]);
		revalidatePath("/");
	} catch (error) {
		console.error(`Error updating github link for ${id}:`, error);
		throw error;
	}
}

export async function updateProjectInDatabaseLivePreview(
	id: number,
	value: string | undefined | null,
) {
	try {
		await checkUserAuthOrThrowError();
		await Promise.race([
			db
				.update(projects)
				.set({ livePreview: value })
				.where(eq(projects.id, id)),
			createTimeout(3000),
		]);
		revalidatePath("/");
	} catch (error) {
		console.error(`Error updating live preview link for ${id}:`, error);
	}
}

export async function addProjectUrlToDatabase(
	projectId: number,
	urlId: number,
) {
	try {
		await checkUserAuthOrThrowError();
		await Promise.race([
			db.insert(projectUrls).values({
				projectId: projectId,
				urlId: urlId,
			}),
			createTimeout(3000),
		]);
		revalidatePath("/");
	} catch (error) {
		console.error("Error inserting project:", error);
	}
}

export async function fetchProjectURLs(projectId: number) {
	try {
		await checkUserAuthOrThrowError();
		const result = await Promise.race([
			db
				.select()
				.from(urls)
				.fullJoin(projectUrls, eq(urls.id, projectUrls.urlId))
				.where(eq(projectUrls.projectId, projectId))
				.execute(),
			createTimeout(3000),
		]);
		return result;
	} catch (error) {
		console.error("Error fetching project URLs:", error);
		throw error;
	}
}

export async function deleteProjectUrlFromDatabaseByURL(
	projectId: number,
	urlID: number,
) {
	try {
		await checkUserAuthOrThrowError();
		await Promise.race([
			db
				.delete(projectUrls)
				.where(
					and(
						eq(projectUrls.projectId, projectId),
						eq(projectUrls.urlId, urlID),
					),
				)
				.execute(),
			createTimeout(3000),
		]);
		revalidatePath("/");
	} catch (error) {
		console.error("Error deleting project URL:", error);
		throw error;
	}
}
