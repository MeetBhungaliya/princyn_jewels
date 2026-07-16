"use client";

import Link from "next/link";
import { useTransition } from "react";
import {
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
  SparklesIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  deleteBanner,
  deleteCategory,
  deleteProduct,
  deleteSubcategory,
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
  return (
    <div className="space-y-6">
      <Card className="border-primary/15 bg-linear-to-br from-background via-background to-primary/5 shadow-sm">
        <CardHeader className="flex-row items-center justify-between gap-4">
          <div className="min-w-0">
            <CardTitle className="text-xl">{title}</CardTitle>
            <CardDescription className="mt-1 text-sm text-muted-foreground">
              {description}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
      {rows.length ? (
        <Card className="py-0">
          <CardContent className="p-0 [&>div:first-child]:border-none">
            <div className="max-h-[calc(100dvh-18rem)] overflow-auto">
              <Table className="min-w-190">
                <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur">
                  <TableRow className="border-b bg-background/95">
                    {section === "banner" && (
                      <>
                        <TableHead>Preview</TableHead>
                        <TableHead>Desktop</TableHead>
                        <TableHead>Mobile</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Status</TableHead>
                      </>
                    )}
                    {section === "category" && (
                      <>
                        <TableHead>Preview</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Status</TableHead>
                      </>
                    )}
                    {section === "subcategory" && (
                      <>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Status</TableHead>
                      </>
                    )}
                    {section === "product" && (
                      <>
                        <TableHead>Image</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Subcategory</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Status</TableHead>
                      </>
                    )}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {section === "banner" &&
                    rows.map((row) => {
                      const banner = row as BannerRow;
                      return (
                        <TableRow key={banner.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="relative h-16 w-24 overflow-hidden rounded-lg border bg-muted">
                                <img
                                  src={banner.desktopImage}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="hidden sm:block">
                                <p className="font-medium">
                                  {banner.title || "Untitled banner"}
                                </p>
                                <p className="max-w-xs truncate text-xs text-muted-foreground">
                                  {banner.link || "No destination link"}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {banner.desktopImage}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {banner.mobileImage}
                          </TableCell>
                          <TableCell className="text-sm">
                            {banner.order}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={banner.active ? "default" : "secondary"}
                            >
                              {banner.active ? "Active" : "Hidden"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <RowActions
                              section="banner"
                              id={banner.id}
                              editHref={`/admin/banner/${banner.id}`}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {section === "category" &&
                    rows.map((row) => {
                      const category = row as CategoryRow;
                      return (
                        <TableRow key={category.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="relative h-16 w-24 overflow-hidden rounded-lg border bg-muted">
                                <img
                                  src={category.imagePath}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">{category.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {category.tagline}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {category.name}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {category.slug}
                          </TableCell>
                          <TableCell className="text-sm">
                            {category.order}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                category.active ? "default" : "secondary"
                              }
                            >
                              {category.active ? "Active" : "Hidden"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <RowActions
                              section="category"
                              id={category.id}
                              editHref={`/admin/categories/${category.id}`}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {section === "product" &&
                    rows.map((row) => {
                      const product = row as ProductRow;
                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="relative h-16 w-24 overflow-hidden rounded-lg border bg-muted">
                                <img
                                  src={product.imagePath}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="hidden sm:block">
                                <p className="font-medium">{product.title}</p>
                                <p className="max-w-xs truncate text-xs text-muted-foreground">
                                  {product.link || "No destination link"}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {product.title}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {product.categoryName}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {product.subcategory}
                          </TableCell>
                          <TableCell className="text-sm">
                            {product.order}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={product.active ? "default" : "secondary"}
                            >
                              {product.active ? "Active" : "Hidden"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <RowActions
                              section="product"
                              id={product.id}
                              editHref={`/admin/products/${product.id}`}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {section === "subcategory" &&
                    rows.map((row) => {
                      const subcategory = row as SubcategoryRow;
                      return (
                        <TableRow key={subcategory.id}>
                          <TableCell className="font-medium">
                            {subcategory.name}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {subcategory.categoryName}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {subcategory.slug}
                          </TableCell>
                          <TableCell className="text-sm">
                            {subcategory.order}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                subcategory.active ? "default" : "secondary"
                              }
                            >
                              {subcategory.active ? "Active" : "Hidden"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <RowActions
                              section="subcategory"
                              id={subcategory.id}
                              editHref={`/admin/subcategories/${subcategory.id}`}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <SparklesIcon className="size-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">{emptyTitle}</h2>
              <p className="max-w-md text-sm text-muted-foreground">
                {emptyDescription}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function RowActions({
  section,
  id,
  editHref,
}: {
  section: Section;
  id: string;
  editHref: string;
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
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={editHref} className="flex items-center gap-2">
              <PencilIcon className="size-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className="flex items-center gap-2 text-destructive focus:text-destructive"
                onSelect={(event) => event.preventDefault()}
              >
                <Trash2Icon className="size-4" />
                Delete
              </DropdownMenuItem>
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
