"use server";

import { db } from "@/db/db";
import { urls } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const { isAuthenticated } = getKindeServerSession();

// Function to test database with sample data
export async function insertSampleData() {
	if (!(await isAuthenticated())) {
		throw new Error("Not authenticated");
	}
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
	if (!(await isAuthenticated())) {
		throw new Error("Not authenticated");
	}
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
