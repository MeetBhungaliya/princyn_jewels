"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFloatingButton } from "@/components/WhatsAppFloatingButton";
import Providers from "@/providers";
import "@/css/globals.css";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error("App error:", error);
  }, [error]);

  return (
    <Providers>
      <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-neutral-800">
        <Header />

        <main className="flex-1 flex items-center justify-center px-4 py-16 sm:py-24">
          <div className="max-w-md w-full text-center space-y-8 bg-white/70 backdrop-blur-md p-8 sm:p-12 rounded-3xl border border-amber-100 shadow-xl shadow-amber-900/5 relative overflow-hidden">
            {/* Subtle decorative background shimmer */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

            {/* Alert / Warning Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200/60 flex items-center justify-center shadow-inner">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 text-amber-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-3">
              <span className="inline-block px-3 py-1 text-xs font-semibold tracking-widest text-amber-800 uppercase bg-amber-100/60 rounded-full">
                Something Went Wrong
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-medium text-neutral-900 tracking-tight">
                An Unexpected Error Occurred
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-light">
                We encountered an issue while displaying this page. Please try refreshing or return back to the main showroom.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => reset()}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-full text-sm font-medium text-white bg-amber-700 hover:bg-amber-800 transition-colors duration-200 shadow-md shadow-amber-900/10"
              >
                Try Again
              </button>
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-neutral-300 rounded-full text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 transition-colors duration-200"
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
