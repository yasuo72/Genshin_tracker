"use client";

import Link from "next/link";
import { ShowcaseErrorCode } from "@/lib/types";

interface ErrorStateProps {
  error: ShowcaseErrorCode | string;
  uid?: string;
  onRetry?: () => void;
}

interface ErrorDetails {
  title: string;
  message: string;
  tip?: string;
  badge: string;
  color: string;
  iconBg: string;
}

const ERROR_MAP: Record<string, ErrorDetails> = {
  PRIVATE_SHOWCASE: {
    title: "Showcase is Private or Empty",
    message:
      "This player has hidden their character details or has no characters set in their in-game showcase.",
    tip: "In Genshin Impact, open Paimon Menu > Edit Profile > enable 'Show Character Details' and add characters to your showcase.",
    badge: "Private Showcase (403)",
    color: "text-amber-400",
    iconBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  UID_NOT_FOUND: {
    title: "Player UID Not Found",
    message:
      "We couldn't find a Genshin Impact player with this UID on any server.",
    tip: "Double-check the UID digits in-game (displayed in the bottom-right corner of the screen).",
    badge: "Not Found (404)",
    color: "text-rose-400",
    iconBg: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  },
  INVALID_UID: {
    title: "Invalid UID Format",
    message: "Genshin Impact UIDs must be 9 or 10 numeric digits.",
    tip: "Example valid UIDs: 618285856 (NA), 700000000 (EU), 800000000 (Asia).",
    badge: "Bad Request (400)",
    color: "text-orange-400",
    iconBg: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  },
  UPSTREAM_RATE_LIMITED: {
    title: "Service Rate Limited",
    message:
      "The showcase data service is currently receiving high traffic.",
    tip: "Please wait 30-60 seconds before trying again to allow the rate limit to reset.",
    badge: "Rate Limited (429)",
    color: "text-purple-400",
    iconBg: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
  UPSTREAM_DOWN: {
    title: "Showcase Service Unavailable",
    message:
      "Unable to reach the live character showcase service at this moment.",
    tip: "The service might be temporarily undergoing maintenance or experiencing downtime.",
    badge: "Service Unavailable (502)",
    color: "text-red-400",
    iconBg: "bg-red-500/20 text-red-300 border-red-500/30",
  },
};

export default function ErrorState({ error, uid, onRetry }: ErrorStateProps) {
  const details = ERROR_MAP[error] ?? {
    title: "Failed to Load Showcase",
    message: "An unexpected error occurred while fetching player data.",
    badge: "Error",
    color: "text-rose-400",
    iconBg: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent p-8 text-center backdrop-blur-2xl sm:p-12 shadow-2xl">
      {/* Badge */}
      <span
        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${details.iconBg}`}
      >
        {details.badge}
      </span>

      {/* Icon */}
      <div className="my-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-3xl shadow-inner">
        {error === "PRIVATE_SHOWCASE" ? "🔒" : error === "UID_NOT_FOUND" ? "🔍" : "⚠️"}
      </div>

      {/* Title & Message */}
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
        {details.title}
      </h2>
      <p className="mt-3 text-sm text-zinc-300 leading-relaxed max-w-md">
        {details.message}
      </p>

      {/* Tip Callout */}
      {details.tip && (
        <div className="mt-6 w-full rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left text-xs text-zinc-300">
          <div className="font-semibold text-zinc-200 flex items-center gap-1.5 mb-1">
            <span>💡</span>
            <span>How to resolve:</span>
          </div>
          <p className="text-zinc-400 leading-relaxed">{details.tip}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Try Again</span>
          </button>
        )}
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-5 py-2.5 text-xs font-semibold text-white border border-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Search another UID</span>
        </Link>
      </div>

      {uid && (
        <span className="mt-6 text-[11px] font-mono text-zinc-500">
          Queried UID: {uid}
        </span>
      )}
    </div>
  );
}
