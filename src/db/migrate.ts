import { resolve } from "node:path";
import { cwd } from "node:process";
import { loadEnvConfig } from "@next/env";
import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./db";

loadEnvConfig(cwd());

(async () => {
	await migrate(db, {
		migrationsFolder: resolve(__dirname, "../../migrations"),
	});
})();
