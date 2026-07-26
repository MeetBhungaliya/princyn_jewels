import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

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
