"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { SaveIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UploadField } from "@/components/admin/upload-field";
import { saveBanner, saveCategory, saveProduct, saveSubcategory } from "@/lib/actions/content";
import { bannerSchema, categorySchema, productSchema, subcategorySchema } from "@/lib/validators/content";
import type { BannerInput, CategoryInput, ProductInput, SubcategoryInput } from "@/lib/validators/content";
import { cn } from "@/lib/utils";

type BannerRecord = { id: string; desktopImage: string; mobileImage: string; title: string | null; link: string | null; order: number; active: boolean };
type CategoryRecord = { id: string; slug: string; name: string; tagline: string; description: string; imagePath: string; order: number; active: boolean };
type ProductRecord = { id: string; categoryId: string; subcategoryId: string | null; subcategory: string; subcategorySlug: string; title: string; slug: string; imagePath: string; link: string | null; order: number; active: boolean };
type SubcategoryRecord = { id: string; categoryId: string; name: string; slug: string; order: number; active: boolean };
type CategoryOption = { id: string; name: string };
type SubcategoryOption = { id: string; categoryId: string; name: string; slug: string };

type Props =
  | { section: "banner"; initial?: BannerRecord | null; redirectTo: string }
  | { section: "category"; initial?: CategoryRecord | null; redirectTo: string }
  | { section: "subcategory"; initial?: SubcategoryRecord | null; categories: CategoryOption[]; redirectTo: string }
  | { section: "product"; initial?: ProductRecord | null; categories: CategoryOption[]; subcategories: SubcategoryOption[]; redirectTo: string };

export function ContentEditor(props: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();

  if (props.section === "banner") return <BannerEditor {...props} router={router} pending={pending} start={start} />;
  if (props.section === "category") return <CategoryEditor {...props} router={router} pending={pending} start={start} />;
  if (props.section === "subcategory") return <SubcategoryEditor {...props} router={router} pending={pending} start={start} />;
  return <ProductEditor {...props} router={router} pending={pending} start={start} />;
}

function BannerEditor({
  initial,
  redirectTo,
  router,
  pending,
  start,
}: Extract<Props, { section: "banner" }> & { router: ReturnType<typeof useRouter>; pending: boolean; start: React.TransitionStartFunction }) {
  const form = useForm<BannerForm, unknown, BannerInput>({ resolver: zodResolver(bannerSchema), defaultValues: bannerDefaults(initial) });
  useEffect(() => form.reset(bannerDefaults(initial)), [initial, form]);
  const desktopImage = useWatch({ control: form.control, name: "desktopImage" });
  const mobileImage = useWatch({ control: form.control, name: "mobileImage" });
  const submit = (data: BannerInput) => start(async () => {
    const result = await saveBanner(initial?.id ?? null, data);
    if (result.ok) {
      toast.success("Banner saved");
      router.replace(redirectTo);
      router.refresh();
    } else toast.error(result.error);
  });
  return <EditorShell title={initial ? "Edit banner" : "Add banner"} description="Manage carousel cards with desktop/mobile art and optional links." badge="Banner" onSubmit={form.handleSubmit(submit)} pending={pending} backHref={redirectTo} router={router}>
    <div className="grid gap-4 lg:grid-cols-2">
      <UploadField kind="banners" label="Desktop image" value={desktopImage ?? ""} onChange={(value) => form.setValue("desktopImage", value)} validationError={form.formState.errors.desktopImage?.message} required />
      <UploadField kind="banners" label="Mobile image" value={mobileImage ?? ""} onChange={(value) => form.setValue("mobileImage", value)} validationError={form.formState.errors.mobileImage?.message} required />
      <Field label="Title" error={form.formState.errors.title?.message}><Input {...form.register("title")} placeholder="Optional heading" /></Field>
      <Field label="Link" error={form.formState.errors.link?.message}><Input {...form.register("link")} placeholder="https://example.com or /category/men" /></Field>
      <Field label="Order" error={form.formState.errors.order?.message} required><Input type="number" {...form.register("order", { valueAsNumber: true })} /></Field>
    </div>
  </EditorShell>;
}

