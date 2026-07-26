import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/css/globals.css";
import Providers from "@/providers";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/header";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Princyn Jewels",
    template: "%s | Princyn Jewels",
  },
  description:
    "Princyn Jewels is a jewelry store that offers a wide range of high-quality jewelry products, including rings, necklaces, bracelets, and earrings. Our mission is to provide our customers with beautiful and unique jewelry pieces that they can cherish for a lifetime.",
  openGraph: {
    title: "Princyn Jewels",
    description: "Princyn Jewels is a jewelry store that offers a wide range of high-quality jewelry products, including rings, necklaces, bracelets, and earrings.",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Princyn Jewels Logo" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Princyn Jewels",
    description: "Princyn Jewels is a jewelry store that offers a wide range of high-quality jewelry products, including rings, necklaces, bracelets, and earrings.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
          <WhatsAppFloatingButton />
        </Providers>
      </body>
    </html>
  );
}

