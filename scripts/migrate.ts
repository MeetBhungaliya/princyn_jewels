import { loadEnvConfig } from "@next/env";
import { ensureDatabase } from "../lib/db";

loadEnvConfig(process.cwd());

async function migrate() {
  await ensureDatabase();
  console.log("Database ready.");
  process.exitCode = 1;
}

migrate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
