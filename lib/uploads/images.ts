import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

export const uploadKinds = ["banners", "categories", "products"] as const;
export type UploadKind = (typeof uploadKinds)[number];
const allowed = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);
const MAX_BYTES = 5 * 1024 * 1024;

export async function saveImage(file: File, kind: UploadKind) {
  const extension = allowed.get(file.type);
  if (!extension || file.size === 0 || file.size > MAX_BYTES)
    throw new Error("Upload a JPG, PNG, WebP, or GIF image up to 5 MB.");
  const filename = `${randomUUID()}.${extension}`;
  const uploadRoot =
    process.env.UPLOAD_DIR ?? path.join(process.cwd(), "public", "uploads");
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
  const resolved = path.resolve(process.cwd(), "public", `.${imagePath}`);
  const root = path.resolve(process.cwd(), "public", "uploads");
  if (!resolved.startsWith(`${root}${path.sep}`)) return;
  await unlink(resolved).catch(() => undefined);
}
