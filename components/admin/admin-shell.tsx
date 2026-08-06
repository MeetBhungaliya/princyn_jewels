"use client";

import {
  ImageIcon,
  Package2Icon,
  PlusIcon,
  ShapesIcon,
  TagsIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AdminBreadcrumb } from "@/components/admin/admin-breadcrumb";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

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
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(href)}
            className="h-10 px-3 transition-all duration-200"
          >
            <Link
              href={href}
              className="flex w-full items-center gap-3.5 text-sm md:text-[0.95rem] font-medium"
              onClick={() => setOpen(false)}
            >
              <Icon className="size-5 shrink-0" />
              <span>{label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const headerAction =
    Object.entries({
      "/admin/banner": { href: "/admin/banner/new", label: "Add Banner" },
      "/admin/categories": {
        href: "/admin/categories/new",
        label: "Add Category",
      },
      "/admin/subcategories": {
        href: "/admin/subcategories/new",
        label: "Add Subcategory",
      },
      "/admin/products": { href: "/admin/products/new", label: "Add Product" },
    }).find(
      ([path]) => pathname === path || pathname.startsWith(`${path}/`),
    )?.[1] ?? null;

  return (
    <SidebarProvider className="h-screen w-full overflow-hidden bg-muted/30">
      <Sidebar className="border-r">
        <SidebarContent>
          <SidebarHeader className="flex h-16 items-center px-4 border-b">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full transition-all duration-500"
                style={{
                  border: `1.5px solid rgba(var(--color-gold-rgb),0.45)`,
                  backgroundColor: "rgba(var(--color-gold-rgb),0.07)",
                }}
              >
                <Image
                  src="/logo.png"
                  alt="Princyn Jewels"
                  width={36}
                  height={36}
                  priority
                  className="object-contain"
                />
              </div>

              <div className="leading-none">
                <div
                  className="font-serif text-[0.95rem] uppercase tracking-[0.28em] transition-all duration-500"
                  style={{ color: "var(--color-gold)" }}
                >
                  Princyn
                </div>
                <div
                  className="text-[0.48rem] font-semibold uppercase tracking-[0.6em] transition-all duration-500"
                  style={{ color: "var(--color-gold-dark)" }}
                >
                  Jewels
                </div>
              </div>
            </Link>
          </SidebarHeader>
          <ScrollArea className="min-h-0 flex-1">
            <SidebarGroup className="pt-4 md:pt-6">
              <AdminNavLinks pathname={pathname} />
            </SidebarGroup>
          </ScrollArea>
        </SidebarContent>
      </Sidebar>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background px-4 md:px-6 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <SidebarTrigger className="shrink-0" />
            {pathname !== "/admin" && pathname !== "/admin/" && (
              <div className="min-w-0">
                <AdminBreadcrumb />
              </div>
            )}
          </div>
          {headerAction ? (
            <Button
              asChild
              className="shrink-0 h-9.5 rounded-lg bg-primary px-4 text-xs md:text-sm font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Link
                href={headerAction.href}
                className="flex items-center gap-2"
              >
                <PlusIcon className="size-4 stroke-[2.5]" />
                <span>{headerAction.label}</span>
              </Link>
            </Button>
          ) : null}
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-gradient-to-br from-background via-background/98 to-[color-mix(in_srgb,var(--color-primary)_4%,transparent)]">
          <main className="mx-auto w-full max-w-7xl p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
