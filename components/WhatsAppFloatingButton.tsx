"use client";

import { FaWhatsapp } from "react-icons/fa";
import { motion } from "motion/react";

export function WhatsAppFloatingButton() {
  const whatsappUrl = "https://wa.me/+918320828901"; // Replace with actual WhatsApp number

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 pointer-events-none"
    >
      {/* Tooltip message */}
      <div className="hidden sm:flex bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-foreground)] px-4 py-2 rounded-full shadow-lg items-center gap-1.5 text-xs font-semibold select-none pointer-events-auto">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Chat with us</span>
      </div>

      {/* Floating Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="pointer-events-auto flex items-center justify-center size-14 rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20ba5a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
        whileHover={{
          scale: 1.1,
          rotate: 5,
          boxShadow: "0 10px 25px -5px rgba(37, 211, 102, 0.4)",
        }}
        whileTap={{ scale: 0.9 }}
      >
        <FaWhatsapp className="size-7" />
      </motion.a>
    </motion.div>
  );
}
