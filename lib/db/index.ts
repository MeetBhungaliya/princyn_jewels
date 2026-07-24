import path from "node:path";
import { mkdirSync } from "node:fs";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "@/lib/db/schema";
import { runMigrations } from "@/lib/db/migrator";

declare global {
  var __db: ReturnType<typeof drizzle<typeof schema>> | undefined;
  var __databaseReady: Promise<void> | undefined;
}

const databasePath = path.join(process.cwd(), "data", "database");
mkdirSync(databasePath, { recursive: true });

function getDb() {
  if (!global.__db) {
    global.__db = drizzle({ connection: { dataDir: databasePath }, schema });
  }
  return global.__db;
}

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_target, prop, receiver) {
    const connection = getDb();
    const value = Reflect.get(connection, prop, receiver);
    return typeof value === "function" ? value.bind(connection) : value;
  },
});

export function ensureDatabase(): Promise<void> {
  if (!global.__databaseReady) {
    global.__databaseReady = runMigrations(
      db,
      path.join(process.cwd(), "drizzle")
    ).catch((err) => {
      // Reset so the next request retries
      global.__databaseReady = undefined;
      throw err;
    });
  }
  return global.__databaseReady;
}
