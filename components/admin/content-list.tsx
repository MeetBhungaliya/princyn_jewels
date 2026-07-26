"use client";

import { cn } from "@/lib/utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ImageIcon,
  SearchIcon,
  SparklesIcon,
  Trash2Icon
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteBanner,
  deleteCategory,
  deleteProduct,
  deleteSubcategory,
  toggleBannerStatus,
  toggleCategoryStatus,
  toggleProductStatus,
  toggleSubcategoryStatus,
} from "@/lib/actions/content";

type Section = "banner" | "category" | "subcategory" | "product";
type BannerRow = {
  id: string;
  desktopImage: string;
  mobileImage: string;
  title: string;
  link: string;
  order: number;
  active: boolean;
};
type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  imagePath: string;
  order: number;
  active: boolean;
};
type ProductRow = {
  id: string;
  categoryId: string;
  subcategory: string;
  subcategorySlug: string;
  title: string;
  slug: string;
  imagePath: string;
  link: string;
  order: number;
  active: boolean;
  categoryName: string;
};
type SubcategoryRow = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  order: number;
  active: boolean;
  categoryName: string;
};

export function ContentList({
  section,
  title,
  description,
  rows,
  emptyTitle,
  emptyDescription,
}: {
  section: Section;
  title: string;
  description: string;
  addHref: string;
  rows: BannerRow[] | CategoryRow[] | SubcategoryRow[] | ProductRow[];
  emptyTitle: string;
  emptyDescription: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue);
    }, 250);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Filter rows based on search with client-side memoization caching
  const filteredRows = useMemo(() => {
    if (!debouncedQuery) return rows;
    const query = debouncedQuery.toLowerCase();

    return rows.filter((row) => {
      if (section === "banner") {
        const r = row as BannerRow;
        return (
          (r.title?.toLowerCase() || "").includes(query) ||
          (r.link?.toLowerCase() || "").includes(query)
        );
      }
      if (section === "category") {
        const r = row as CategoryRow;
        return (
          r.name.toLowerCase().includes(query) ||
          r.tagline.toLowerCase().includes(query)
        );
      }
      if (section === "subcategory") {
        const r = row as SubcategoryRow;
        return (
          r.name.toLowerCase().includes(query) ||
          r.categoryName.toLowerCase().includes(query)
        );
      }
      if (section === "product") {
        const r = row as ProductRow;
        return (
          r.title.toLowerCase().includes(query) ||
          r.categoryName.toLowerCase().includes(query) ||
          r.subcategory.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [rows, debouncedQuery, section]);

  // Reset page to 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery]);

  const totalPages = Math.ceil(filteredRows.length / itemsPerPage);
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const startIdx =
    filteredRows.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIdx = Math.min(currentPage * itemsPerPage, filteredRows.length);

  const searchPlaceholder =
    section === "banner"
      ? "Search by banner title..."
      : section === "category"
        ? "Search by category name..."
        : section === "subcategory"
          ? "Search by subcategory or category name..."
          : "Search by product title, category, or subcategory...";

  return (
    <div className="space-y-6">

      {/* Search Input */}
      {rows.length > 0 && (
        <div className="relative max-w-md shadow-xs rounded-lg">
          <SearchIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />
          <Input
            placeholder={searchPlaceholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="pl-10 h-11 w-full rounded-lg bg-background border-border text-sm md:text-base focus-visible:ring-primary/20"
          />
        </div>
      )}

      {filteredRows.length ? (
        <div className="space-y-4">
          <div className="overflow-x-auto md:overflow-x-visible rounded-lg shadow-xs">
            <Table className="min-w-190">
              <TableHeader className="sticky top-0 z-10 bg-background border-b">
                    <TableRow className="border-b bg-muted/20 hover:bg-muted/20">
                      {section === "banner" && (
                        <>
                          <TableHead className="h-12 px-6 font-semibold text-foreground/80 text-xs uppercase tracking-wider">Preview</TableHead>
                          <TableHead className="h-12 px-6 font-semibold text-foreground/80 text-xs uppercase tracking-wider">Title</TableHead>
                          <TableHead className="h-12 px-6 font-semibold text-foreground/80 text-xs uppercase tracking-wider">Status</TableHead>
                        </>
                      )}
                      {section === "category" && (
                        <>
                          <TableHead className="h-12 px-6 font-semibold text-foreground/80 text-xs uppercase tracking-wider">Preview</TableHead>
                          <TableHead className="h-12 px-6 font-semibold text-foreground/80 text-xs uppercase tracking-wider">Name</TableHead>
                          <TableHead className="h-12 px-6 font-semibold text-foreground/80 text-xs uppercase tracking-wider">Status</TableHead>
                        </>
                      )}
                      {section === "subcategory" && (
                        <>
                          <TableHead className="h-12 px-6 font-semibold text-foreground/80 text-xs uppercase tracking-wider">Name</TableHead>
                          <TableHead className="h-12 px-6 font-semibold text-foreground/80 text-xs uppercase tracking-wider">Category</TableHead>
                          <TableHead className="h-12 px-6 font-semibold text-foreground/80 text-xs uppercase tracking-wider">Status</TableHead>
                        </>
                      )}
                      {section === "product" && (
                        <>
                          <TableHead className="h-12 px-6 font-semibold text-foreground/80 text-xs uppercase tracking-wider">Image</TableHead>
                          <TableHead className="h-12 px-6 font-semibold text-foreground/80 text-xs uppercase tracking-wider">Title</TableHead>
                          <TableHead className="h-12 px-6 font-semibold text-foreground/80 text-xs uppercase tracking-wider">Category</TableHead>
                          <TableHead className="h-12 px-6 font-semibold text-foreground/80 text-xs uppercase tracking-wider">Subcategory</TableHead>
                          <TableHead className="h-12 px-6 font-semibold text-foreground/80 text-xs uppercase tracking-wider">Status</TableHead>
                        </>
                      )}
                      <TableHead className="h-12 px-6 font-semibold text-foreground/80 text-xs uppercase tracking-wider text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {section === "banner" &&
                      paginatedRows.map((row) => {
                        const banner = row as BannerRow;
                        return (
                          <TableRow key={banner.id} className="hover:bg-muted/10">
                            <TableCell className="px-6 py-4.5">
                              <div className="relative h-16 w-24 overflow-hidden rounded-lg border border-border bg-muted shadow-xs shrink-0">
                                <FallbackImage
                                  src={banner.desktopImage}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4.5 text-sm md:text-base font-semibold">
                              <Link href={`/admin/banner/${banner.id}`} className="text-primary underline decoration-primary/30 hover:decoration-primary font-semibold transition-all underline-offset-4">
                                <HighlightText text={banner.title || "Untitled banner"} query={debouncedQuery} />
                              </Link>
                            </TableCell>
                            <TableCell className="px-6 py-4.5">
                              <StatusSwitch section="banner" id={banner.id} active={banner.active} />
                            </TableCell>
                            <TableCell className="px-6 py-4.5 text-right">
                              <DeleteButton section="banner" id={banner.id} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {section === "category" &&
                      paginatedRows.map((row) => {
                        const category = row as CategoryRow;
                        return (
                          <TableRow key={category.id} className="hover:bg-muted/10">
                            <TableCell className="px-6 py-4.5">
                              <div className="relative h-16 w-24 overflow-hidden rounded-lg border border-border bg-muted shadow-xs shrink-0">
                                <FallbackImage
                                  src={category.imagePath}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4.5 text-sm md:text-base font-semibold">
                              <Link href={`/admin/categories/${category.id}`} className="text-primary underline decoration-primary/30 hover:decoration-primary font-semibold transition-all underline-offset-4">
                                <HighlightText text={toTitleCase(category.name)} query={debouncedQuery} />
                              </Link>
                            </TableCell>
                            <TableCell className="px-6 py-4.5">
                              <StatusSwitch section="category" id={category.id} active={category.active} />
                            </TableCell>
                            <TableCell className="px-6 py-4.5 text-right">
                              <DeleteButton section="category" id={category.id} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {section === "product" &&
                      paginatedRows.map((row) => {
                        const product = row as ProductRow;
                        return (
                          <TableRow key={product.id} className="hover:bg-muted/10">
                            <TableCell className="px-6 py-4.5">
                              <div className="relative h-16 w-24 overflow-hidden rounded-lg border border-border bg-muted shadow-xs shrink-0">
                                <FallbackImage
                                  src={product.imagePath}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4.5 text-sm md:text-base font-semibold">
                              <Link href={`/admin/products/${product.id}`} className="text-primary underline decoration-primary/30 hover:decoration-primary font-semibold transition-all underline-offset-4">
                                <HighlightText text={product.title} query={debouncedQuery} />
                              </Link>
                            </TableCell>
                            <TableCell className="px-6 py-4.5 text-sm md:text-base text-muted-foreground font-medium">
                              <HighlightText text={toTitleCase(product.categoryName)} query={debouncedQuery} />
                            </TableCell>
                            <TableCell className="px-6 py-4.5 text-sm md:text-base text-muted-foreground font-medium">
                              <HighlightText text={toTitleCase(product.subcategory)} query={debouncedQuery} />
                            </TableCell>
                            <TableCell className="px-6 py-4.5">
                              <StatusSwitch section="product" id={product.id} active={product.active} />
                            </TableCell>
                            <TableCell className="px-6 py-4.5 text-right">
                              <DeleteButton section="product" id={product.id} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {section === "subcategory" &&
                      paginatedRows.map((row) => {
                        const subcategory = row as SubcategoryRow;
                        return (
                          <TableRow key={subcategory.id} className="hover:bg-muted/10">
                            <TableCell className="px-6 py-4.5 text-sm md:text-base font-semibold">
                              <Link href={`/admin/subcategories/${subcategory.id}`} className="text-primary underline decoration-primary/30 hover:decoration-primary font-semibold transition-all underline-offset-4">
                                <HighlightText text={toTitleCase(subcategory.name)} query={debouncedQuery} />
                              </Link>
                            </TableCell>
                            <TableCell className="px-6 py-4.5 text-sm md:text-base text-muted-foreground font-medium">
                              <HighlightText text={toTitleCase(subcategory.categoryName)} query={debouncedQuery} />
                            </TableCell>
                            <TableCell className="px-6 py-4.5">
                              <StatusSwitch section="subcategory" id={subcategory.id} active={subcategory.active} />
                            </TableCell>
                            <TableCell className="px-6 py-4.5 text-right">
                              <DeleteButton section="subcategory" id={subcategory.id} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-1">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {startIdx}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-foreground">{endIdx}</span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">
                  {filteredRows.length}
                </span>{" "}
                results
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded-lg h-9 px-3"
                >
                  <ChevronLeftIcon className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="text-sm font-medium text-foreground px-2">
                  Page {currentPage} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-lg h-9 px-3"
                >
                  Next
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Card className="border-dashed border-2 border-muted-foreground/20">
          <CardContent className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <SparklesIcon className="size-8" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-foreground">
                {inputValue ? "No results found" : emptyTitle}
              </h2>
              <p className="max-w-md text-sm md:text-base text-muted-foreground">
                {inputValue
                  ? `We couldn't find any match for "${inputValue}". Please check your spelling or try another term.`
                  : emptyDescription}
              </p>
              {inputValue && (
                <Button
                  variant="link"
                  onClick={() => setInputValue("")}
                  className="mt-2 text-primary font-semibold"
                >
                  Clear search
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function DeleteButton({
  section,
  id,
}: {
  section: Section;
  id: string;
}) {
  const [pending, start] = useTransition();
  const onDelete = () =>
    start(async () => {
      const result =
        section === "banner"
          ? await deleteBanner(id)
          : section === "category"
            ? await deleteCategory(id)
            : section === "subcategory"
              ? await deleteSubcategory(id)
              : await deleteProduct(id);
      if (result.ok) toast.success("Deleted");
      else toast.error(result.error);
    });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon-sm"
          className="h-8 w-8 text-destructive border border-destructive/20 hover:bg-destructive hover:text-destructive-foreground transition-all duration-150 rounded-lg group"
        >
          <Trash2Icon className="size-4 group-hover:text-white transition-all duration-150" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this item?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove the record and any uploaded image
            tied to it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} disabled={pending}>
            {pending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function StatusSwitch({
  section,
  id,
  active,
}: {
  section: Section;
  id: string;
  active: boolean;
}) {
  const [pending, start] = useTransition();
  const [checked, setChecked] = useState(active);

  useEffect(() => {
    setChecked(active);
  }, [active]);

  const onToggle = (val: boolean) => {
    setChecked(val);
    start(async () => {
      const result =
        section === "banner"
          ? await toggleBannerStatus(id, val)
          : section === "category"
            ? await toggleCategoryStatus(id, val)
            : section === "subcategory"
              ? await toggleSubcategoryStatus(id, val)
              : await toggleProductStatus(id, val);
      if (!result.ok) {
        toast.error(result.error);
        setChecked(!val);
      } else {
        toast.success("Status updated");
      }
    });
  };

  return (
    <Switch
      checked={checked}
      onCheckedChange={onToggle}
      disabled={pending}
    />
  );
}

export function FallbackImage({
  src,
  alt = "",
  className = "",
}: {
  src?: string | null;
  alt?: string;
  className?: string;
}) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  if (!src || error) {
    return (
      <div className={cn("flex h-full w-full items-center justify-center bg-muted text-muted-foreground/60", className)}>
        <ImageIcon className="size-6 stroke-[1.5]" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={className}
    />
  );
}

export function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(`(${escapedQuery})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-amber-200/70 dark:bg-amber-800/40 text-foreground px-0.5 rounded-xs font-semibold">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export function toTitleCase(str: string): string {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
