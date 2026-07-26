import path from "node:path";
import { mkdirSync, existsSync } from "node:fs";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "@/lib/db/schema";
import { runMigrations } from "@/lib/db/migrator";
import { restoreLatestBackup } from "./backup";

declare global {
  var __db: ReturnType<typeof drizzle<typeof schema>> | undefined;
  var __databaseReady: Promise<void> | undefined;
}

let databasePath = process.env.DATABASE_PATH || path.join(process.cwd(), "var", "www", "storage", "database");

try {
  if (!existsSync(databasePath)) {
    mkdirSync(databasePath, { recursive: true });
  }
} catch (error) {
  databasePath = path.join(process.cwd(), "var", "www", "storage", "database");
  if (!existsSync(databasePath)) {
    mkdirSync(databasePath, { recursive: true });
  }
}

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
      path.join(process.cwd(), "drizzle"),
    ).catch(async (err) => {
      console.error("[db] Migration failed, attempting restore:", err);
      const restored = await restoreLatestBackup(databasePath);
      if (restored) {
        try {
          await runMigrations(db, path.join(process.cwd(), "drizzle"));
          return;
        } catch (retryErr) {
          global.__databaseReady = undefined;
          throw retryErr;
        }
      }
      global.__databaseReady = undefined;
      throw err;
    });
  }
  return global.__databaseReady;
}
