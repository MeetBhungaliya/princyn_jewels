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
import { ArrowRight } from "lucide-react";

import { navigation } from "./nav-data";

/* Desktop-only navigation bar (hidden on mobile) */
export function Navigation() {
  const pathname = usePathname();

  return (
    <NavigationMenu className="max-w-full" viewport={false}>
      <NavigationMenuList className="flex-wrap gap-1.5">
        {navigation.map((item, i) => {
          if (!item?.items) {
            return (
              <NavigationMenuItem key={item.title + i}>
                <NavigationMenuLink asChild className="hover:bg-transparent">
                  <Link
                    href={item.href || "#"}
                    className={`relative inline-flex h-9 items-center px-3 text-[0.82rem] font-semibold uppercase tracking-[0.24em] text-foreground/80 transition-none hover:text-foreground ${
                      pathname === item.href
                        ? "text-foreground"
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
            <NavigationMenuItem key={item.title + i}>
              <NavigationMenuTrigger className="relative h-9 rounded-none bg-transparent px-3 text-[0.82rem] font-semibold uppercase tracking-[0.24em] text-foreground/80 transition-none hover:bg-transparent hover:text-foreground focus:bg-transparent focus:text-foreground data-[state=open]:bg-transparent data-[state=open]:text-foreground dark:hover:bg-transparent">
                {item.title}
              </NavigationMenuTrigger>

              <NavigationMenuContent className="absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 rounded-xl! bg-transparent p-0">
                <div className="w-56 min-w-56 rounded-xl border border-border/60 bg-surface/95 p-2 shadow-[0_18px_45px_rgba(15,17,21,0.12)] backdrop-blur-xl border-none">
                  <div className="flex flex-col">
                    {item.items.map((child) => (
                      <Link
                        key={child.href + child.title}
                        href={child.href}
                        className="group relative flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-foreground/80 transition-none hover:text-foreground before:absolute before:inset-x-2 before:bottom-1 before:h-px before:origin-left before:scale-x-0 before:bg-foreground/60 before:transition-transform before:duration-300 before:ease-out hover:before:scale-x-100"
                      >
                        <span className="min-w-0 flex-1">{child.title}</span>
                        <ArrowRight className="size-3.5 shrink-0 text-foreground/50 transition-none group-hover:translate-x-1 group-hover:opacity-100 group-hover:text-foreground" />
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
  );
}
