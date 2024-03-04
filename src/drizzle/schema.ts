import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Defined the schema of the table
export const urls = sqliteTable("urls", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  url: text("url").notNull(),
  category: text("category").notNull(),
  project: text("project").notNull().default("none"),
  favorite: integer("favorite", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Command to generate a migration
// npx drizzle-kit generate:sqlite
//
// Command to run migrations
// npx drizzle-kit push:sqlite
//
