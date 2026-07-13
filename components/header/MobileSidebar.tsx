"use client";

import {
  ChevronDown,
  X
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "@/providers";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaFacebook, FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa";

import { navigation } from "./nav-data";

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ─────────────────────────────────────────────
   Constants – luxury palette
───────────────────────────────────────────── */
const GOLD = "var(--color-gold)";
const GOLD_DARK = "var(--color-gold-dark)";


/* ─────────────────────────────────────────────
   AccordionItem – single category row
───────────────────────────────────────────── */
function AccordionItem({
  item,
  isOpen,
  onToggle,
  pathname,
}: {
  item: (typeof navigation)[0];
  isOpen: boolean;
  onToggle: () => void;
  pathname: string;
}) {
  const isActive = item.items
    ? item.items.some((c) => c.href === pathname)
    : item.href === pathname;

  return (
    <div className="relative" role="none">
      {/* Active bar */}
      {isActive && (
        <motion.div
          layoutId="active-bar"
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full"
          style={{ backgroundColor: GOLD }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}

      {item.items ? (
        <>
          {/* Trigger */}
          <button
            onClick={onToggle}
            aria-expanded={isOpen}
            className="group relative flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors duration-200"
            style={{
              backgroundColor: isOpen
                ? "rgba(var(--color-gold-rgb),0.12)"
                : "transparent",
            }}
            onMouseEnter={(e) => {
              if (!isOpen)
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  "rgba(var(--color-gold-rgb),0.08)";
            }}
            onMouseLeave={(e) => {
              if (!isOpen)
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  "transparent";
            }}
          >
            <span
              className="text-[0.8rem] font-semibold uppercase tracking-[0.22em] transition-colors duration-200"
              style={{
                color: isActive || isOpen ? GOLD : "var(--color-foreground)",
              }}
            >
              {item.title}
            </span>

            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <ChevronDown
                size={14}
                style={{
                  color: isOpen ? GOLD : "var(--color-foreground-secondary)",
                }}
              />
            </motion.div>
          </button>

          {/* Submenu */}
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                key="submenu"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ overflow: "hidden" }}
              >
                <div className="pb-1 pt-0.5">
                  {item.items.map((child, i) => {
                    const childActive = child.href === pathname;
                    return (
                      <motion.div
                        key={child.href + child.title}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: i * 0.04,
                          duration: 0.2,
                          ease: "easeOut",
                        }}
                      >
                        <Link
                          href={child.href}
                          className="flex items-center gap-3 py-2.5 pl-8 pr-5 text-sm transition-colors duration-150"
                          style={{
                            color: childActive
                              ? GOLD
                              : "var(--color-foreground-secondary)",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.color = GOLD;
                            (
                              e.currentTarget as HTMLElement
                            ).style.backgroundColor = "rgba(var(--color-gold-rgb),0.06)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.color =
                              childActive
                                ? GOLD
                                : "var(--color-foreground-secondary)";
                            (
                              e.currentTarget as HTMLElement
                            ).style.backgroundColor = "transparent";
                          }}
                        >
                          {/* Dot accent */}
                          <span
                            className="h-1 w-1 shrink-0 rounded-full"
                            style={{
                              backgroundColor: childActive
                                ? GOLD
                                : "rgba(var(--color-gold-rgb),0.4)",
                            }}
                          />
                          <span className="font-medium tracking-wide">
                            {child.title}
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <Link
          href={item.href || "#"}
          className="flex items-center justify-between px-5 py-3.5 transition-colors duration-200"
          style={{
            color: isActive ? GOLD : "var(--color-foreground)",
            backgroundColor: isActive ? "rgba(var(--color-gold-rgb),0.12)" : "transparent",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              "rgba(var(--color-gold-rgb),0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = isActive
              ? "rgba(var(--color-gold-rgb),0.12)"
              : "transparent";
          }}
        >
          <span className="text-[0.8rem] font-semibold uppercase tracking-[0.22em]">
            {item.title}
          </span>
        </Link>
      )}

      {/* Divider */}
      <div
        className="mx-5 h-px"
        style={{ backgroundColor: "rgba(var(--color-gold-rgb),0.12)" }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Theme Toggle Row
───────────────────────────────────────────── */
import { Switch } from "@/components/ui/switch";

function ThemeToggleRow() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex w-full cursor-pointer items-center justify-between px-5 py-3.5 transition-colors duration-200"
      style={{ color: "var(--color-foreground-secondary)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor =
          "rgba(var(--color-gold-rgb),0.08)";
        (e.currentTarget as HTMLElement).style.color = GOLD;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
        (e.currentTarget as HTMLElement).style.color =
          "var(--color-foreground-secondary)";
      }}
      role="button"
      aria-label="Toggle theme"
    >
      <div className="flex items-center gap-3.5">
        <span className="text-base">{isDark ? "🌙" : "☀️"}</span>
        <span className="text-sm font-medium tracking-wide">
          {isDark ? "Dark Mode" : "Light Mode"}
        </span>
      </div>
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        className="data-[state=checked]:bg-[#C6A86B]"
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   MobileSidebar
───────────────────────────────────────────── */
export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(i: number) {
    setOpenIndex((prev) => (prev === i ? null : i));
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* ── Panel ── */}
          <motion.div
            key="sidebar"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 32,
              mass: 0.9,
            }}
            className="fixed left-0 top-0 z-50 flex h-full w-[88vw] max-w-[340px] flex-col"
            style={{
              backgroundColor: "var(--color-background)",
              borderRight: `1px solid rgba(var(--color-gold-rgb),0.2)`,
              boxShadow: "16px 0 48px rgba(0,0,0,0.2)",
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* ── Sidebar Header ── */}
            <div
              className="flex shrink-0 items-center justify-between px-5 py-[13.5px]"
              style={{
                borderBottom: `1px solid rgba(var(--color-gold-rgb),0.2)`,
              }}
            >
              {/* Logo + Brand */}
              <Link href="/" onClick={onClose} className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full"
                  style={{
                    border: `1.5px solid rgba(var(--color-gold-rgb),0.5)`,
                    backgroundColor: "rgba(var(--color-gold-rgb),0.06)",
                  }}
                >
                  <Image
                    src="/logo.png"
                    alt="Princyn Jewels"
                    width={36}
                    height={36}
                    className="object-contain"
                    priority
                  />
                </div>
                <div>
                  <div
                    className="font-serif text-base uppercase tracking-[0.28em]"
                    style={{ color: GOLD }}
                  >
                    Princyn
                  </div>
                  <div
                    className="text-[0.55rem] font-semibold uppercase tracking-[0.6em]"
                    style={{ color: GOLD_DARK }}
                  >
                    Jewels
                  </div>
                </div>
              </Link>

              {/* Close button */}
              <motion.button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200"
                style={{
                  border: `1px solid rgba(var(--color-gold-rgb),0.3)`,
                  color: "var(--color-foreground-secondary)",
                }}
                whileHover={{
                  backgroundColor: "rgba(var(--color-gold-rgb),0.1)",
                  color: GOLD,
                  scale: 1.05,
                }}
                whileTap={{ scale: 0.93 }}
                aria-label="Close navigation menu"
              >
                <X size={16} color={GOLD} />
              </motion.button>
            </div>

            {/* ── Navigation ── */}
            <nav
              className="flex-1 overflow-y-auto py-2"
              aria-label="Main navigation"
            >
              {/* Category label */}
              <div
                className="px-5 pb-2 pt-3 text-[0.62rem] font-semibold uppercase tracking-[0.35em]"
                style={{ color: "rgba(var(--color-gold-rgb),0.6)" }}
              >
                Collections
              </div>

              {navigation.map((item, i) => (
                <AccordionItem
                  key={item.title + i}
                  item={item}
                  isOpen={openIndex === i}
                  onToggle={() => toggle(i)}
                  pathname={pathname}
                />
              ))}
            </nav>

            {/* ── Footer ── */}
            <div
              className="shrink-0"
              style={{ borderTop: `1px solid rgba(var(--color-gold-rgb),0.15)` }}
            >
              {/* Theme toggle */}
              <ThemeToggleRow />

              <div
                className="mx-5 h-px"
                style={{ backgroundColor: "rgba(var(--color-gold-rgb),0.12)" }}
              />

              {/* Social links */}
              <div
                className="flex items-center gap-3 px-5 py-3"
                style={{ borderTop: `1px solid rgba(var(--color-gold-rgb),0.12)` }}
              >
                {[
                  { icon: FaInstagram, href: "#", label: "Instagram" },
                  { icon: FaFacebook, href: "#", label: "Facebook" },
                  { icon: FaYoutube, href: "#", label: "YouTube" },
                  {
                    icon: FaWhatsapp,
                    href: "https://wa.me/919974878332",
                    label: "WhatsApp",
                  },
                ].map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200"
                    style={{
                      border: `1px solid rgba(var(--color-gold-rgb),0.25)`,
                      color: "var(--color-foreground-secondary)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        GOLD;
                      (e.currentTarget as HTMLElement).style.color = "#fff";
                      (e.currentTarget as HTMLElement).style.borderColor = GOLD;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        "transparent";
                      (e.currentTarget as HTMLElement).style.color =
                        "var(--color-foreground-secondary)";
                      (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(var(--color-gold-rgb),0.25)";
                    }}
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
