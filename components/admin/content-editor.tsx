"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeftIcon, Loader2Icon, SaveIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { UploadField } from "@/components/admin/upload-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  cleanupStaleImagesAction,
  saveBanner,
  saveCategory,
  saveProduct,
  saveSubcategory,
} from "@/lib/actions/content";
import { cn, slugify, toTitleCase } from "@/lib/utils";
import type {
  BannerInput,
  CategoryInput,
  ProductInput,
  SubcategoryInput,
} from "@/lib/validators/content";
import {
  bannerSchema,
  categorySchema,
  productSchema,
  subcategorySchema,
} from "@/lib/validators/content";

type BannerRecord = {
  id: string;
  desktopImage: string;
  mobileImage: string;
  title: string | null;
  order: number;
  active: boolean;
};
type CategoryRecord = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  imagePath: string;
  order: number;
  active: boolean;
};
type ProductRecord = {
  id: string;
  categoryId: string;
  subcategoryId: string | null;
  subcategory: string;
  subcategorySlug: string;
  title: string;
  slug: string;
  imagePath: string;
  size: string | null;
  metalType: string | null;
  karat: string | null;
  color: string | null;
  netWeight: string | null;
  diamondWeight: string | null;
  grossWeight: string | null;
  order: number;
  active: boolean;
};
type SubcategoryRecord = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  order: number;
  active: boolean;
};
type CategoryOption = { id: string; name: string };
type SubcategoryOption = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
};

type Props =
  | { section: "banner"; initial?: BannerRecord | null; redirectTo: string }
  | { section: "category"; initial?: CategoryRecord | null; redirectTo: string }
  | {
      section: "subcategory";
      initial?: SubcategoryRecord | null;
      categories: CategoryOption[];
      redirectTo: string;
    }
  | {
      section: "product";
      initial?: ProductRecord | null;
      categories: CategoryOption[];
      subcategories: SubcategoryOption[];
      redirectTo: string;
    };

export function ContentEditor(props: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();

  if (props.section === "banner")
    return (
      <BannerEditor
        {...props}
        router={router}
        pending={pending}
        start={start}
      />
    );
  if (props.section === "category")
    return (
      <CategoryEditor
        {...props}
        router={router}
        pending={pending}
        start={start}
      />
    );
  if (props.section === "subcategory")
    return (
      <SubcategoryEditor
        {...props}
        router={router}
        pending={pending}
        start={start}
      />
    );
  return (
    <ProductEditor {...props} router={router} pending={pending} start={start} />
  );
}

function BannerEditor({
  initial,
  redirectTo,
  router,
  pending,
  start,
}: Extract<Props, { section: "banner" }> & {
  router: ReturnType<typeof useRouter>;
  pending: boolean;
  start: React.TransitionStartFunction;
}) {
  const form = useForm<BannerForm, unknown, BannerInput>({
    resolver: zodResolver(bannerSchema),
    defaultValues: bannerDefaults(initial),
  });
  useEffect(() => form.reset(bannerDefaults(initial)), [initial, form]);
  const desktopImage = useWatch({
    control: form.control,
    name: "desktopImage",
  });
  const mobileImage = useWatch({ control: form.control, name: "mobileImage" });
  const submit = (data: BannerInput) =>
    start(async () => {
      const result = await saveBanner(initial?.id ?? null, data);
      if (result.ok) {
        toast.success("Banner saved");
        router.replace(redirectTo);
        router.refresh();
      } else toast.error(result.error);
    });
  return (
    <EditorShell
      title={initial ? "Edit banner" : "Add banner"}
      badge="Banner"
      onSubmit={form.handleSubmit(submit)}
      pending={pending}
      backHref={redirectTo}
      router={router}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <UploadField
          kind="banners"
          label="Desktop image"
          value={desktopImage ?? ""}
          onChange={(value) => form.setValue("desktopImage", value)}
          validationError={form.formState.errors.desktopImage?.message}
          required
        />
        <UploadField
          kind="banners"
          label="Mobile image"
          value={mobileImage ?? ""}
          onChange={(value) => form.setValue("mobileImage", value)}
          validationError={form.formState.errors.mobileImage?.message}
          required
        />
        <Field label="Title" error={form.formState.errors.title?.message}>
          <Input {...form.register("title")} placeholder="e.g. Summer Collection" />
        </Field>
        <Field
          label="Order"
          error={form.formState.errors.order?.message}
          required
        >
          <Input
            type="number"
            placeholder="e.g. 1"
            {...form.register("order", { valueAsNumber: true })}
          />
        </Field>
      </div>
    </EditorShell>
  );
}

