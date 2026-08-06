"use client";

import Link from "next/link";
import "@/css/globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-[#FAF9F6] text-neutral-800 p-4">
        <div className="max-w-md w-full text-center space-y-8 bg-white p-8 sm:p-12 rounded-3xl border border-amber-100 shadow-xl">
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-widest text-amber-800 uppercase bg-amber-100 rounded-full">
              System Error
            </span>
            <h1 className="text-3xl font-serif font-medium text-neutral-900">
              Princyn Jewels
            </h1>
            <p className="text-sm text-neutral-600 leading-relaxed">
              A critical error occurred. Please attempt to reload the
              application.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-full text-sm font-medium text-white bg-amber-700 hover:bg-amber-800 transition-colors duration-200"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-neutral-300 rounded-full text-sm font-medium text-neutral-700 bg-white hover:bg-neutral-50 transition-colors duration-200"
            >
              Back to Safety
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
