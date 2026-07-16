"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { FileImageIcon, Loader2Icon, Trash2Icon, UploadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
}: {
  kind: UploadKind;
  label?: string;
  value: string;
  onChange: (path: string) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const upload = async (file?: File | null) => {
    if (!file) return;
    setPending(true);
    setError("");
    try {
      const form = new FormData();
      form.append("kind", kind);
      form.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: form });
      const payload = (await response.json()) as { path?: string; error?: string };
      if (!response.ok || !payload.path) throw new Error(payload.error ?? "Upload failed.");
      onChange(payload.path);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setPending(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <Card className={cn("border-dashed bg-linear-to-br from-background to-muted/30", className)}>
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-base">
          <FileImageIcon className="size-4 text-primary" />
          {label ?? titles[kind]}
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
          <div className="overflow-hidden rounded-xl border bg-background">
            <div className="relative aspect-4/3 bg-muted">
              <Image src={value} alt="" fill className="object-cover" />
            </div>
            <div className="flex items-center justify-between gap-3 p-3">
              <p className="truncate text-xs text-muted-foreground">{value}</p>
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
                <Trash2Icon className="size-4" />
                <span>Clear</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-dashed p-5 text-sm text-muted-foreground">
            <FileImageIcon className="size-4" />
            No image selected yet.
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}
