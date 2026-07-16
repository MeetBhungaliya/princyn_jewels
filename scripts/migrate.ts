import { loadEnvConfig } from "@next/env";
import { ensureDatabase } from "../lib/db";

loadEnvConfig(process.cwd());

async function migrate() {
  await ensureDatabase();
  console.log("Database ready.");
}

migrate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