function CategoryEditor({
  initial,
  redirectTo,
  router,
  pending,
  start,
}: Extract<Props, { section: "category" }> & { router: ReturnType<typeof useRouter>; pending: boolean; start: React.TransitionStartFunction }) {
  const form = useForm<CategoryForm, unknown, CategoryInput>({ resolver: zodResolver(categorySchema), defaultValues: categoryDefaults(initial) });
  useEffect(() => form.reset(categoryDefaults(initial)), [initial, form]);
  const categoryImage = useWatch({ control: form.control, name: "imagePath" });
  const nameValue = useWatch({ control: form.control, name: "name" });
  useEffect(() => {
    if (nameValue) {
      form.setValue("slug", slugify(nameValue), { shouldValidate: true });
    }
  }, [nameValue, form]);

  const submit = (data: CategoryInput) => start(async () => {
    const result = await saveCategory(initial?.id ?? null, data);
    if (result.ok) {
      toast.success("Category saved");
      router.replace(redirectTo);
      router.refresh();
    } else toast.error(result.error);
  });
  return <EditorShell title={initial ? "Edit category" : "Add category"} description="Set the public category card, hero image, and browse copy." badge="Category" onSubmit={form.handleSubmit(submit)} pending={pending} backHref={redirectTo} router={router}>
    <div className="grid gap-4 lg:grid-cols-2">
      <Field label="Name" error={form.formState.errors.name?.message} required><Input {...form.register("name")} /></Field>
      <Field label="Tagline" error={form.formState.errors.tagline?.message} required><Input {...form.register("tagline")} /></Field>
      <Field label="Order" error={form.formState.errors.order?.message} required><Input type="number" {...form.register("order", { valueAsNumber: true })} /></Field>
      <Field label="Description" className="lg:col-span-2" error={form.formState.errors.description?.message} required><Textarea className="min-h-32" {...form.register("description")} /></Field>
      <UploadField kind="categories" label="Hero / card image" value={categoryImage ?? ""} onChange={(value) => form.setValue("imagePath", value)} className="lg:col-span-2" validationError={form.formState.errors.imagePath?.message} required />
    </div>
  </EditorShell>;
}

function ProductEditor({
  initial,
  categories,
  subcategories,
  redirectTo,
  router,
  pending,
  start,
}: Extract<Props, { section: "product" }> & { router: ReturnType<typeof useRouter>; pending: boolean; start: React.TransitionStartFunction }) {
  const form = useForm<ProductForm, unknown, ProductInput>({ resolver: zodResolver(productSchema), defaultValues: productDefaults(initial) });
  useEffect(() => form.reset(productDefaults(initial)), [initial, form]);
  const productImage = useWatch({ control: form.control, name: "imagePath" });
  const categoryId = useWatch({ control: form.control, name: "categoryId" });
  const subcategoryId = useWatch({ control: form.control, name: "subcategoryId" });
  const titleValue = useWatch({ control: form.control, name: "title" });
  useEffect(() => {
    if (titleValue) {
      form.setValue("slug", slugify(titleValue), { shouldValidate: true });
    }
  }, [titleValue, form]);

  const categorySubcategories = subcategories.filter((subcategory) => subcategory.categoryId === categoryId);
  const submit = (data: ProductInput) => start(async () => {
    const result = await saveProduct(initial?.id ?? null, data);
    if (result.ok) {
      toast.success("Product saved");
      router.replace(redirectTo);
      router.refresh();
    } else toast.error(result.error);
  });
  return <EditorShell title={initial ? "Edit product" : "Add product"} description="" badge="Product" onSubmit={form.handleSubmit(submit)} pending={pending} backHref={redirectTo} router={router}>
    <div className="grid gap-4 lg:grid-cols-2">
      <Field label="Category" error={form.formState.errors.categoryId?.message} required>
        <Select value={categoryId ?? ""} onValueChange={(value) => { form.setValue("categoryId", value); form.setValue("subcategoryId", ""); form.setValue("subcategory", ""); form.setValue("subcategorySlug", ""); }}>
          <SelectTrigger><SelectValue placeholder="Choose category" /></SelectTrigger>
          <SelectContent>{categories.map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}</SelectContent>
        </Select>
      </Field>
      <Field label="Subcategory" error={form.formState.errors.subcategoryId?.message}>
        <Select value={subcategoryId ?? ""} onValueChange={(value) => { const subcategory = subcategories.find((item) => item.id === value); form.setValue("subcategoryId", value); form.setValue("subcategory", subcategory?.name ?? ""); form.setValue("subcategorySlug", subcategory?.slug ?? ""); }} disabled={!categoryId}>
          <SelectTrigger><SelectValue placeholder={categoryId ? "Choose subcategory" : "Choose category first"} /></SelectTrigger>
          <SelectContent>{categorySubcategories.map((subcategory) => <SelectItem key={subcategory.id} value={subcategory.id}>{subcategory.name}</SelectItem>)}</SelectContent>
        </Select>
      </Field>
      <Field label="Title" error={form.formState.errors.title?.message} required><Input {...form.register("title")} /></Field>
      <Field label="Optional link" error={form.formState.errors.link?.message}><Input {...form.register("link")} placeholder="/product/something" /></Field>
      <Field label="Order" error={form.formState.errors.order?.message} required><Input type="number" {...form.register("order", { valueAsNumber: true })} /></Field>
      <UploadField kind="products" label="Product image" value={productImage ?? ""} onChange={(value) => form.setValue("imagePath", value)} className="lg:col-span-2" validationError={form.formState.errors.imagePath?.message} required />
    </div>
  </EditorShell>;
}

