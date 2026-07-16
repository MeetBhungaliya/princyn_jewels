"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ImageIcon, Package2Icon, PlusIcon, ShapesIcon, TagsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";

const nav = [
  { href: "/admin/banner", label: "Banners", icon: ImageIcon },
  { href: "/admin/categories", label: "Categories", icon: ShapesIcon },
  { href: "/admin/subcategories", label: "Subcategories", icon: TagsIcon },
  { href: "/admin/products", label: "Products", icon: Package2Icon },
];

function AdminNavLinks({ pathname }: { pathname: string }) {
  const { setOpen } = useSidebar();

  return (
    <SidebarMenu>
      {nav.map(({ href, label, icon: Icon }) => (
        <SidebarMenuItem key={href}>
          <SidebarMenuButton asChild isActive={pathname.startsWith(href)}>
            <Link href={href} className="flex w-full items-center gap-3" onClick={() => setOpen(false)}>
              <Icon className="size-4" />
              {label}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const headerAction = Object.entries({
    "/admin/banner": { href: "/admin/banner/new", label: "Add Banner" },
    "/admin/categories": { href: "/admin/categories/new", label: "Add Category" },
    "/admin/subcategories": { href: "/admin/subcategories/new", label: "Add Subcategory" },
    "/admin/products": { href: "/admin/products/new", label: "Add Product" },
  }).find(([path]) => pathname === path || pathname.startsWith(`${path}/`))?.[1] ?? null;

  return <SidebarProvider className="overflow-hidden bg-muted/30">
    <Sidebar>
      <SidebarContent>
        <SidebarHeader className="flex h-16 items-center px-5">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Princyn Jewels" width={40} height={40} className="h-10 w-10 rounded-lg object-contain" />
          </Link>
        </SidebarHeader>
        <Separator />
        <ScrollArea className="min-h-0 flex-1">
          <SidebarGroup>
            <AdminNavLinks pathname={pathname} />
          </SidebarGroup>
        </ScrollArea>
        <Separator />
        <SidebarFooter>
          <Link href="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">View storefront</Link>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur md:px-6">
        <SidebarTrigger className="shrink-0" />
        <div className="min-w-0 flex-1">
          <AdminBreadcrumb />
        </div>
        {headerAction ? <Button asChild size="sm" className="hidden shrink-0 sm:inline-flex">
          <Link href={headerAction.href}>
            <PlusIcon className="size-4" />
            {headerAction.label}
          </Link>
        </Button> : null}
      </header>
      <ScrollArea className="min-h-0 flex-1">
        <main className="mx-auto w-full max-w-7xl p-4 md:p-6">{children}</main>
      </ScrollArea>
    </div>
  </SidebarProvider>;
}
