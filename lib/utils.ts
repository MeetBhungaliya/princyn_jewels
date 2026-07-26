import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toTitleCase(str: string): string {
  if (!str) return "";
  return str
    .split(/[\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getImageUrl(src?: string | null): string {
  if (!src) return "/logo.png";
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  let path = src.trim();
  if (!path.startsWith("/")) {
    path = "/" + path;
  }
  if (!path.startsWith("/uploads/") && path !== "/logo.png") {
    return `/uploads${path}`;
  }
  return path;
}