function SubcategoryEditor({ initial, categories, redirectTo, router, pending, start }: Extract<Props, { section: "subcategory" }> & { router: ReturnType<typeof useRouter>; pending: boolean; start: React.TransitionStartFunction }) {
  const form = useForm<SubcategoryForm, unknown, SubcategoryInput>({ resolver: zodResolver(subcategorySchema), defaultValues: subcategoryDefaults(initial) });
  useEffect(() => form.reset(subcategoryDefaults(initial)), [initial, form]);
  const categoryId = useWatch({ control: form.control, name: "categoryId" });
  const nameValue = useWatch({ control: form.control, name: "name" });
  useEffect(() => {
    if (nameValue) {
      form.setValue("slug", slugify(nameValue), { shouldValidate: true });
    }
  }, [nameValue, form]);

  const submit = (data: SubcategoryInput) => start(async () => {
    const result = await saveSubcategory(initial?.id ?? null, data);
    if (result.ok) { toast.success("Subcategory saved"); router.replace(redirectTo); router.refresh(); } else toast.error(result.error);
  });
  return <EditorShell title={initial ? "Edit subcategory" : "Add subcategory"} description="" badge="Subcategory" onSubmit={form.handleSubmit(submit)} pending={pending} backHref={redirectTo} router={router}>
    <div className="grid gap-4 lg:grid-cols-2">
      <Field label="Category" error={form.formState.errors.categoryId?.message} required><Select value={categoryId ?? ""} onValueChange={(value) => form.setValue("categoryId", value)}><SelectTrigger><SelectValue placeholder="Choose category" /></SelectTrigger><SelectContent>{categories.map((category) => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}</SelectContent></Select></Field>
      <Field label="Name" error={form.formState.errors.name?.message} required><Input {...form.register("name")} /></Field>
      <Field label="Order" error={form.formState.errors.order?.message} required><Input type="number" {...form.register("order", { valueAsNumber: true })} /></Field>
    </div>
  </EditorShell>;
}

function EditorShell({
  title,
  description,
  badge,
  onSubmit,
  pending,
  backHref,
  router,
  children,
}: {
  title: string;
  description: string;
  badge: string;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  pending: boolean;
  backHref: string;
  router: ReturnType<typeof useRouter>;
  children: React.ReactNode;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <Badge variant="secondary">{badge}</Badge>
          {title}
        </h1>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button variant="outline" type="button" onClick={() => router.push(backHref)}>
            Cancel
          </Button>
          <Button type="submit" disabled={pending}>
            <SaveIcon className="size-4" />
            {pending ? "Saving..." : "Save item"}
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="space-y-6 p-5 md:p-6">{children}</CardContent>
      </Card>
    </form>
  );
}

function Field({
  label,
  error,
  required,
  children,
  className,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const hasError = !!error;
  const clonedChild = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<any>, {
        "aria-invalid": hasError ? "true" : undefined,
        className: cn(
          (children as React.ReactElement<any>).props.className,
          hasError && "border-destructive focus-visible:ring-destructive/20 focus:border-destructive focus:ring-destructive/20"
        ),
      })
    : children;

  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label className="flex items-center gap-0.5 text-sm font-semibold">
        {label}
        {required && <span className="text-destructive font-bold">*</span>}
      </Label>
      {clonedChild}
      {error && (
        <p className="text-[0.8rem] font-medium text-destructive mt-0.5">
          {error}
        </p>
      )}
    </div>
  );
}

function bannerDefaults(initial?: BannerRecord | null): BannerForm {
  return { desktopImage: initial?.desktopImage ?? "", mobileImage: initial?.mobileImage ?? "", title: initial?.title ?? "", link: initial?.link ?? "", order: initial?.order ?? 0, active: initial?.active ?? false };
}

function categoryDefaults(initial?: CategoryRecord | null): CategoryForm {
  return { slug: initial?.slug ?? "", name: initial?.name ?? "", tagline: initial?.tagline ?? "", description: initial?.description ?? "", imagePath: initial?.imagePath ?? "", order: initial?.order ?? 0, active: initial?.active ?? false };
}

function productDefaults(initial?: ProductRecord | null): ProductForm {
  return { categoryId: initial?.categoryId ?? "", subcategoryId: initial?.subcategoryId ?? "", subcategory: initial?.subcategory ?? "", subcategorySlug: initial?.subcategorySlug ?? "", title: initial?.title ?? "", slug: initial?.slug ?? "", imagePath: initial?.imagePath ?? "", link: initial?.link ?? "", order: initial?.order ?? 0, active: initial?.active ?? false };
}

function subcategoryDefaults(initial?: SubcategoryRecord | null): SubcategoryForm {
  return { categoryId: initial?.categoryId ?? "", name: initial?.name ?? "", slug: initial?.slug ?? "", order: initial?.order ?? 0, active: initial?.active ?? false };
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type BannerForm = z.input<typeof bannerSchema>;
type CategoryForm = z.input<typeof categorySchema>;
type ProductForm = z.input<typeof productSchema>;
type SubcategoryForm = z.input<typeof subcategorySchema>;
