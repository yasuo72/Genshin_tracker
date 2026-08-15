"use client";

import { useState } from "react";
import Image from "next/image";
import { PlayerInfo } from "@/lib/types";

interface PlayerHeaderCardProps {
  uid: string;
  player: PlayerInfo;
  onRefresh?: () => void;
}

export default function PlayerHeaderCard({
  uid,
  player,
  onRefresh,
}: PlayerHeaderCardProps) {
  const [avatarError, setAvatarError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showNamecards, setShowNamecards] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    if (onRefresh) onRefresh();
    else window.location.reload();
    setTimeout(() => setRefreshing(false), 2000);
  };

  const avatarSrc =
    !avatarError && player.avatarUrl
      ? player.avatarUrl
      : "https://enka.network/ui/UI_AvatarIcon_Columbina.png";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black/40 p-4 sm:p-5 shadow-2xl backdrop-blur-md">
      {/* Decorative subtle ambient flare */}
      <div className="pointer-events-none absolute right-1/4 top-0 h-48 w-48 rounded-full bg-white/[0.04] blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        
        {/* ================= LEFT: Avatar + Nickname + AR/WL + Signature ================= */}
        <div className="flex items-center gap-4">
          {/* Avatar Square Box */}
          <div className="relative h-20 w-20 sm:h-22 sm:w-22 flex-shrink-0 overflow-hidden rounded-xl border border-white/25 bg-black/50 shadow-lg">
            <Image
              src={avatarSrc}
              alt={player.nickname}
              fill
              sizes="90px"
              className="object-cover object-top p-0.5"
              onError={() => setAvatarError(true)}
              priority
              unoptimized
            />
          </div>

          {/* Player Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
              {player.nickname}
            </h1>
            <div className="mt-0.5 flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-200">
              <span>AR {player.level}</span>
              <span className="text-amber-400 text-[10px]">▲</span>
              <span>WL {player.worldLevel}</span>
            </div>
            {player.signature && (
              <p className="mt-1 text-xs text-zinc-300 italic max-w-xs sm:max-w-md truncate">
                {player.signature}
              </p>
            )}
          </div>
        </div>

        {/* ================= CENTER: 4-Row Stats Table ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-col gap-2 sm:gap-2.5 lg:gap-1 text-xs font-mono border-t lg:border-t-0 lg:border-l border-white/10 pt-3 lg:pt-0 lg:pl-6">
          
          {/* Total Achievements */}
          <div className="flex items-center gap-3">
            <span className="w-16 sm:w-20 lg:w-24 text-left sm:text-right font-bold text-white text-xs sm:text-sm">
              {player.achievements}
            </span>
            <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-300 text-[10px]">
              <svg className="w-3 h-3 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14M9 3v4a3 3 0 006 0V3m-9 4a5 5 0 004.5 4.975V17h-3a1 1 0 00-1 1v2h10v-2a1 1 0 00-1-1h-3v-5.025A5 5 0 0018 7" />
              </svg>
            </div>
            <span className="text-zinc-300 text-xs font-sans font-medium truncate">
              Total Achievements
            </span>
          </div>

          {/* Spiral Abyss */}
          <div className="flex items-center gap-3">
            <span className="w-16 sm:w-20 lg:w-24 text-left sm:text-right font-bold text-white text-xs sm:text-sm">
              {player.abyssText || "12-2 | 31★"}
            </span>
            <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300 text-[10px]">
              <svg className="w-3 h-3 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-zinc-300 text-xs font-sans font-medium truncate">
              Spiral Abyss
            </span>
          </div>

          {/* Imaginarium Theater */}
          <div className="flex items-center gap-3">
            <span className="w-16 sm:w-20 lg:w-24 text-left sm:text-right font-bold text-white text-xs sm:text-sm">
              {player.theaterText || "7 | 5"}
            </span>
            <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-purple-300 text-[10px]">
              <svg className="w-3 h-3 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <span className="text-zinc-300 text-xs font-sans font-medium truncate">
              Imaginarium Theater
            </span>
          </div>

          {/* Stygian Onslaught */}
          <div className="flex items-center gap-3">
            <span className="w-16 sm:w-20 lg:w-24 text-left sm:text-right font-bold text-white text-xs sm:text-sm">
              {player.stygianText || "105s"}
            </span>
            <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 text-[10px]">
              <svg className="w-3 h-3 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-zinc-300 text-xs font-sans font-medium truncate">
              Stygian Onslaught
            </span>
          </div>

        </div>

        {/* ================= RIGHT: Action Buttons (Namecards & Refresh) ================= */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end gap-2.5">
          {/* Namecards Button */}
          <button
            type="button"
            onClick={() => setShowNamecards(!showNamecards)}
            className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 hover:bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-zinc-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 4h7v7H4V4zm0 9h7v7H4v-7zm9-9h7v7h-7V4zm0 9h7v7h-7v-7z" />
            </svg>
            <span>Namecards</span>
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 hover:bg-white/15 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
          >
            <svg
              className={`w-3.5 h-3.5 text-zinc-300 ${refreshing ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
