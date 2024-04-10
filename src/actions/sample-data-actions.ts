"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/db";
import { eq } from "drizzle-orm";
import { urls } from "@/db/schema";

// Function to test database with sample data
export async function insertSampleData() {
	try {
		await db
			.insert(urls)
			.values({
				url: "https://example.com",
				category: "Example",
				favorite: false,
			})
			.returning();
		revalidatePath("/");
	} catch (error) {
		console.error("Error inserting sample data:", error);
		throw error;
	}
}

// Function to test deleting data from database
export async function deleteSampleData(idToDelete: number) {
	try {
		await db.delete(urls).where(eq(urls.id, idToDelete)).returning({
			idToDelete: urls.id,
		});
		revalidatePath("/");
	} catch (error) {
		console.error("Error deleting sample data:", error);
		throw error;
	}
}
