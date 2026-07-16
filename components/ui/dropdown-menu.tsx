"use client";

import * as React from "react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function DropdownMenu({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}
function DropdownMenuTrigger({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}
function DropdownMenuContent({ className, sideOffset = 4, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return <DropdownMenuPrimitive.Portal><DropdownMenuPrimitive.Content data-slot="dropdown-menu-content" sideOffset={sideOffset} className={cn("z-50 min-w-40 overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-md", className)} {...props} /></DropdownMenuPrimitive.Portal>;
}
function DropdownMenuItem({ className, inset, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & { inset?: boolean }) {
  return <DropdownMenuPrimitive.Item data-slot="dropdown-menu-item" className={cn("relative flex cursor-default select-none items-center rounded-md px-2 py-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50", inset && "pl-8", className)} {...props} />;
}
function DropdownMenuCheckboxItem({ className, children, checked, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) {
  return <DropdownMenuPrimitive.CheckboxItem data-slot="dropdown-menu-checkbox-item" checked={checked} className={cn("relative flex cursor-default select-none items-center rounded-md py-2 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground", className)} {...props}><span className="absolute left-2 flex size-3.5 items-center justify-center"><DropdownMenuPrimitive.ItemIndicator><CheckIcon className="size-4" /></DropdownMenuPrimitive.ItemIndicator></span>{children}</DropdownMenuPrimitive.CheckboxItem>;
}
function DropdownMenuRadioItem({ className, children, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return <DropdownMenuPrimitive.RadioItem data-slot="dropdown-menu-radio-item" className={cn("relative flex cursor-default select-none items-center rounded-md py-2 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground", className)} {...props}><span className="absolute left-2 flex size-3.5 items-center justify-center"><DropdownMenuPrimitive.ItemIndicator><CircleIcon className="size-2 fill-current" /></DropdownMenuPrimitive.ItemIndicator></span>{children}</DropdownMenuPrimitive.RadioItem>;
}
function DropdownMenuLabel({ className, inset, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }) { return <DropdownMenuPrimitive.Label data-slot="dropdown-menu-label" className={cn("px-2 py-1.5 text-sm font-medium", inset && "pl-8", className)} {...props} />; }
function DropdownMenuSeparator({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) { return <DropdownMenuPrimitive.Separator data-slot="dropdown-menu-separator" className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />; }
function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) { return <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />; }
function DropdownMenuSub({ ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) { return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />; }
function DropdownMenuSubTrigger({ className, inset, children, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & { inset?: boolean }) { return <DropdownMenuPrimitive.SubTrigger data-slot="dropdown-menu-sub-trigger" className={cn("flex cursor-default select-none items-center rounded-md px-2 py-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground", inset && "pl-8", className)} {...props}>{children}<ChevronRightIcon className="ml-auto size-4" /></DropdownMenuPrimitive.SubTrigger>; }
function DropdownMenuSubContent({ className, ...props }: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) { return <DropdownMenuPrimitive.SubContent data-slot="dropdown-menu-sub-content" className={cn("z-50 min-w-40 overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-md", className)} {...props} />; }

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent };
