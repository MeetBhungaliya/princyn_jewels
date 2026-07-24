/**
 * Custom PGlite migrator that avoids `CREATE SCHEMA` (unsupported in WASM).
 * Tracks applied migrations in a plain `__drizzle_migrations` table.
 */

import path from "node:path";
import { readFileSync } from "node:fs";
import { sql } from "drizzle-orm";
import type { PgliteDatabase } from "drizzle-orm/pglite";

interface JournalEntry {
  idx: number;
  tag: string;
}

interface Journal {
  entries: JournalEntry[];
}

const IGNORABLE_SQL_ERROR_CODES = new Set([
  "42P07", // relation already exists
  "42710", // duplicate object
  "23505", // unique violation
]);

async function executeMigrationStatement(
  db: PgliteDatabase<any>,
  statement: string,
): Promise<void> {
  try {
    await db.execute(sql.raw(statement));
  } catch (error: any) {
    const code = error?.cause?.code ?? error?.code;

    if (code && IGNORABLE_SQL_ERROR_CODES.has(code)) {
      console.log(`[db] Skipped already-applied migration statement: ${code}`);
      return;
    }

    throw error;
  }
}

export async function runMigrations(
  db: PgliteDatabase<any>,
  migrationsFolder: string,
): Promise<void> {
  // Wait for the PGlite WASM to fully initialize before running any queries
  const client = (db as any).$client;
  if (client?.waitReady) {
    await client.waitReady;
  }

  // 1. Ensure the tracking table exists (no schema, just a plain table)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
      id        serial  PRIMARY KEY,
      tag       text    NOT NULL UNIQUE,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);

  // 2. Load the journal to get ordered migration list
  const journalPath = path.join(migrationsFolder, "meta", "_journal.json");
  const journal: Journal = JSON.parse(readFileSync(journalPath, "utf-8"));

  // 3. Find which migrations have already been applied
  const rows = await db.execute<{ tag: string }>(
    sql`SELECT tag FROM "__drizzle_migrations" ORDER BY id`,
  );
  const applied = new Set(rows.rows.map((r) => r.tag));

  // 4. Run pending migrations in order
  for (const entry of journal.entries) {
    if (applied.has(entry.tag)) continue;

    const sqlFile = path.join(migrationsFolder, `${entry.tag}.sql`);
    const sqlContent = readFileSync(sqlFile, "utf-8");

    // Split on the drizzle breakpoint marker
    const statements = sqlContent
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter(Boolean);

    for (const statement of statements) {
      await executeMigrationStatement(db, statement);
    }

    await db.execute(
      sql`INSERT INTO "__drizzle_migrations" (tag) VALUES (${entry.tag})`,
    );

    console.log(`[db] Applied migration: ${entry.tag}`);
  }
}
