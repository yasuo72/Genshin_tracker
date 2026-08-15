"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar({ currentUid }: { currentUid?: string }) {
  const router = useRouter();
  const [navUid, setNavUid] = useState("");
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = navUid.trim();
    if (!/^\d{9,10}$/.test(clean)) {
      setError("9-10 digits");
      return;
    }
    setError("");
    router.push(`/u/${clean}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0b0d14]/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-lg shadow-indigo-500/25 transition-transform group-hover:scale-105">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              Genshin<span className="text-indigo-400 font-extrabold">Stats</span>
            </span>
            <span className="text-[10px] text-zinc-400 -mt-1 font-medium tracking-wider uppercase">
              Showcase & Rankings
            </span>
          </div>
        </Link>

        {/* Quick search (if on showcase / detail page) */}
        <form onSubmit={handleSearch} className="relative flex items-center">
          <div className="relative">
            <input
              type="text"
              placeholder={currentUid ? `UID: ${currentUid}` : "Lookup UID..."}
              value={navUid}
              onChange={(e) => {
                setNavUid(e.target.value.replace(/\D/g, "").slice(0, 10));
                setError("");
              }}
              className="h-9 w-36 sm:w-48 md:w-56 rounded-lg border border-white/10 bg-white/5 pl-8 pr-3 text-xs text-white placeholder-zinc-500 transition-all focus:w-48 sm:focus:w-60 md:focus:w-64 focus:border-indigo-500 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <svg
              className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          {error && (
            <span className="absolute -bottom-5 right-0 text-[10px] text-rose-400 font-medium">
              {error}
            </span>
          )}
        </form>
      </div>
    </header>
  );
}
