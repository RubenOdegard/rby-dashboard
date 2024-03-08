import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

// NOTE: Local DB is ran with Turso
// $ turso dev --db-file dd-local-db

// NOTE: Changes are made through sqlite3
// $ sqlite3 dd-local-db.db

// Handle env variable errors
if (!process.env.TURSO_DATABASE_URL) {
  throw new Error("TURSO_DATABASE_URL is not set");
}
if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error("TURSO_AUTH_TOKEN is not set");
}

// Development configuration
const developmentConfig = {
  url: "http://127.0.0.1:8080",
};

// Production configuration
const productionConfig = {
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
};

// Merge configurations based on environment
const config =
  process.env.NODE_ENV === "development" ? developmentConfig : productionConfig;

// Create new client with the merged configuration
const turso = createClient(config);
export const db = drizzle(turso);
