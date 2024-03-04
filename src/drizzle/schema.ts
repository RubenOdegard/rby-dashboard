import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const urls = sqliteTable("urls", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  url: text("url").notNull(),
  category: text("category").notNull(),
  project: text("category").notNull(),
  favorite: integer("favorite", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
