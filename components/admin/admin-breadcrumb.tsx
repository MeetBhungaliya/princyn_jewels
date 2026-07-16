"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean).filter((segment) => segment !== "admin");

  if (!segments.length) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-wrap">
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const href = "/" + segments.slice(0, index + 1).join("/");
          const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

          return (
            <React.Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="text-base font-semibold text-foreground">{title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground">
                    <Link href={href}>{title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
