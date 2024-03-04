"use server";

import { db } from "@/db/db";
import { urls } from "@/drizzle/schema";
import { Urls } from "@/types/urls";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { revalidateTag } from "next/cache";

// Function to test database with sample data
export async function insertSampleData() {
  try {
    await db
      .insert(urls)
      .values({
        url: "https://example.com",
        category: "Example",
        project: "Sample Project",
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
    console.error("Error inserting sample data:", error);
    throw error;
  }
}

// Function to insert data based on Urls interface from types
export async function insertURLToDatabase({
  url,
  category,
  project,
  favorite,
}: Urls) {
  try {
    await db
      .insert(urls)
      .values({
        url: url,
        category: category,
        project: project,
        favorite: favorite,
      })
      .returning();
    revalidatePath("/");
  } catch (error) {
    console.error("Error inserting URL data:", error);
    throw error;
  }
}

export async function deleteURLFromDatabase(id: number) {
  try {
    await db.delete(urls).where(eq(urls.id, id));
    revalidatePath("/");
  } catch (error) {
    console.error("Error deleting URL data:", error);
    throw error;
  }
}

// Function to update the favorite status of a URL in the database
export async function updateFavoriteStatusInDatabase(
  id: number,
  favorite: boolean,
) {
  try {
    await db.update(urls).set({ favorite: favorite }).where(eq(urls.id, id));
    revalidatePath("/");
  } catch (error) {
    console.error("Error updating favorite status in the database:", error);
    throw error;
  }
}

// Function to fetch all URLs from database
export async function fetchDataFromDatabase() {
  const result = await db.select().from(urls).all();
  return result;
}
