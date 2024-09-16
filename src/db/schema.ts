import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const urls = sqliteTable("urls", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	url: text("url").notNull(),
	category: text("category").notNull(),
	favorite: integer("favorite", { mode: "boolean" }).notNull().default(false),
	createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
	owner: text("owner").notNull(),
});

export type InsertUrl = typeof urls.$inferInsert;
export type SelectUrl = typeof urls.$inferSelect;

export const projects = sqliteTable("projects", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
	project: text("project").notNull(),
	createdAt: text("created_at").notNull().default(sql`(CURRENT_TIMESTAMP)`),
	livePreview: text("live_preview"),
	github: text("github"),
	owner: text("owner").notNull(),
});

export type InsertProject = typeof projects.$inferInsert;
export type SelectProject = typeof projects.$inferSelect;

export const projectUrls = sqliteTable("project_urls", {
	projectId: integer("project_id").references(() => projects.id, { onDelete: "cascade" }),
	urlId: integer("url_id").references(() => urls.id, { onDelete: "cascade" }),
	owner: text("owner").notNull(),
});

export type InsertProjectUrl = typeof projectUrls.$inferInsert;
export type SelectProjectUrl = typeof projectUrls.$inferSelect;

// Command to generate a migration
// npx drizzle-kit generate:sqlite
//
// Command to run migrations
// npx drizzle-kit push:sqlite
//
