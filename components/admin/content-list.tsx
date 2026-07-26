"use client";

import { cn, toTitleCase, getImageUrl } from "@/lib/utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FolderPlusIcon,
  ImageIcon,
  Loader2Icon,
  PlusIcon,
  SearchIcon,
  SearchXIcon,
  Trash2Icon,
  XIcon
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  addHref,
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

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue);
    }, 250);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Extract category options for subcategories
  const categoriesOptions = useMemo(() => {
    if (section !== "subcategory") return [];
    const map = new Map<string, string>();
    (rows as SubcategoryRow[]).forEach((r) => {
      if (r.categoryId && r.categoryName) {
        map.set(r.categoryId, r.categoryName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [rows, section]);

  // Extract category options for products
  const categoryOptions = useMemo(() => {
    if (section !== "product") return [];
    const map = new Map<string, string>();
    (rows as ProductRow[]).forEach((r) => {
      if (r.categoryId && r.categoryName) {
        map.set(r.categoryId, r.categoryName);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [rows, section]);

  // Extract subcategory options for products (filtered by selected category)
  const subcategoryOptions = useMemo(() => {
    if (section !== "product") return [];
    const set = new Set<string>();
    (rows as ProductRow[]).forEach((r) => {
      if (r.subcategory && (selectedCategory === "all" || r.categoryId === selectedCategory)) {
        set.add(r.subcategory);
      }
    });
    return Array.from(set).map((name) => ({ id: name, name }));
  }, [rows, section, selectedCategory]);

  // Filter rows based on selectors and main column search query
  const filteredRows = useMemo(() => {
    let result = rows;

    // Apply Selectors Filter
    if (section === "subcategory" && selectedCategory !== "all") {
      result = (result as SubcategoryRow[]).filter((r) => r.categoryId === selectedCategory);
    } else if (section === "product") {
      if (selectedCategory !== "all") {
        result = (result as ProductRow[]).filter((r) => r.categoryId === selectedCategory);
      }
      if (selectedSubcategory !== "all") {
        result = (result as ProductRow[]).filter((r) => r.subcategory === selectedSubcategory);
      }
    }

    if (!debouncedQuery) return result;
    const query = debouncedQuery.toLowerCase();

    return result.filter((row) => {
      if (section === "banner") {
        const r = row as BannerRow;
        return (r.title?.toLowerCase() || "").includes(query);
      }
      if (section === "category") {
        const r = row as CategoryRow;
        return r.name.toLowerCase().includes(query);
      }
      if (section === "subcategory") {
        const r = row as SubcategoryRow;
        return r.name.toLowerCase().includes(query);
      }
      if (section === "product") {
        const r = row as ProductRow;
        return r.title.toLowerCase().includes(query);
      }
      return true;
    });
  }, [rows, debouncedQuery, section, selectedCategory, selectedSubcategory]);

  // Reset page to 1 when searching or filtering
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, selectedCategory, selectedSubcategory]);

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
          ? "Search by subcategory name..."
          : "Search by product title...";

  return (
    <div className="space-y-6">
      {/* Search and Dropdown Filters */}
      {rows.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative w-full sm:w-72 md:w-80 shadow-xs rounded-lg">
            <SearchIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />
            <Input
              placeholder={searchPlaceholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="pl-10 pr-12 h-11 w-full rounded-lg bg-background border-border text-sm md:text-base"
            />
            <div className="absolute h-full aspect-square group right-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-auto">
              {inputValue !== debouncedQuery ? (
                <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
              ) : inputValue.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setInputValue("");
                    setDebouncedQuery("");
                  }}
                  className="h-full border-1 aspect-square flex items-center justify-center text-muted-foreground/70 group-hover:text-foreground transition-colors rounded-r-lg group-hover:bg-muted focus:outline-hidden border-l-0 border-border group-hover:border-border"
                  title="Clear search"
                >
                  <XIcon className="size-4" />
                </button>
              ) : null}
            </div>
          </div>

          {/* Category Filter for Subcategory */}
          {section === "subcategory" && (
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-11 w-full sm:w-[200px] rounded-lg bg-background border-border text-sm font-medium">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categoriesOptions.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {toTitleCase(c.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Category & Subcategory Filters for Products */}
          {section === "product" && (
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <Select
                value={selectedCategory}
                onValueChange={(value: string) => {
                  setSelectedCategory(value);
                  setSelectedSubcategory("all");
                }}
              >
                <SelectTrigger className="h-11 w-full sm:w-[180px] rounded-lg bg-background border-border text-sm font-medium">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoryOptions.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {toTitleCase(c.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                <SelectTrigger className="h-11 w-full sm:w-[180px] rounded-lg bg-background border-border text-sm font-medium">
                  <SelectValue placeholder="All Subcategories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subcategories</SelectItem>
                  {subcategoryOptions.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {toTitleCase(s.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {filteredRows.length ? (
        <div className="flex flex-col justify-between min-h-[580px] space-y-4">
          <div className="overflow-x-auto md:overflow-x-visible rounded-lg shadow-xs">
            <Table className="min-w-190">
              <TableHeader className="sticky top-0 z-10 bg-background border-b border-border [&_th]:border-b [&_th]:border-border">
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
                                <HighlightText text={banner.title || "Untitled Banner"} query={debouncedQuery} />
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-1 border-t border-border pt-4">
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
        <Card className="border-dashed border-2 border-muted-foreground/20 rounded-xl shadow-2xs bg-background">
          <CardContent className="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground/80 ring-8 ring-muted/30">
              {rows.length > 0 ? (
                <SearchXIcon className="size-7 stroke-[1.75]" />
              ) : (
                <FolderPlusIcon className="size-7 stroke-[1.75]" />
              )}
            </div>
            <div className="space-y-1.5 max-w-md">
              <h2 className="text-lg md:text-xl font-bold text-foreground tracking-tight">
                {rows.length > 0 ? "No matching results found" : emptyTitle}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {rows.length > 0
                  ? `We couldn't find any items matching your current filters or search term "${inputValue || debouncedQuery}".`
                  : emptyDescription}
              </p>
            </div>
            {rows.length > 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInputValue("");
                  setDebouncedQuery("");
                  setSelectedCategory("all");
                  setSelectedSubcategory("all");
                }}
                className="mt-2 h-9.5 px-4 rounded-lg font-semibold border-border hover:bg-muted transition-all gap-2"
              >
                <XIcon className="size-4" />
                <span>Clear Filters & Search</span>
              </Button>
            ) : (
              <Button
                asChild
                className="mt-2 h-9.5 px-5 rounded-lg bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-primary/95 transition-all gap-2"
              >
                <Link href={addHref}>
                  <PlusIcon className="size-4" />
                  <span>Add New Item</span>
                </Link>
              </Button>
            )}
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
      src={getImageUrl(src)}
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


