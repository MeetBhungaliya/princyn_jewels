"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SocialLinks } from "@/components/header/SocialLinks";
import { ArrowRight, Menu, Phone, Mail, MapPin } from "lucide-react";

import { navigation } from "./nav-data";

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="relative border-t border-border/50 lg:border-t-0">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto flex items-center justify-end px-4 py-2 sm:px-6 lg:justify-center">
        <div className="flex items-center lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-full border border-border/60 bg-background/80 text-foreground shadow-sm"
              >
                <Menu className="size-4" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[92vw] max-w-sm border-r border-border/60 bg-surface/95 p-0 backdrop-blur-xl"
            >
              <SheetHeader className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="overflow-hidden rounded-md">
                    <div className="scale-90 md:scale-100">
                      <span className="sr-only">Brand</span>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 overflow-hidden rounded-full">
                          <img src="/logo.png" alt="logo" className="h-full w-full object-contain" />
                        </div>
                        <div className="text-left">
                          <div className="text-base font-serif tracking-[0.3em] uppercase text-foreground">
                            Princyn
                          </div>
                          <div className="text-xs font-semibold tracking-[0.6em] uppercase text-foreground/70">
                            JEWELS
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-3">
                  {navigation.map((item) => (
                    <div key={item.title} className="space-y-1">
                      {item.items ? (
                        <>
                          <div className="text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground px-1">
                            {item.title}
                          </div>
                          <div className="mt-1 space-y-1 rounded-md border border-border/60 bg-background p-2">
                            {item.items.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="flex items-center justify-between gap-3 rounded-md px-3 py-3 text-sm text-foreground/90 transition-colors hover:bg-surface hover:text-primary"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border/40 bg-muted/10 text-foreground/60">
                                    <ArrowRight className="size-3" />
                                  </div>
                                  <span>{child.title}</span>
                                </div>
                                <ArrowRight className="size-4 text-foreground/40" />
                              </Link>
                            ))}
                          </div>
                        </>
                      ) : (
                        <Link
                          href={item.href!}
                          className={`flex items-center justify-between gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors ${
                            pathname === item.href
                              ? "bg-primary/10 text-primary"
                              : "text-foreground/90 hover:bg-surface hover:text-primary"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border/40 bg-muted/10 text-foreground/60">
                              <ArrowRight className="size-3" />
                            </div>
                            <span>{item.title}</span>
                          </div>
                          <ArrowRight className="size-4 text-foreground/40" />
                        </Link>
                      )}
                    </div>
                  ))}

                  <div className="mt-4 border-t border-border/60 pt-4">
                    <div className="grid gap-2 sm:flex sm:items-center sm:gap-3 mb-3">
                      <a
                        href="#"
                        className="flex w-full items-center justify-center gap-2 rounded-md border border-border/60 bg-background px-3 py-2 text-sm font-medium hover:bg-muted/50"
                      >
                        <span className="text-xs uppercase tracking-wide">Google Play</span>
                      </a>

                      <a
                        href="#"
                        className="flex w-full items-center justify-center gap-2 rounded-md border border-border/60 bg-background px-3 py-2 text-sm font-medium hover:bg-muted/50"
                      >
                        <span className="text-xs uppercase tracking-wide">App Store</span>
                      </a>
                    </div>

                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground mb-2">
                      Connect With Us
                    </div>
                    <SocialLinks />

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-3 rounded-md border border-border/60 bg-background p-3">
                        <Phone className="size-4 text-foreground/70" />
                        <div className="text-sm text-foreground/90">+91 9974878332</div>
                      </div>

                      <div className="flex items-center gap-3 rounded-md border border-border/60 bg-background p-3">
                        <Mail className="size-4 text-foreground/70" />
                        <div className="text-sm text-foreground/90">info@princyn.com</div>
                      </div>

                      <div className="flex items-center gap-3 rounded-md border border-border/60 bg-background p-3">
                        <MapPin className="size-4 text-foreground/70" />
                        <div className="text-sm text-foreground/90">7-8-9, Ground Floor, Satkar Complex</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden lg:block">
          <NavigationMenu className="max-w-full" viewport={false}>
            <NavigationMenuList className="flex-wrap gap-1.5 py-2">
              {navigation.map((item) => {
                if (!item.items) {
                  return (
                    <NavigationMenuItem key={item.title}>
                      <NavigationMenuLink
                        asChild
                        className="hover:bg-transparent"
                      >
                        <Link
                          href={item.href!}
                          className={`relative inline-flex h-9 items-center px-3 text-[0.82rem] font-semibold uppercase tracking-[0.24em] transition-colors duration-300 hover:text-primary ${
                            pathname === item.href
                              ? "text-primary"
                              : "text-foreground/80"
                          }`}
                        >
                          {item.title}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                }

                return (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuTrigger className="relative h-9 rounded-none bg-transparent px-3 text-[0.82rem] font-semibold uppercase tracking-[0.24em] text-foreground/80 transition-colors duration-300 hover:bg-transparent hover:text-primary focus:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-primary dark:hover:bg-transparent">
                      {item.title}
                    </NavigationMenuTrigger>

                    <NavigationMenuContent className="absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 rounded-xl! bg-transparent p-0">
                      <div className="w-56 min-w-56 rounded-xl border border-border/60 bg-surface/95 p-2 shadow-[0_18px_45px_rgba(15,17,21,0.12)] backdrop-blur-xl border-none">
                        <div className="flex flex-col">
                          {item.items.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="group relative flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-foreground/80 transition-all duration-300 hover:text-primary before:absolute before:inset-x-2 before:bottom-1 before:h-px before:origin-left before:scale-x-0 before:bg-primary before:transition-all before:duration-300 hover:before:scale-x-100"
                            >
                              <span className="min-w-0 flex-1">
                                {child.title}
                              </span>
                              <ArrowRight className="size-3.5 shrink-0 text-foreground/50 transition-[transform,opacity,color] duration-300 group-hover:translate-x-1 group-hover:opacity-100 group-hover:text-primary" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
}
