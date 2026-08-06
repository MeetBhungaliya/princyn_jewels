import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";
import Providers from "@/providers";
import "@/css/globals.css";

export default function NotFound() {
  return (
    <Providers>
      <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-neutral-800">
        <Header />
        
        <main className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24">
          <div className="max-w-md w-full text-center space-y-8 bg-white/70 backdrop-blur-md p-8 sm:p-12 rounded-3xl border border-amber-100 shadow-xl shadow-amber-900/5 relative overflow-hidden">
            {/* Subtle decorative background shimmer */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

            {/* Diamond / Sparkle Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200/60 flex items-center justify-center shadow-inner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 text-amber-600 animate-pulse"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-3">
              <span className="inline-block px-3 py-1 text-xs font-semibold tracking-widest text-amber-700 uppercase bg-amber-100/60 rounded-full">
                404 — Page Not Found
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-medium text-neutral-900 tracking-tight">
                Precious Gem Not Found
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-light">
                The page or piece you are looking for might have been moved, renamed, or is temporarily unavailable in our vault.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-full text-sm font-medium text-white bg-amber-700 hover:bg-amber-800 transition-colors duration-200 shadow-md shadow-amber-900/10"
              >
                Return Home
              </Link>
            </div>
          </div>
        </main>

        <Footer />
        <WhatsAppFloatingButton />
      </div>
    </Providers>
  );
}
