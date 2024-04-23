"use server";

import { db } from "@/db/db";
import { InsertUrl, SelectUrl, urls } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// FIX: When adding to the database, check if it exists first

const { isAuthenticated } = getKindeServerSession();

// Function to insert data based on Urls interface from types
export async function insertURLToDatabase({
	url,
	category,
	favorite,
}: InsertUrl) {
	if (!(await isAuthenticated())) {
		throw new Error("Not authenticated");
	}
	try {
		await db
			.insert(urls)
			.values({
				url: url,
				category: category,
				favorite: favorite,
			})
			.returning();
		revalidatePath("/");
	} catch (error) {
		throw new Error(`Error inserting URL ${url}: ${error}`);
	}
}

// Function to delete data based on id
export async function deleteURLFromDatabaseByID(id: number) {
	if (!(await isAuthenticated())) {
		throw new Error("Not authenticated");
	}
	try {
		await db.delete(urls).where(eq(urls.id, id));
		revalidatePath("/");
	} catch (error) {
		throw new Error(`Error deleting URL data with ID ${id}: ${error}`);
	}
}

// Function to delete data based on url string
export async function deleteURLFromDatabaseByURL(url: string) {
	if (!(await isAuthenticated())) {
		throw new Error("Not authenticated");
	}
	try {
		await db.delete(urls).where(eq(urls.url, url));
		revalidatePath("/");
	} catch (error) {
		throw new Error(`Error deleting URL ${url}: ${error}`);
	}
}

// Function to update the favorite status of a URL in the database
export async function updateFavoriteStatusInDatabase(
	id: number,
	favorite: boolean,
) {
	if (!(await isAuthenticated())) {
		throw new Error("Not authenticated");
	}
	try {
		await db.update(urls).set({ favorite: favorite }).where(eq(urls.id, id));
		revalidatePath("/");
	} catch (error) {
		throw new Error(`Error updating favorite status for ${id}: ${error}`);
	}
}

// Function to fetch all URLs from database
export async function fetchURLDataFromDatabase() {
	if (!(await isAuthenticated())) {
		throw new Error("Not authenticated");
	}
	const result: SelectUrl[] = await db.select().from(urls).all();
	return result;
}
