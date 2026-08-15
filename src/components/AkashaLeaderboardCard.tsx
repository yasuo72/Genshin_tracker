"use client";

import React from "react";
import Image from "next/image";
import { CharacterInfo, CharacterRanking } from "@/lib/types";

interface AkashaLeaderboardCardProps {
  uid: string;
  character: CharacterInfo;
  ranking: CharacterRanking | null;
}

export default function AkashaLeaderboardCard({
  uid,
  character,
  ranking,
}: AkashaLeaderboardCardProps) {
  // Calculate Character CV (Crit Value) from artifacts
  let totalArtifactCV = 0;
  for (const art of character.artifacts) {
    let cr = 0;
    let cd = 0;
    for (const sub of art.subStats) {
      if (sub.name.includes("CRIT Rate")) cr += sub.value;
      if (sub.name.includes("CRIT DMG")) cd += sub.value;
    }
    totalArtifactCV += 2 * cr + cd;
  }
  const roundedCV = Math.round(totalArtifactCV * 10) / 10;

  // Build CV tier rating
  let cvRating = "Standard";
  let cvColor = "text-zinc-300";
  let cvBg = "bg-white/10 border-white/20";
  if (roundedCV >= 220) {
    cvRating = "God Roll (220+ CV)";
    cvColor = "text-amber-300";
    cvBg = "bg-amber-500/20 border-amber-400/40";
  } else if (roundedCV >= 190) {
    cvRating = "Excellent (190+ CV)";
    cvColor = "text-fuchsia-300";
    cvBg = "bg-fuchsia-500/20 border-fuchsia-400/40";
  } else if (roundedCV >= 160) {
    cvRating = "Great (160+ CV)";
    cvColor = "text-cyan-300";
    cvBg = "bg-cyan-500/20 border-cyan-400/40";
  }

  const akashaProfileUrl = `https://akasha.cv/profile/${uid}`;

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-white/15 bg-black/45 p-5 sm:p-7 lg:p-8 shadow-2xl backdrop-blur-md text-zinc-100 transition-all">
      {/* ================= 1. HEADER & REAL AKASHA RANK BANNER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 sm:h-16 sm:w-16 flex-shrink-0 rounded-2xl bg-gradient-to-tr from-amber-500 via-purple-600 to-cyan-400 p-[1.5px] shadow-xl">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0b0d14] p-1 overflow-hidden">
              {character.iconUrl ? (
                <Image
                  src={character.iconUrl}
                  alt={character.name}
                  width={56}
                  height={56}
                  className="object-contain"
                  unoptimized
                />
              ) : (
                <span className="font-bold text-lg">{character.name[0]}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-indigo-500/25 px-2.5 py-0.5 text-xs font-bold text-indigo-200 border border-indigo-500/40 font-mono">
                AKASHA SYSTEM
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {character.name}
              </h3>
            </div>
            <span className="text-xs text-zinc-400 font-medium mt-0.5">
              Equipped: <strong className="text-amber-300">{character.weapon.name}</strong> (R{character.weapon.refinement})
            </span>
          </div>
        </div>

        {/* Global Rank & Percentile Pill */}
        <div className="flex flex-wrap items-center gap-3">
          {ranking ? (
            <div className="flex items-center gap-3 rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-black/60 px-4 py-2.5 shadow-xl">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14M9 3v4a3 3 0 006 0V3m-9 4a5 5 0 004.5 4.975V17h-3a1 1 0 00-1 1v2h10v-2a1 1 0 00-1-1h-3v-5.025A5 5 0 0018 7" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                  Live Akasha Rank
                </span>
                <span className="font-mono text-lg font-black text-amber-300 leading-tight">
                  Top {ranking.topPercent}% <span className="text-xs text-zinc-300 font-bold">(#{ranking.ranking.toLocaleString()} / {ranking.outOf.toLocaleString()})</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 shadow-xl">
              <span className="text-xs text-zinc-400 font-medium">
                Not yet indexed on Akasha leaderboards
              </span>
            </div>
          )}

          <a
            href={akashaProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 px-3.5 py-2.5 text-xs font-bold text-white transition-all shadow-md cursor-pointer hover:scale-105"
          >
            <span>View on Akasha.cv</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>

      {/* ================= 2. THREE KEY METRICS GAUGE ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Artifact CV */}
        <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/40 p-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span>Artifact Crit Value (CV)</span>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${cvBg} ${cvColor}`}>
              {cvRating}
            </span>
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-3xl font-black text-white">{roundedCV}</span>
            <span className="text-xs text-zinc-400">/ 240 Max</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 rounded-full"
              style={{ width: `${Math.min(100, (roundedCV / 240) * 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 2: CRIT Ratio Quality */}
        <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/40 p-4">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span>Combat CRIT Ratio</span>
            <span className="text-xs font-mono font-bold text-cyan-300">
              1 : {(character.stats.critDmg / Math.max(1, character.stats.critRate)).toFixed(1)}
            </span>
          </div>
          <div className="flex items-baseline gap-2 font-mono">
            <span className="text-2xl sm:text-3xl font-black text-amber-300">
              {character.stats.critRate}%
            </span>
            <span className="text-zinc-500 font-bold">/</span>
            <span className="text-2xl sm:text-3xl font-black text-purple-300">
              {character.stats.critDmg}%
            </span>
          </div>
          <div className="text-[11px] text-zinc-400">
            Optimal 1:2 Golden Ratio balance
          </div>
        </div>

        {/* Metric 3: Leaderboard Category */}
        <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/40 p-4">
          <div className="text-xs text-zinc-400 font-medium">
            Leaderboard Calculation Category
          </div>
          <div className="text-base font-bold text-white truncate" title={ranking?.calculation || ranking?.weapon || "Akasha Bracket"}>
            {ranking?.calculation || ranking?.weapon || "Standard Calculation"}
          </div>
          <div className="text-[11px] text-zinc-400">
            {ranking?.outOf
              ? `Ranked against ${ranking.outOf.toLocaleString()} total players worldwide`
              : "Direct calculation from Akasha System"}
          </div>
        </div>
      </div>

      {/* ================= 3. STAT COMPARISON: YOU vs TOP 1% GLOBAL ================= */}
      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 p-5">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
            Stats vs Top 1% Global Akasha Average
          </h4>
          <span className="text-xs text-zinc-400 font-mono">KQM / Akasha Benchmark</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          <div className="flex flex-col rounded-xl bg-black/40 border border-white/10 p-3">
            <span className="text-[11px] text-zinc-400">Total Attack</span>
            <span className="text-base font-bold text-white">{character.stats.atk.toLocaleString()}</span>
            <span className="text-[10px] text-zinc-500 mt-1">Top 1% Avg: ~2,100</span>
          </div>
          <div className="flex flex-col rounded-xl bg-black/40 border border-white/10 p-3">
            <span className="text-[11px] text-zinc-400">Crit Rate</span>
            <span className="text-base font-bold text-amber-300">{character.stats.critRate}%</span>
            <span className="text-[10px] text-zinc-500 mt-1">Top 1% Avg: ~78.5%</span>
          </div>
          <div className="flex flex-col rounded-xl bg-black/40 border border-white/10 p-3">
            <span className="text-[11px] text-zinc-400">Crit DMG</span>
            <span className="text-base font-bold text-purple-300">{character.stats.critDmg}%</span>
            <span className="text-[10px] text-zinc-500 mt-1">Top 1% Avg: ~220.0%</span>
          </div>
          <div className="flex flex-col rounded-xl bg-black/40 border border-white/10 p-3">
            <span className="text-[11px] text-zinc-400">Energy Recharge</span>
            <span className="text-base font-bold text-cyan-300">{character.stats.energyRecharge}%</span>
            <span className="text-[10px] text-zinc-500 mt-1">Top 1% Avg: ~130.0%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
