"use client"

import * as React from "react"
import { MenuIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type SidebarContextValue = { open: boolean; setOpen: (open: boolean) => void }
const SidebarContext = React.createContext<SidebarContextValue | null>(null)

function SidebarProvider({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  const [open, setOpen] = React.useState(false)

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <div className={cn("group/sidebar-wrapper flex min-h-dvh w-full", className)}>{children}</div>
    </SidebarContext.Provider>
  )
}

function Sidebar({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  const context = useSidebar()

  return (
    <>
      <aside className={cn("hidden h-dvh w-72 shrink-0 border-r bg-sidebar text-sidebar-foreground md:flex md:flex-col", className)}>
        {children}
      </aside>
      <Sheet open={context.open} onOpenChange={context.setOpen}>
        <SheetContent side="left" className="w-80 border-r p-0" showCloseButton>
          <div className="flex h-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    </>
  )
}

function SidebarTrigger({ className }: { className?: string }) {
  const context = useSidebar()

  return (
    <Button variant="ghost" size="icon" className={cn("md:hidden", className)} onClick={() => context.setOpen(true)}>
      <MenuIcon className="size-4" />
      <span className="sr-only">Open sidebar</span>
    </Button>
  )
}

function SidebarContent({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn("flex h-full min-h-0 flex-col", className)}>{children}</div>
}

function SidebarHeader({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn("p-4", className)}>{children}</div>
}

function SidebarFooter({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn("mt-auto p-4", className)}>{children}</div>
}

function SidebarGroup({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn("px-3 py-2", className)}>{children}</div>
}

function SidebarMenu({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  return <ul className={cn("space-y-1", className)}>{children}</ul>
}

function SidebarMenuItem({ children }: React.PropsWithChildren) {
  return <li>{children}</li>
}

function SidebarMenuButton({
  children,
  className,
  isActive,
  asChild,
}: React.PropsWithChildren<{ className?: string; isActive?: boolean; asChild?: boolean }>) {
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string }>;
    return React.cloneElement(child, {
      className: cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        child.props.className,
        className,
      ),
    });
  }

  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        className,
      )}
    >
      {children}
    </button>
  );
}

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) throw new Error("useSidebar must be used within SidebarProvider")
  return context
}

export { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar }
