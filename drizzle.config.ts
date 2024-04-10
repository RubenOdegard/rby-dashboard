import { cwd } from "node:process";
import type { Config } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(cwd());

if (!process.env.TURSO_DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

if (!process.env.TURSO_AUTH_TOKEN) {
  throw new Error("TURSO_DATABASE_URL is not set");
}

export default {
  schema: "./src/db/schema.ts",
  out: "./migrations",
  driver: "turso",
  verbose: true,
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;

// turso db shell turso-prisma-db < ./prisma/migrations/20230922132717_init/migration.sql
