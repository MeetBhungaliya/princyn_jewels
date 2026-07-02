"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { Menu } from "lucide-react";

import { Navigation } from "@/components/header/Navigation";
import { MobileSidebar } from "@/components/header/MobileSidebar";

const GOLD = "var(--color-gold)";

/* ─────────────────────────────────────────────
   Mobile Hamburger Button
───────────────────────────────────────────── */
function HamburgerButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="flex size-9 md:h-10 md:w-10 items-center justify-center rounded-full"
      style={{
        border: `1.5px solid rgba(var(--color-gold-rgb),0.5)`,
        backgroundColor: "rgba(var(--color-gold-rgb),0.06)",
        color: GOLD,
        boxShadow: "0 2px 10px rgba(var(--color-gold-rgb),0.15)",
      }}
      whileHover={{
        scale: 1.06,
        backgroundColor: "rgba(var(--color-gold-rgb),0.14)",
        boxShadow: "0 4px 18px rgba(var(--color-gold-rgb),0.25)",
      }}
      whileTap={{ scale: 0.93 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      aria-label="Open navigation menu"
      aria-haspopup="dialog"
    >
      <Menu size={18} strokeWidth={1.75} />
    </motion.button>
  );
}

import { ThemeSwitcher } from "@/components/header/ThemeSwitcher";

/* ─────────────────────────────────────────────
   Header
───────────────────────────────────────────── */
export function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 luxury-header">
        {/* ── Mobile Header: single row, 68px ── */}
        <div
          className="flex items-center justify-between px-4 lg:hidden"
          style={{ height: "68px" }}
        >
          {/* Left: Logo + Brand */}
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full"
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
                className="font-serif text-[1.05rem] uppercase tracking-[0.28em]"
                style={{ color: GOLD }}
              >
                Princyn
              </div>
              <div
                className="text-[0.52rem] font-semibold uppercase tracking-[0.6em]"
                style={{ color: "var(--color-gold-dark)" }}
              >
                Jewels
              </div>
            </div>
          </Link>

          {/* Right: Hamburger */}
          <HamburgerButton onClick={() => setSidebarOpen(true)} />
        </div>

        {/* ── Desktop Header: two rows ── */}
        <div className="hidden lg:block">
          {/* Row 1: Brand (left) + Theme switcher (right) */}
          <div
            className="container mx-auto flex items-center justify-between px-6"
            style={{ height: "68px" }}
          >
            <Link href="/" className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full"
                style={{
                  border: `1.5px solid rgba(var(--color-gold-rgb),0.45)`,
                  backgroundColor: "rgba(var(--color-gold-rgb),0.07)",
                }}
              >
                <Image
                  src="/logo.png"
                  alt="Princyn Jewels"
                  width={40}
                  height={40}
                  priority
                  className="object-contain"
                />
              </div>
              <div className="leading-none">
                <div
                  className="font-serif text-xl uppercase tracking-[0.32em]"
                  style={{ color: GOLD }}
                >
                  Princyn
                </div>
                <div
                  className="text-[0.6rem] font-semibold uppercase tracking-[0.6em]"
                  style={{ color: "var(--color-gold-dark)" }}
                >
                  Jewels
                </div>
              </div>
            </Link>

            <div className="scale-[0.85] origin-right">
              <ThemeSwitcher />
            </div>
          </div>

          {/* Gold divider between rows */}
          <div
            style={{ height: "1px", backgroundColor: "rgba(var(--color-gold-rgb),0.2)" }}
          />

          {/* Row 2: Nav links centered */}
          <div className="container mx-auto flex items-center justify-center px-6 py-1.5">
            <Navigation />
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </>
  );
}
