import { loadEnvConfig } from "@next/env";
import { ensureDatabase } from "../lib/db";

loadEnvConfig(process.cwd());

async function migrate() {
  await ensureDatabase();
  console.log("Database ready.");
  process.exit(0);
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});
