import { cp, readdir, rm, mkdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const BACKUP_ROOT = path.join(process.cwd(), "var", "www", "storage", "backups");
const MAX_BACKUPS = 5;

export async function backupDatabase(databasePath: string): Promise<string | null> {
  try {
    if (!existsSync(databasePath)) return null;

    await mkdir(BACKUP_ROOT, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupDir = path.join(BACKUP_ROOT, `db_${timestamp}`);

    await cp(databasePath, backupDir, { recursive: true });

    const entries = await readdir(BACKUP_ROOT);
    const backups = [];

    for (const name of entries) {
      if (!name.startsWith("db_")) continue;
      const fullPath = path.join(BACKUP_ROOT, name);
      try {
        const info = await stat(fullPath);
        if (info.isDirectory()) {
          backups.push({ path: fullPath, mtime: info.mtimeMs });
        }
      } catch {}
    }

    backups.sort((a, b) => b.mtime - a.mtime);

    if (backups.length > MAX_BACKUPS) {
      const toDelete = backups.slice(MAX_BACKUPS);
      for (const item of toDelete) {
        await rm(item.path, { recursive: true, force: true }).catch(() => undefined);
      }
    }

    return backupDir;
  } catch (error) {
    console.error("Failed to backup database:", error);
    return null;
  }
}

export async function restoreLatestBackup(databasePath: string): Promise<boolean> {
  try {
    if (!existsSync(BACKUP_ROOT)) return false;

    const entries = await readdir(BACKUP_ROOT);
    const backups = [];

    for (const name of entries) {
      if (!name.startsWith("db_")) continue;
      const fullPath = path.join(BACKUP_ROOT, name);
      try {
        const info = await stat(fullPath);
        if (info.isDirectory()) {
          backups.push({ path: fullPath, mtime: info.mtimeMs });
        }
      } catch {}
    }

    if (backups.length === 0) return false;

    backups.sort((a, b) => b.mtime - a.mtime);
    const latest = backups[0].path;

    if (existsSync(databasePath)) {
      const corruptedPath = `${databasePath}_corrupted_${Date.now()}`;
      await cp(databasePath, corruptedPath, { recursive: true }).catch(() => undefined);
      await rm(databasePath, { recursive: true, force: true });
    }

    await cp(latest, databasePath, { recursive: true });
    console.log(`Successfully restored database from backup: ${latest}`);
    return true;
  } catch (error) {
    console.error("Failed to restore database from backup:", error);
    return false;
  }
}
