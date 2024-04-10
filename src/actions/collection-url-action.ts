"use server";

import { db } from "@/db/db";
import { SelectUrl } from "@/db/schema";
import { InsertUrl, urls } from "@/drizzle/schema";
import { Urls } from "@/types/urls";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Function to insert data based on Urls interface from types
export async function insertURLToDatabase({
  url,
  category,
  favorite,
}: InsertUrl): Promise<InsertUrl> {
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
    console.error(`Error inserting URL ${url}:`, error);
    throw error;
  }
}

// Function to delete data based on id
export async function deleteURLFromDatabaseByID(id: number) {
  try {
    await db.delete(urls).where(eq(urls.id, id));
    revalidatePath("/");
  } catch (error) {
    console.error(`Error deleting URL data with ID ${id}:`, error);
    throw error;
  }
}

// Function to delete data based on url string
export async function deleteURLFromDatabaseByURL(url: string) {
  try {
    await db.delete(urls).where(eq(urls.url, url));
    revalidatePath("/");
  } catch (error) {
    console.error(`Error deleting URL ${url}:`, error);
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
    console.error(`Error updating favorite status for ${id}:`, error);
    throw error;
  }
}

// Function to fetch all URLs from database
export async function fetchURLDataFromDatabase(): Promise<SelectUrl[]> {
  const result: SelectUrl[] = await db.select().from(urls).all();
  return result;
}
