import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

// Handle env variable errors
if (!process.env.TURSO_DATABASE_URL) {
	throw new Error("TURSO_DATABASE_URL is not set");
}
if (!process.env.TURSO_AUTH_TOKEN) {
	throw new Error("TURSO_AUTH_TOKEN is not set");
}

// Merge configurations based on environment
export const connection = {
	url: process.env.TURSO_DATABASE_URL,
	// url: "file:local.db",
	authToken: process.env.TURSO_AUTH_TOKEN,
};

// Create new client with the merged configuration
const turso = createClient(connection);
export const db = drizzle(turso);
