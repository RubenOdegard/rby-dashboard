"use server";

import { db } from "@/db/db";
import { type InsertUrl, type SelectUrl, urls } from "@/db/schema";
import { checkUserAuthOrThrowError, createTimeout, getUserOrThrowError } from "@/lib/actions-utils";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function insertUrlToDatabase({ url, category, favorite }: InsertUrl) {
	const checkIfUrlExists = await db
		.select()
		.from(urls)
		.where(and(eq(urls.url, url), eq(urls.owner, (await getUserOrThrowError()).id)))
		.all();

	if (checkIfUrlExists.length > 0) {
		throw new Error(`URL ${url} already exists in the database.`);
	}

	try {
		await checkUserAuthOrThrowError();
		const user = await getUserOrThrowError();
		await Promise.race([
			db
				.insert(urls)
				.values({
					url: url,
					category: category,
					favorite: favorite,
					owner: user.id,
				})
				.returning(),
			createTimeout(3000),
		]);
		revalidatePath("/");
	} catch (error) {
		throw new Error(`Error inserting URL ${url}: ${error}`);
	}
}

export async function deleteUrlFromDatabaseById(id: number) {
	try {
		await checkUserAuthOrThrowError();
		const user = await getUserOrThrowError();
		await Promise.race([db.delete(urls).where(and(eq(urls.id, id), eq(urls.owner, user.id))), createTimeout(3000)]);
		revalidatePath("/");
	} catch (error) {
		throw new Error(`Error deleting URL data with ID ${id}: ${error}`);
	}
}

export async function deleteUrlFromDatabaseByUrl(url: string) {
	try {
		await checkUserAuthOrThrowError();
		const user = await getUserOrThrowError();
		await Promise.race([
			db.delete(urls).where(and(eq(urls.url, url), eq(urls.owner, user.id))),
			createTimeout(3000),
		]);
		revalidatePath("/");
	} catch (error) {
		throw new Error(`Error deleting URL ${url}: ${error}`);
	}
}

export async function updateFavoriteStatusInDatabase(id: number, favorite: boolean) {
	try {
		await checkUserAuthOrThrowError();
		const user = await getUserOrThrowError();
		await Promise.race([
			db
				.update(urls)
				.set({ favorite: favorite })
				.where(and(eq(urls.id, id), eq(urls.owner, user.id))),
			createTimeout(3000),
		]);
		revalidatePath("/");
	} catch (error) {
		throw new Error(`Error updating favorite status for ${id}: ${error}`);
	}
}

export async function fetchUrlDataFromDatabase() {
	try {
		await checkUserAuthOrThrowError();
		const user = await getUserOrThrowError();
		const result = await Promise.race([
			db.select().from(urls).where(eq(urls.owner, user.id)).all(),
			createTimeout(20000),
		]);
		const typedResult = result as SelectUrl[];
		return typedResult;
	} catch (error) {
		throw new Error(`Error fetching URL data for user: ${error}`);
	}
}
