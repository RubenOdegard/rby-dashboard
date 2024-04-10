"use server";

import { db } from "@/db/db";
import {
  InsertProject,
  projects,
  projectUrls,
  SelectProject,
  SelectProjectUrl,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Function to fetch all projects from database
export async function fetchProjectDataFromDatabase(): Promise<SelectProject[]> {
  const result = await db.select().from(projects).all();
  return result;
}

// Function to fetch all projects from database
export async function fetchProjectURLsFromDatabase(): Promise<
  SelectProjectUrl[]
> {
  const result = await db.select().from(projectUrls).all();
  return result;
}

// Function to fetch all urls based on project id
export async function fetchURLDataFromProjectId(id: number) {
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
  try {
    // Insert project into the projects table
    await db
      .insert(projects)
      .values({
        id: id,
        project: project,
        livePreview: livePreview,
        github: github,
      })
      .returning();

    // Revalidate path or perform any other necessary actions
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
  try {
    await db
      .update(projects)
      .set({ github: value })
      .where(eq(projects.id, id))
      .returning();
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
  try {
    await db
      .update(projects)
      .set({ livePreview: value })
      .where(eq(projects.id, id))
      .returning();
    revalidatePath("/");
  } catch (error) {
    console.error(`Error updating live preview link for ${id}:`, error);
    throw error;
  }
}