function CategoryEditor({
  initial,
  redirectTo,
  router,
  pending,
  start,
}: Extract<Props, { section: "category" }> & {
  router: ReturnType<typeof useRouter>;
  pending: boolean;
  start: React.TransitionStartFunction;
}) {
  const form = useForm<CategoryForm, unknown, CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: categoryDefaults(initial),
  });
  useEffect(() => form.reset(categoryDefaults(initial)), [initial, form]);
  const categoryImage = useWatch({ control: form.control, name: "imagePath" });
  const nameValue = useWatch({ control: form.control, name: "name" });
  useEffect(() => {
    if (nameValue) {
      form.setValue("slug", slugify(nameValue), { shouldValidate: true });
    }
  }, [nameValue, form]);

  const submit = (data: CategoryInput) =>
    start(async () => {
      const result = await saveCategory(initial?.id ?? null, data);
      if (result.ok) {
        toast.success("Category saved");
        router.replace(redirectTo);
        router.refresh();
      } else toast.error(result.error);
    });
  return (
    <EditorShell
      title={initial ? "Edit category" : "Add category"}
      badge="Category"
      onSubmit={form.handleSubmit(submit)}
      pending={pending}
      backHref={redirectTo}
      router={router}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Field
          label="Name"
          error={form.formState.errors.name?.message}
          required
        >
          <Input {...form.register("name")} placeholder="e.g. Men" />
        </Field>
        <Field
          label="Tagline"
          error={form.formState.errors.tagline?.message}
          required
        >
          <Input {...form.register("tagline")} placeholder="e.g. Elegance Redefined" />
        </Field>
        <Field
          label="Order"
          error={form.formState.errors.order?.message}
          required
        >
          <Input
            type="number"
            placeholder="e.g. 1"
            {...form.register("order", { valueAsNumber: true })}
          />
        </Field>
        <Field
          label="Description"
          className="lg:col-span-2"
          error={form.formState.errors.description?.message}
          required
        >
          <Textarea className="min-h-32" {...form.register("description")} placeholder="e.g. Explore our premium men's jewellery collection" />
        </Field>
        <UploadField
          kind="categories"
          label="Hero / card image"
          value={categoryImage ?? ""}
          onChange={(value) => form.setValue("imagePath", value)}
          className="lg:col-span-2"
          validationError={form.formState.errors.imagePath?.message}
          required
        />
      </div>
    </EditorShell>
  );
}

