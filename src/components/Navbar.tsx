"use client";

import Link from "next/link";
import Image from "next/image";
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
        <Link href="/" className="flex items-center gap-3 group">
          {/* Frameless Floating Glowing Primogem */}
          <div className="relative h-10 w-10 flex-shrink-0 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md transition-all duration-300 group-hover:bg-cyan-400/35 group-hover:scale-125" />
            <Image
              src="https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_ItemIcon_201.png"
              alt="Primogem"
              width={38}
              height={38}
              priority
              className="relative z-10 object-contain transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 drop-shadow-[0_2px_12px_rgba(56,189,248,0.75)]"
              unoptimized
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wide text-white transition-colors">
                ASTRALIS<span className="text-cyan-400 font-extrabold">.</span>
              </span>
              <span className="rounded-md border border-cyan-500/40 bg-cyan-950/40 px-2 py-0.5 font-mono text-[10px] font-black tracking-widest text-cyan-300 shadow-sm backdrop-blur-sm">
                YASUO72
              </span>
            </div>
            <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase -mt-0.5">
              Showcase & Theorycraft
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
