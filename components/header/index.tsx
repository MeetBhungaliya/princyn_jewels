"use client";

import { Menu } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { MobileSidebar } from "@/components/header/MobileSidebar";
import { Navigation } from "@/components/header/Navigation";

const GOLD = "var(--color-gold)";

const SCROLL_DOWN_THRESHOLD = 100;
const SCROLL_UP_THRESHOLD = 10;

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
  const [isScrolled, setIsScrolled] = useState(false);
  const isScrolledRef = useRef(false);
  const rafId = useRef<number>(0);

  const handleScroll = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      const y = window.scrollY;

      if (!isScrolledRef.current && y > SCROLL_DOWN_THRESHOLD) {
        isScrolledRef.current = true;
        setIsScrolled(true);
      } else if (isScrolledRef.current && y < SCROLL_UP_THRESHOLD) {
        isScrolledRef.current = false;
        setIsScrolled(false);
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [handleScroll]);

  return (
    <>
      <header 
        className={`sticky top-0 z-50 luxury-header border-b transition-all duration-500 ease-in-out ${
          isScrolled 
            ? "scrolled shadow-[0_10px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.45)] border-border/30 backdrop-blur-md" 
            : "border-transparent"
        }`}
      >
        {/* ── Mobile Header: single row, shrinks from 68px to 56px ── */}
        <div
          className="flex items-center justify-between px-4 lg:hidden transition-all duration-500 ease-in-out"
          style={{ height: isScrolled ? "56px" : "68px" }}
        >
          {/* Left: Logo + Brand */}
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full transition-all duration-500"
              style={{
                border: `1.5px solid rgba(var(--color-gold-rgb),0.45)`,
                backgroundColor: "rgba(var(--color-gold-rgb),0.07)",
                transform: isScrolled ? "scale(0.9)" : "scale(1)"
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
                style={{ color: GOLD }}
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

          {/* Right: Hamburger */}
          <HamburgerButton onClick={() => setSidebarOpen(true)} />
        </div>

        {/* ── Desktop Header: two rows ── */}
        <div className="hidden lg:block">
          {/* Row 1: Brand (left) + Theme switcher (right) */}
          <motion.div
            initial={false}
            animate={{
              height: isScrolled ? 0 : 68,
              opacity: isScrolled ? 0 : 1,
              y: isScrolled ? -10 : 0
            }}
            transition={{
              height: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
              y: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
            }}
            className="container mx-auto flex items-center justify-between px-6 overflow-hidden"
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
          </motion.div>

          {/* Gold divider between rows */}
          <motion.div
            initial={false}
            animate={{
              opacity: isScrolled ? 0 : 1,
              height: isScrolled ? 0 : 1
            }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
            style={{ backgroundColor: "rgba(var(--color-gold-rgb),0.2)" }}
          />

          {/* Row 2: Nav links centered */}
          <motion.div 
            initial={false}
            animate={{
              paddingTop: isScrolled ? "0.4rem" : "0.375rem",
              paddingBottom: isScrolled ? "0.4rem" : "0.375rem",
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="container mx-auto flex items-center justify-center px-6"
          >
            <Navigation />
          </motion.div>
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