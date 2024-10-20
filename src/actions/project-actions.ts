"use server";

import { db } from "@/db/db";
import {
	type InsertProject,
	type SelectProject,
	type SelectProjectUrl,
	projectUrls,
	projects,
	urls,
} from "@/db/schema";
import { checkUserAuthOrThrowError, createTimeout, getUser, getUserOrThrowError } from "@/lib/actions-utils";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function fetchProjectDataFromDatabase(): Promise<SelectProject[]> {
	try {
		await checkUserAuthOrThrowError();
		const user = await getUserOrThrowError();
		const result = await Promise.race([
			db.select().from(projects).where(eq(projects.owner, user?.id)).all(),
			createTimeout(5000),
		]);
		const typedResult = result as SelectProject[];
		return typedResult;
	} catch (error) {
		console.error("Error fetching projects:", error);
		throw error;
	}
}

export async function fetchProjectUrlsFromDatabase(): Promise<SelectProjectUrl[]> {
	try {
		await checkUserAuthOrThrowError();
		const user = await getUserOrThrowError();
		const result = await Promise.race([
			db.select().from(projectUrls).where(eq(projectUrls.owner, user.id)).all(),
			createTimeout(3000),
		]);
		const typedResult = result as SelectProjectUrl[];
		return typedResult;
	} catch (error) {
		console.error("Error fetching project URLs:", error);
		throw error;
	}
}

export async function fetchUrlDataFromProjectId(id: number) {
	try {
		await checkUserAuthOrThrowError();
		const user = await getUserOrThrowError();
		const result = await Promise.race([
			db
				.select()
				.from(projectUrls)
				.where(and(eq(projectUrls.projectId, id), eq(projectUrls.owner, user.id)))
				.all(),
			createTimeout(3000),
		]);
		const typedResult = result as SelectProjectUrl[];
		return typedResult;
	} catch (error) {
		console.error("Error fetching project:", error);
		throw error;
	}
}

export async function insertProjectToDatabase({ id, project, livePreview, github }: InsertProject) {
	try {
		await checkUserAuthOrThrowError();
		const user = await getUser();
		if (!user) {
			throw new Error("User not found");
		}

		const checkIfProjectExists = await db
			.select()
			.from(projects)
			.where(and(eq(projects.project, project), eq(projects.owner, user.id)))
			.all();

		if (checkIfProjectExists.length > 0) {
			throw new Error("Project already exists");
		}

		await Promise.race([
			db.insert(projects).values({
				id: id,
				project: project,
				livePreview: livePreview,
				github: github,
				owner: user.id,
			}),
			createTimeout(3000),
		]);
		revalidatePath("/");
	} catch (error) {
		console.error("Error inserting project:", error);
		throw error;
	}
}

export async function updateProjectInDatabaseGithub(id: number, value: string | undefined | null) {
	try {
		await checkUserAuthOrThrowError();
		const user = await getUserOrThrowError();
		await Promise.race([
			db
				.update(projects)
				.set({ github: value })
				.where(and(eq(projects.id, id), eq(projects.owner, user.id))),
			createTimeout(3000),
		]);
		revalidatePath("/");
	} catch (error) {
		console.error(`Error updating github link for ${id}:`, error);
		throw error;
	}
}

export async function updateProjectInDatabaseLivePreview(id: number, value: string | undefined | null) {
	try {
		await checkUserAuthOrThrowError();
		const user = await getUserOrThrowError();
		await Promise.race([
			db
				.update(projects)
				.set({ livePreview: value })
				.where(and(eq(projects.id, id), eq(projects.owner, user.id))),
			createTimeout(3000),
		]);
		revalidatePath("/");
	} catch (error) {
		console.error(`Error updating live preview link for ${id}:`, error);
	}
}

export async function addProjectUrlToDatabase(projectId: number, urlId: number) {
	try {
		await checkUserAuthOrThrowError();
		const user = await getUserOrThrowError();

		const checkIfUrlExists = await db
			.select()
			.from(projectUrls)
			.where(
				and(eq(projectUrls.urlId, urlId), eq(projectUrls.projectId, projectId), eq(projectUrls.owner, user.id)),
			)
			.all();

		if (checkIfUrlExists.length > 0) {
			throw new Error("URL already exists");
		}

		await Promise.race([
			db.insert(projectUrls).values({
				projectId: projectId,
				urlId: urlId,
				owner: user.id,
			}),
			createTimeout(3000),
		]);
		revalidatePath("/");
	} catch (error) {
		console.error("Error inserting project:", error);
	}
}

export async function fetchProjectUrls(projectId: number) {
	try {
		await checkUserAuthOrThrowError();
		const user = await getUserOrThrowError();
		const result = await Promise.race([
			db
				.select()
				.from(urls)
				.fullJoin(projectUrls, eq(urls.id, projectUrls.urlId))
				.where(and(eq(projectUrls.projectId, projectId), eq(projectUrls.owner, user.id)))
				.execute(),
			createTimeout(3000),
		]);
		return result;
	} catch (error) {
		console.error("Error fetching project URLs:", error);
		throw error;
	}
}

export async function deleteProjectFromDatabaseById(id: number) {
	try {
		await checkUserAuthOrThrowError();
		const user = await getUserOrThrowError();
		await Promise.race([
			db.delete(projects).where(and(eq(projects.id, id), eq(projects.owner, user.id))),
			createTimeout(3000),
		]);
		revalidatePath("/");
	} catch (error) {
		console.error("Error deleting project:", error);
		throw error;
	}
}

export async function deleteProjectFromDatabaseByName(name: string) {
	try {
		await checkUserAuthOrThrowError();
		const user = await getUserOrThrowError();
		await Promise.race([
			db.delete(projects).where(and(eq(projects.project, name), eq(projects.owner, user.id))),
			createTimeout(3000),
		]);
		revalidatePath("/");
	} catch (error) {
		console.error("Error deleting project:", error);
		throw error;
	}
}

export async function deleteProjectUrlFromDatabaseByUrl(projectId: number, urlId: number) {
	try {
		await checkUserAuthOrThrowError();
		const user = await getUserOrThrowError();
		await Promise.race([
			db
				.delete(projectUrls)
				.where(
					and(
						eq(projectUrls.projectId, projectId),
						eq(projectUrls.urlId, urlId),
						eq(projectUrls.owner, user.id),
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
