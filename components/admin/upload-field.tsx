"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ExternalLinkIcon, FileImageIcon, Loader2Icon, Trash2Icon, UploadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn, getImageUrl } from "@/lib/utils";
import { deleteUploadedImageAction } from "@/lib/actions/content";

type UploadKind = "banners" | "categories" | "products";

const titles: Record<UploadKind, string> = {
  banners: "Banner image",
  categories: "Category image",
  products: "Product image",
};

export function UploadField({
  kind,
  label,
  value,
  onChange,
  className,
  validationError,
  required,
}: {
  kind: UploadKind;
  label?: string;
  value: string;
  onChange: (path: string) => void;
  className?: string;
  validationError?: string;
  required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const fullUrl = value ? (value.startsWith("http") ? value : `${origin}${getImageUrl(value)}`) : "";

  const upload = async (file?: File | null) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    const MAX_BYTES = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError("Upload a JPG, JPEG, PNG, WebP, GIF, or SVG image.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (file.size > MAX_BYTES) {
      setError("File is too large. Choose an image up to 5 MB.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setPending(true);
    setError("");
    try {
      const form = new FormData();
      form.append("kind", kind);
      form.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: form });
      const payload = (await response.json()) as { path?: string; error?: string };
      if (!response.ok || !payload.path) throw new Error(payload.error ?? "Upload failed.");

      if (value && value !== payload.path) {
        void deleteUploadedImageAction(value);
      }
      onChange(payload.path);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setPending(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleClear = () => {
    if (value) {
      const old = value;
      onChange("");
      void deleteUploadedImageAction(old);
    }
  };

  return (
    <Card className={cn("border-dashed bg-linear-to-br from-background to-muted/30 transition-colors duration-200", validationError && "border-destructive/80 bg-destructive/5 dark:bg-destructive/10", className)}>
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileImageIcon className="size-4 text-primary" />
          <span className="flex items-center gap-0.5">
            {label ?? titles[kind]}
            {required && <span className="text-destructive font-bold">*</span>}
          </span>
        </CardTitle>
        <CardDescription>Upload a JPG, PNG, WebP, or GIF up to 5 MB.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(event) => void upload(event.target.files?.[0])}
            disabled={pending}
          />
          <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={pending}>
            {pending ? <Loader2Icon className="size-4 animate-spin" /> : <UploadIcon className="size-4" />}
            <span>{pending ? "Uploading" : "Choose file"}</span>
          </Button>
        </div>
        {value ? (
          <div className="overflow-hidden rounded-xl border bg-background shadow-2xs">
            <div className="relative aspect-16/9 md:aspect-21/9 bg-muted overflow-hidden">
              <Image src={getImageUrl(value)} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-muted/20 border-t border-border">
              <div className="min-w-0 flex-1">
                <p className="text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">Full Image Link</p>
                <p className="truncate text-xs font-mono text-foreground font-medium select-all" title={fullUrl}>
                  {fullUrl || value}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-8.5 rounded-lg gap-1.5 text-xs font-semibold hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-all"
                >
                  <a href={fullUrl || getImageUrl(value)} target="_blank" rel="noopener noreferrer">
                    <ExternalLinkIcon className="size-3.5" />
                    <span>Open Image</span>
                  </a>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="h-8.5 rounded-lg text-destructive hover:text-destructive hover:bg-destructive/10 font-semibold"
                >
                  <Trash2Icon className="size-3.5" />
                  <span>Clear</span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-dashed p-5 text-sm text-muted-foreground">
            <FileImageIcon className="size-4" />
            No image selected yet.
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {validationError && <p className="text-sm text-destructive font-medium">{validationError}</p>}
      </CardContent>
    </Card>
  );
}
