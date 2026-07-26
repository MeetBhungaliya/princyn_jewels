import { Plus_Jakarta_Sans } from "next/font/google";
import "@/css/globals.css";
import Providers from "@/providers";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin | Princyn Jewels",
    template: "%s | Admin | Princyn Jewels",
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.className} min-h-screen bg-background text-foreground antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
