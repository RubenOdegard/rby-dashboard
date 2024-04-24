"use server";

import { db } from "@/db/db";
import { InsertUrl, SelectUrl, urls } from "@/db/schema";
import { checkUserAuthOrThrowError, createTimeout } from "@/lib/actions-utils";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// FIX: When adding to the database, check if it exists first
//
// TODO: Add authorization to all actions
// For this, each function either needs to use or insert a user id to the database together with the other data

export async function insertURLToDatabase({
	url,
	category,
	favorite,
}: InsertUrl) {
	try {
		await checkUserAuthOrThrowError();
		await Promise.race([
			db
				.insert(urls)
				.values({
					url: url,
					category: category,
					favorite: favorite,
				})
				.returning(),
			createTimeout(3000),
		]);
		revalidatePath("/");
	} catch (error) {
		throw new Error(`Error inserting URL ${url}: ${error}`);
	}
}

export async function deleteURLFromDatabaseByID(id: number) {
	try {
		await checkUserAuthOrThrowError();
		await Promise.race([
			db.delete(urls).where(eq(urls.id, id)),
			createTimeout(3000),
		]);
		revalidatePath("/");
	} catch (error) {
		throw new Error(`Error deleting URL data with ID ${id}: ${error}`);
	}
}

export async function deleteURLFromDatabaseByURL(url: string) {
	try {
		await checkUserAuthOrThrowError();
		await Promise.race([
			db.delete(urls).where(eq(urls.url, url)),
			createTimeout(3000),
		]);
		revalidatePath("/");
	} catch (error) {
		throw new Error(`Error deleting URL ${url}: ${error}`);
	}
}

export async function updateFavoriteStatusInDatabase(
	id: number,
	favorite: boolean,
) {
	try {
		await checkUserAuthOrThrowError();
		await Promise.race([
			db.update(urls).set({ favorite: favorite }).where(eq(urls.id, id)),
			createTimeout(3000),
		]);
		revalidatePath("/");
	} catch (error) {
		throw new Error(`Error updating favorite status for ${id}: ${error}`);
	}
}

export async function fetchURLDataFromDatabase() {
	try {
		await checkUserAuthOrThrowError();
		const result = await Promise.race([
			db.select().from(urls).all(),
			createTimeout(3000),
		]);
		const typedResult = result as SelectUrl[];
		return typedResult;
	} catch (error) {}
}
