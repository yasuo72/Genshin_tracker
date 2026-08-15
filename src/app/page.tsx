"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const EXAMPLE_UIDS = [
  { uid: "1823429142", label: "Showcase" },
  { uid: "618285856", label: "NA" },
  { uid: "700057910", label: "EU" },
  { uid: "800000000", label: "Asia" },
];

export default function LandingPage() {
  const [uid, setUid] = useState("");
  const [error, setError] = useState("");
  const [lastUser, setLastUser] = useState<{
    uid: string;
    nickname: string;
    ar?: number;
  } | null>(null);
  const router = useRouter();

  // Retrieve last searched user from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("genshin_last_user");
      if (saved) {
        setLastUser(JSON.parse(saved));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = uid.trim();

    if (!clean) {
      setError("Please enter a Genshin Impact UID.");
      return;
    }

    if (!/^\d{9,10}$/.test(clean)) {
      setError("UID must be 9 or 10 numeric digits.");
      return;
    }

    setError("");
    router.push(`/u/${clean}`);
  };

  const handleSelectUid = (exampleUid: string) => {
    setUid(exampleUid);
    setError("");
    router.push(`/u/${exampleUid}`);
  };

  return (
    <div className="min-h-screen bg-[#0b0d14] text-zinc-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />

      {/* Main Hero Section */}
      <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-indigo-600/15 via-purple-600/10 to-cyan-500/15 blur-[120px]" />

        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-md shadow-sm mb-6">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Real-Time Showcase & Global Stats</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Genshin Impact{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Showcase & Stats
            </span>
          </h1>

          {/* Explainer */}
          <p className="mt-4 max-w-xl text-sm sm:text-base text-zinc-300 leading-relaxed">
            Instantly view public character builds, artifact roll-quality ratings, detailed battle stats, and global percentile rankings by entering any player UID.
          </p>

          {/* Search Card */}
          <div className="mt-8 w-full max-w-lg">
            <form
              onSubmit={handleSubmit}
              className="relative flex flex-col sm:flex-row items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] p-2 shadow-2xl backdrop-blur-xl focus-within:border-indigo-500/60 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all"
            >
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  placeholder="Enter 9 or 10-digit UID (e.g. 1823429142)"
                  value={uid}
                  onChange={(e) => {
                    setUid(e.target.value);
                    if (error) setError("");
                  }}
                  maxLength={10}
                  className="w-full rounded-xl bg-transparent px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none font-mono"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-400 hover:to-cyan-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all cursor-pointer"
              >
                <span>Lookup</span>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </form>

            {/* Error message */}
            {error && (
              <p className="mt-2 text-xs font-medium text-rose-400 animate-fadeIn">
                {error}
              </p>
            )}

            {/* Quick Resume from LocalStorage */}
            {lastUser && (
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-400">
                <span>Recent:</span>
                <button
                  type="button"
                  onClick={() => handleSelectUid(lastUser.uid)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20 transition-all cursor-pointer"
                >
                  <span className="font-semibold text-white">{lastUser.nickname}</span>
                  {lastUser.ar && (
                    <span className="text-[10px] text-indigo-200">AR {lastUser.ar}</span>
                  )}
                  <span className="text-[10px] text-zinc-400">({lastUser.uid})</span>
                </button>
              </div>
            )}

            {/* Example UID chips */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-zinc-400 mr-1">Examples:</span>
              {EXAMPLE_UIDS.map((item) => (
                <button
                  key={item.uid}
                  type="button"
                  onClick={() => handleSelectUid(item.uid)}
                  className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs text-zinc-300 transition-all hover:scale-105 hover:border-indigo-400/40 cursor-pointer font-mono"
                >
                  <span className="font-semibold text-white">{item.uid}</span>
                  <span className="text-[10px] text-zinc-400 ml-1.5 font-sans">({item.label})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="mt-16 sm:mt-24 grid grid-cols-1 gap-6 sm:grid-cols-3 w-full text-left">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-white">Live Showcase Builds</h2>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                Fetches real-time weapon, constellation, and artifact data directly from public in-game showcases.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-white">Artifact Roll Quality</h2>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                Breakdown of substats with visual roll efficiency bars relative to theoretical 5★ maximum values.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14M9 3v4a3 3 0 006 0V3m-9 4a5 5 0 004.5 4.975V17h-3a1 1 0 00-1 1v2h10v-2a1 1 0 00-1-1h-3v-5.025A5 5 0 0018 7" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-white">Global Leaderboards</h2>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                Percentile rankings (Top 1%, Top 20%) simulated against global community build benchmarks.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