function ProductEditor({
  initial,
  categories,
  subcategories,
  redirectTo,
  router,
  pending,
  start,
}: Extract<Props, { section: "product" }> & {
  router: ReturnType<typeof useRouter>;
  pending: boolean;
  start: React.TransitionStartFunction;
}) {
  const form = useForm<ProductForm, unknown, ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: productDefaults(initial),
  });
  useEffect(() => form.reset(productDefaults(initial)), [initial, form]);
  const productImage = useWatch({ control: form.control, name: "imagePath" });
  const categoryId = useWatch({ control: form.control, name: "categoryId" });
  const subcategoryId = useWatch({
    control: form.control,
    name: "subcategoryId",
  });
  const titleValue = useWatch({ control: form.control, name: "title" });
  const metalType = useWatch({ control: form.control, name: "metalType" });
  useEffect(() => {
    if (titleValue) {
      form.setValue("slug", slugify(titleValue), { shouldValidate: true });
    }
  }, [titleValue, form]);

  useEffect(() => {
    if (metalType !== "gold") {
      form.setValue("karat", "");
    }
  }, [metalType, form]);

  const categorySubcategories = subcategories.filter(
    (subcategory) => subcategory.categoryId === categoryId,
  );
  const submit = (data: ProductInput) =>
    start(async () => {
      const result = await saveProduct(initial?.id ?? null, data);
      if (result.ok) {
        toast.success("Product saved");
        router.replace(redirectTo);
        router.refresh();
      } else toast.error(result.error);
    });
  return (
    <EditorShell
      title={initial ? "Edit product" : "Add product"}
      badge="Product"
      onSubmit={form.handleSubmit(submit)}
      pending={pending}
      backHref={redirectTo}
      router={router}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Field
          label="Category"
          error={form.formState.errors.categoryId?.message}
          required
        >
          <Select
            value={categoryId ?? ""}
            onValueChange={(value: string) => {
              form.setValue("categoryId", value);
              form.setValue("subcategoryId", "");
              form.setValue("subcategory", "");
              form.setValue("subcategorySlug", "");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field
          label="Subcategory"
          error={form.formState.errors.subcategoryId?.message}
        >
          <Select
            value={subcategoryId ?? ""}
            onValueChange={(value: string) => {
              const subcategory = subcategories.find(
                (item) => item.id === value,
              );
              form.setValue("subcategoryId", value);
              form.setValue("subcategory", subcategory?.name ?? "");
              form.setValue("subcategorySlug", subcategory?.slug ?? "");
            }}
            disabled={!categoryId}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  categoryId ? "Choose subcategory" : "Choose category first"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {categorySubcategories.map((subcategory) => (
                <SelectItem key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field
          label="Title"
          error={form.formState.errors.title?.message}
          required
        >
          <Input {...form.register("title")} placeholder="e.g. Diamond Pendant Necklace" />
        </Field>
        <Field
          label="Order"
          error={form.formState.errors.order?.message}
          required
        >
          <Input
            type="number"
            placeholder="e.g. 1"
            {...form.register("order", { valueAsNumber: true })}
          />
        </Field>
        <UploadField
          kind="products"
          label="Product image"
          value={productImage ?? ""}
          onChange={(value) => form.setValue("imagePath", value)}
          className="lg:col-span-2"
          validationError={form.formState.errors.imagePath?.message}
          required
        />
      </div>

      {/* Product Specifications (all optional) */}
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="text-sm font-semibold text-foreground/70 uppercase tracking-wider mb-4">Product Specifications</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          <Field label="Size" error={form.formState.errors.size?.message}>
            <Input {...form.register("size")} placeholder="e.g. 7 or 16 inches" />
          </Field>
          <Field label="Color" error={form.formState.errors.color?.message}>
            <Input {...form.register("color")} placeholder="e.g. Rose Gold" />
          </Field>
          <Field label="Metal Type" error={form.formState.errors.metalType?.message}>
            <Select
              value={metalType || "none"}
              onValueChange={(value: string) => {
                const newValue = value === "none" ? "" : value;
                form.setValue("metalType", newValue as any);
                if (newValue !== "gold") {
                  form.setValue("karat", "" as any);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select metal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none" className="text-muted-foreground italic">None (Clear selection)</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <div className={cn("transition-opacity duration-200", metalType === "gold" ? "opacity-100" : "opacity-40 pointer-events-none")}>
            <Field label="Karat" error={form.formState.errors.karat?.message}>
              <Select
                value={form.watch("karat") || "none"}
                onValueChange={(value: string) => {
                  const newValue = value === "none" ? "" : value;
                  form.setValue("karat", newValue as any);
                }}
                disabled={metalType !== "gold"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select karat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="text-muted-foreground italic">None (Clear selection)</SelectItem>
                  <SelectItem value="9">9K</SelectItem>
                  <SelectItem value="14">14K</SelectItem>
                  <SelectItem value="18">18K</SelectItem>
                  <SelectItem value="22">22K</SelectItem>
                  <SelectItem value="24">24K</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Net Weight" error={form.formState.errors.netWeight?.message}>
            <Input {...form.register("netWeight")} placeholder="e.g. 12.5g" />
          </Field>
          <Field label="Diamond Weight" error={form.formState.errors.diamondWeight?.message}>
            <Input {...form.register("diamondWeight")} placeholder="e.g. 0.5 ct" />
          </Field>
          <Field label="Gross Weight" error={form.formState.errors.grossWeight?.message}>
            <Input {...form.register("grossWeight")} placeholder="e.g. 15.2g" />
          </Field>
        </div>
      </div>
    </EditorShell>
  );
}

function SubcategoryEditor({
  initial,
  categories,
  redirectTo,
  router,
  pending,
  start,
}: Extract<Props, { section: "subcategory" }> & {
  router: ReturnType<typeof useRouter>;
  pending: boolean;
  start: React.TransitionStartFunction;
}) {
  const form = useForm<SubcategoryForm, unknown, SubcategoryInput>({
    resolver: zodResolver(subcategorySchema),
    defaultValues: subcategoryDefaults(initial),
  });
  useEffect(() => form.reset(subcategoryDefaults(initial)), [initial, form]);
  const categoryId = useWatch({ control: form.control, name: "categoryId" });
  const nameValue = useWatch({ control: form.control, name: "name" });
  useEffect(() => {
    if (nameValue) {
      form.setValue("slug", slugify(nameValue), { shouldValidate: true });
    }
  }, [nameValue, form]);

  const submit = (data: SubcategoryInput) =>
    start(async () => {
      const result = await saveSubcategory(initial?.id ?? null, data);
      if (result.ok) {
        toast.success("Subcategory saved");
        router.replace(redirectTo);
        router.refresh();
      } else toast.error(result.error);
    });
  return (
    <EditorShell
      title={initial ? "Edit subcategory" : "Add subcategory"}
      badge="Subcategory"
      onSubmit={form.handleSubmit(submit)}
      pending={pending}
      backHref={redirectTo}
      router={router}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Field
          label="Category"
          error={form.formState.errors.categoryId?.message}
          required
        >
          <Select
            value={categoryId ?? ""}
            onValueChange={(value) => form.setValue("categoryId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field
          label="Name"
          error={form.formState.errors.name?.message}
          required
        >
          <Input {...form.register("name")} placeholder="Enter subcategory name" />
        </Field>
        <Field
          label="Order"
          error={form.formState.errors.order?.message}
          required
        >
          <Input
            type="number"
            {...form.register("order", { valueAsNumber: true })}
          />
        </Field>
      </div>
    </EditorShell>
  );
}

function EditorShell({
  title,
  badge,
  onSubmit,
  pending,
  backHref,
  router,
  children,
}: {
  title: string;
  badge: string;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  pending: boolean;
  backHref: string;
  router: ReturnType<typeof useRouter>;
  children: React.ReactNode;
}) {
  const handleCancel = () => {
    void cleanupStaleImagesAction();
    router.push(backHref);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="sticky top-0 z-20 -mt-4 md:-mt-6 -mx-4 md:-mx-6 px-4 md:px-6 pt-4 pb-3.5 bg-background/85 backdrop-blur-md border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={handleCancel}
            className="size-9 rounded-lg border-border/70 text-muted-foreground hover:text-foreground shrink-0 shadow-2xs hover:bg-muted"
            title="Go back"
          >
            <ChevronLeftIcon className="size-5" />
          </Button>
          <div className="flex items-center gap-2.5 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground truncate">
              {toTitleCase(title)}
            </h1>
            <span className="text-[0.7rem] font-bold px-2.5 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary uppercase tracking-wider shrink-0">
              {badge}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
          <Button
            variant="outline"
            type="button"
            onClick={handleCancel}
            className="h-9.5 rounded-lg border-border/80 px-4 font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={pending}
            className="h-9.5 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-5 shadow-xs hover:shadow-md transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] gap-2"
          >
            {pending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <SaveIcon className="size-4" />
            )}
            <span>{pending ? "Saving..." : "Save Item"}</span>
          </Button>
        </div>
      </div>
      <Card className="shadow-xs border-border/80">
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
  placeholder?: string;
}) {
  const hasError = !!error;
  const clonedChild = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<any>, {
        "aria-invalid": hasError ? "true" : undefined,
        className: cn(
          (children as React.ReactElement<any>).props.className,
          hasError &&
            "border-destructive focus-visible:ring-destructive/20 focus:border-destructive focus:ring-destructive/20",
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
  return {
    desktopImage: initial?.desktopImage ?? "",
    mobileImage: initial?.mobileImage ?? "",
    title: initial?.title ?? "",
    order: initial?.order ?? 0,
    active: initial?.active ?? false,
  };
}

function categoryDefaults(initial?: CategoryRecord | null): CategoryForm {
  return {
    slug: initial?.slug ?? "",
    name: initial?.name ?? "",
    tagline: initial?.tagline ?? "",
    description: initial?.description ?? "",
    imagePath: initial?.imagePath ?? "",
    order: initial?.order ?? 0,
    active: initial?.active ?? false,
  };
}

function productDefaults(initial?: ProductRecord | null): ProductForm {
  return {
    categoryId: initial?.categoryId ?? "",
    subcategoryId: initial?.subcategoryId ?? "",
    subcategory: initial?.subcategory ?? "",
    subcategorySlug: initial?.subcategorySlug ?? "",
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    imagePath: initial?.imagePath ?? "",
    size: initial?.size ?? "",
    metalType: (initial?.metalType as any) ?? "",
    karat: (initial?.karat as any) ?? "",
    color: initial?.color ?? "",
    netWeight: initial?.netWeight ?? "",
    diamondWeight: initial?.diamondWeight ?? "",
    grossWeight: initial?.grossWeight ?? "",
    order: initial?.order ?? 0,
    active: initial?.active ?? false,
  };
}
function subcategoryDefaults(
  initial?: SubcategoryRecord | null,
): SubcategoryForm {
  return {
    categoryId: initial?.categoryId ?? "",
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    order: initial?.order ?? 0,
    active: initial?.active ?? false,
  };
}
type BannerForm = z.input<typeof bannerSchema>;
type CategoryForm = z.input<typeof categorySchema>;
type ProductForm = z.input<typeof productSchema>;
type SubcategoryForm = z.input<typeof subcategorySchema>;
