import { randomUUID } from "node:crypto";
import { mkdir, readdir, stat, unlink, writeFile } from "node:fs/promises";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { bannerRepository, categoryRepository, productRepository } from "@/lib/repositories/content";

export const uploadKinds = ["banners", "categories", "products"] as const;
export type UploadKind = (typeof uploadKinds)[number];
const allowed = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/svg+xml", "svg"],
]);
const MAX_BYTES = 5 * 1024 * 1024;

let cachedUploadRoot: string | null = null;

function getUploadRoot() {
  if (cachedUploadRoot) return cachedUploadRoot;

  const configuredRoot = process.env.UPLOAD_PATH?.trim();
  if (configuredRoot) {
    try {
      if (!existsSync(configuredRoot)) {
        mkdirSync(configuredRoot, { recursive: true });
      }
      cachedUploadRoot = configuredRoot;
      return configuredRoot;
    } catch {}
  }

  const localFallback = path.join(process.cwd(), "var", "www", "storage", "uploads");
  try {
    if (!existsSync(localFallback)) {
      mkdirSync(localFallback, { recursive: true });
    }
  } catch {}
  cachedUploadRoot = localFallback;
  return localFallback;
}

function isPathInsideRoot(root: string, target: string) {
  const relativePath = path.relative(root, target);
  return relativePath !== "" && !relativePath.startsWith("..") && !path.isAbsolute(relativePath);
}

export async function saveImage(file: File, kind: UploadKind) {
  const extension = allowed.get(file.type);
  if (!extension || file.size === 0 || file.size > MAX_BYTES)
    throw new Error("Upload a JPG, JPEG, PNG, WebP, GIF, or SVG image up to 5 MB.");

  const filename = `${randomUUID()}.${extension}`;
  const uploadRoot = getUploadRoot();
  const directory = path.join(uploadRoot, kind);

  await mkdir(directory, { recursive: true });
  await writeFile(
    path.join(directory, filename),
    Buffer.from(await file.arrayBuffer()),
  );

  return `/uploads/${kind}/${filename}`;
}

export async function deleteLocalImage(imagePath?: string | null) {
  if (!imagePath?.startsWith("/uploads/")) return;

  const uploadRoot = getUploadRoot();
  const relativePath = decodeURIComponent(imagePath)
    .replace(/^\/uploads\/+/, "")
    .replace(/\\/g, "/");

  if (!relativePath || relativePath.includes("..")) return;

  const resolved = path.resolve(uploadRoot, relativePath);
  if (!isPathInsideRoot(uploadRoot, resolved)) return;

  await unlink(resolved).catch(() => undefined);
}

export async function cleanupStaleImages(maxAgeMinutes = 30): Promise<{ scanned: number; deleted: number; freedBytes: number }> {
  const uploadRoot = getUploadRoot();
  let scanned = 0;
  let deleted = 0;
  let freedBytes = 0;

  try {
    const [allBanners, allCategories, allProducts] = await Promise.all([
      bannerRepository.all(),
      categoryRepository.all(),
      productRepository.all(),
    ]);

    const activePaths = new Set<string>();
    for (const b of allBanners) {
      if (b.desktopImage) activePaths.add(b.desktopImage);
      if (b.mobileImage) activePaths.add(b.mobileImage);
    }
    for (const c of allCategories) {
      if (c.imagePath) activePaths.add(c.imagePath);
    }
    for (const p of allProducts) {
      if (p.product.imagePath) activePaths.add(p.product.imagePath);
    }

    const now = Date.now();
    const maxAgeMs = maxAgeMinutes * 60 * 1000;

    for (const kind of uploadKinds) {
      const dir = path.join(uploadRoot, kind);
      if (!existsSync(dir)) continue;

      const files = await readdir(dir, { withFileTypes: true }).catch(() => []);
      for (const file of files) {
        if (!file.isFile()) continue;

        scanned++;
        const imageRelPath = `/uploads/${kind}/${file.name}`;

        if (!activePaths.has(imageRelPath)) {
          const fullPath = path.join(dir, file.name);
          const fileStat = await stat(fullPath).catch(() => null);

          if (fileStat) {
            const age = now - fileStat.mtimeMs;
            if (age > maxAgeMs) {
              freedBytes += fileStat.size;
              await unlink(fullPath).catch(() => undefined);
              deleted++;
            }
          }
        }
      }
    }
  } catch (err) {
    console.error("Stale image cleanup error:", err);
  }

  return { scanned, deleted, freedBytes };
}
