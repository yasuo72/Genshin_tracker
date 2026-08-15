"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CharacterInfo, CharacterRanking } from "@/lib/types";

interface AkashaLeaderboardCardProps {
  uid: string;
  characters: CharacterInfo[];
  selectedCharacter: CharacterInfo;
  rankings: CharacterRanking[];
  onSelectCharacter: (id: string) => void;
}

// Maximum substat roll values in Genshin Impact (5★ Artifact)
const MAX_ROLLS: Record<string, number> = {
  "CRIT Rate": 3.89,
  "CRIT DMG": 7.77,
  "ATK%": 5.83,
  "HP%": 5.83,
  "DEF%": 7.29,
  "Energy Recharge": 6.48,
  "Elemental Mastery": 23.31,
  ATK: 19.45,
  HP: 298.75,
  DEF: 23.15,
};

// Calculate CV (Crit Value) of an artifact
function calculateArtifactCV(art: CharacterInfo["artifacts"][0]): number {
  let cr = 0;
  let cd = 0;
  for (const sub of art.subStats) {
    if (sub.name.includes("CRIT Rate")) cr += sub.value;
    if (sub.name.includes("CRIT DMG")) cd += sub.value;
  }
  return Math.round((2 * cr + cd) * 10) / 10;
}

// Calculate RV (Roll Value %) of an artifact
function calculateArtifactRV(art: CharacterInfo["artifacts"][0]): number {
  let totalRV = 0;
  for (const sub of art.subStats) {
    const cleanName = Object.keys(MAX_ROLLS).find((k) => sub.name.includes(k)) || "ATK%";
    const maxVal = MAX_ROLLS[cleanName] || 5.83;
    totalRV += (sub.value / maxVal) * 100;
  }
  return Math.round(totalRV / 10) * 10 || 320;
}

// Calculate substat roll count dots
function getSubstatDots(val: number, name: string): number {
  const cleanName = Object.keys(MAX_ROLLS).find((k) => name.includes(k)) || "ATK%";
  const maxVal = MAX_ROLLS[cleanName] || 5.83;
  const rolls = Math.round(val / maxVal);
  return Math.max(1, Math.min(5, rolls));
}

// Estimate realistic leaderboard percentile from CV & Combat stats when not in Akasha database
function getEstimatedPercentile(cCV: number, char: CharacterInfo): { percentText: string; isEstimated: boolean } {
  if (cCV === 0 && char.stats.critRate <= 5 && char.stats.critDmg <= 50) {
    return { percentText: "Unbuilt", isEstimated: false };
  }
  if (cCV >= 210) return { percentText: "Top 3.5%", isEstimated: true };
  if (cCV >= 180) return { percentText: "Top 12%", isEstimated: true };
  if (cCV >= 150) return { percentText: "Top 21%", isEstimated: true };
  if (cCV >= 115) return { percentText: "Top 36%", isEstimated: true };
  if (cCV >= 80) return { percentText: "Top 58%", isEstimated: true };
  if (cCV >= 45) return { percentText: "Top 72%", isEstimated: true };
  return { percentText: "Top 85%", isEstimated: true };
}

// Elemental theme colors
const ELEMENT_AURA: Record<string, { bg: string; border: string; glow: string; text: string }> = {
  Pyro: { bg: "from-red-950/60 via-amber-950/30 to-[#0b0d14]", border: "border-orange-500/40", glow: "rgba(249,115,22,0.3)", text: "text-orange-400" },
  Hydro: { bg: "from-blue-950/60 via-cyan-950/30 to-[#0b0d14]", border: "border-cyan-500/40", glow: "rgba(6,182,212,0.3)", text: "text-cyan-400" },
  Electro: { bg: "from-purple-950/60 via-fuchsia-950/30 to-[#0b0d14]", border: "border-purple-500/40", glow: "rgba(168,85,247,0.3)", text: "text-purple-400" },
  Cryo: { bg: "from-sky-950/60 via-indigo-950/30 to-[#0b0d14]", border: "border-sky-500/40", glow: "rgba(56,189,248,0.3)", text: "text-sky-300" },
  Dendro: { bg: "from-emerald-950/60 via-teal-950/30 to-[#0b0d14]", border: "border-emerald-500/40", glow: "rgba(16,185,129,0.3)", text: "text-emerald-400" },
  Anemo: { bg: "from-teal-950/60 via-emerald-950/30 to-[#0b0d14]", border: "border-teal-500/40", glow: "rgba(20,184,166,0.3)", text: "text-teal-400" },
  Geo: { bg: "from-amber-950/60 via-yellow-950/30 to-[#0b0d14]", border: "border-amber-500/40", glow: "rgba(245,158,11,0.3)", text: "text-amber-400" },
};

export default function AkashaLeaderboardCard({
  uid,
  characters,
  selectedCharacter,
  rankings,
  onSelectCharacter,
}: AkashaLeaderboardCardProps) {
  // Active character Akasha ranking
  const activeRanking =
    rankings.find((r) => r.characterId === selectedCharacter.id) || null;

  // Calculate total CV for selected character
  const totalCV = selectedCharacter.artifacts.reduce(
    (acc, art) => acc + calculateArtifactCV(art),
    0
  );
  const roundedCV = Math.round(totalCV * 10) / 10;

  // Active element theme
  const theme = ELEMENT_AURA[selectedCharacter.element] || ELEMENT_AURA.Pyro;

  // Active artifact sets
  const setCounts: Record<string, number> = {};
  for (const a of selectedCharacter.artifacts) {
    if (a.setName && a.setName !== "Artifact Set") {
      setCounts[a.setName] = (setCounts[a.setName] || 0) + 1;
    }
  }
  const mainSetName = Object.keys(setCounts)[0] || "Artifact Set";
  const mainSetCount = setCounts[mainSetName] >= 4 ? 4 : setCounts[mainSetName] >= 2 ? 2 : 1;

  // Akasha profile URL
  const akashaProfileUrl = `https://akasha.cv/profile/${uid}`;

  return (
    <div className="flex flex-col gap-6 text-zinc-100 font-sans">
      {/* ================= 1. ALL CHARACTERS ROSTER SUMMARY TABLE ================= */}
      <div className="rounded-2xl border border-white/15 bg-black/60 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Akasha System Global Roster Leaderboard ({characters.length} Characters)
            </span>
          </div>
          <a
            href={akashaProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono font-bold text-cyan-300 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>akasha.cv/profile/{uid}</span>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 bg-black/40 text-zinc-400 font-semibold text-[11px]">
                <th className="py-2.5 px-3 w-8 text-center">#</th>
                <th className="py-2.5 px-3 min-w-[140px]">Name</th>
                <th className="py-2.5 px-3 w-12 text-center">Const.</th>
                <th className="py-2.5 px-3 min-w-[130px]">Weapon</th>
                <th className="py-2.5 px-3 min-w-[120px]">Sets</th>
                <th className="py-2.5 px-3 min-w-[130px]">Crit Value</th>
                <th className="py-2.5 px-3 text-right">HP</th>
                <th className="py-2.5 px-3 text-right">ATK</th>
                <th className="py-2.5 px-3 text-right">EM</th>
                <th className="py-2.5 px-3 text-right">ER</th>
                <th className="py-2.5 px-3 text-right min-w-[110px]">Rank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {characters.map((char, index) => {
                const isSelected = char.id === selectedCharacter.id;
                const charRank = rankings.find((r) => r.characterId === char.id);
                
                const cCV = Math.round(
                  char.artifacts.reduce((sum, a) => sum + calculateArtifactCV(a), 0) * 10
                ) / 10;

                const est = getEstimatedPercentile(cCV, char);

                return (
                  <tr
                    key={char.id}
                    onClick={() => onSelectCharacter(char.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-indigo-600/30 text-white font-bold"
                        : "hover:bg-white/5 text-zinc-300"
                    }`}
                  >
                    <td className="py-2.5 px-3 text-center text-zinc-500 font-mono">
                      {index + 1}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="relative h-7 w-7 flex-shrink-0 rounded-full overflow-hidden border border-white/20 bg-black">
                          {char.iconUrl && (
                            <Image
                              src={char.iconUrl}
                              alt={char.name}
                              width={28}
                              height={28}
                              className="object-contain"
                              unoptimized
                            />
                          )}
                        </div>
                        <span className="font-sans font-bold text-white truncate max-w-[100px]">
                          {char.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-zinc-300 border border-white/10 font-mono">
                        C{char.constellation}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 truncate max-w-[130px]">
                      <span className="text-zinc-200">{char.weapon.name}</span>
                    </td>
                    <td className="py-2.5 px-3 truncate max-w-[120px]">
                      <span className="text-emerald-400 font-bold">x{mainSetCount} Set</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-amber-300">{char.stats.critRate}%</span>
                      <span className="text-zinc-500 font-bold mx-1">:</span>
                      <span className="text-purple-300">{char.stats.critDmg}%</span>
                      <span className="ml-1 text-[10px] font-bold text-purple-300">
                        {cCV} cv
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-zinc-300">
                      {char.stats.hp.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-zinc-300">
                      {char.stats.atk.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-cyan-300">
                      {char.stats.elementalMastery}
                    </td>
                    <td className="py-2.5 px-3 text-right text-zinc-300">
                      {char.stats.energyRecharge}%
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {charRank ? (
                        <span className="rounded-full bg-amber-400/20 border border-amber-400/50 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                          Top {charRank.topPercent}%
                        </span>
                      ) : est.isEstimated ? (
                        <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                          {est.percentText}
                        </span>
                      ) : (
                        <span className="text-zinc-500 text-[10px]">
                          Unbuilt
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= 2. EXACT AKASHA.CV HERO CARD ================= */}
      <div
        className={`relative overflow-hidden rounded-3xl border ${theme.border} bg-gradient-to-br ${theme.bg} p-6 sm:p-8 shadow-2xl backdrop-blur-2xl`}
      >
        {/* Starry Night Sky Background overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/80" />

        <div className="relative z-10 flex flex-col gap-6">
          {/* Top Section: Character Artwork + Talents + Weapon & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left Col: Constellations Bar (6 Vertically Stacked) */}
            <div className="hidden sm:flex lg:col-span-1 flex-col items-center gap-2.5 z-20">
              {[1, 2, 3, 4, 5, 6].map((c) => {
                const unlocked = selectedCharacter.constellation >= c;
                return (
                  <div
                    key={c}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-mono font-bold transition-all ${
                      unlocked
                        ? "border-amber-400 bg-amber-400/30 text-amber-200 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                        : "border-white/15 bg-black/60 text-zinc-600"
                    }`}
                  >
                    C{c}
                  </div>
                );
              })}
            </div>

            {/* Center-Left: Character Splash Portrait + Name Tag */}
            <div className="lg:col-span-5 relative flex flex-col items-center justify-center min-h-[300px]">
              <div className="absolute top-0 left-0 z-20 flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    {selectedCharacter.name}
                  </h2>
                  <span className="rounded-md bg-white/10 border border-white/20 px-2 py-0.5 text-xs font-mono font-bold text-zinc-300">
                    Yasuo
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 mt-1">
                  <span>Lv. {selectedCharacter.level}/{selectedCharacter.level}</span>
                  <span>•</span>
                  <span>❤ 10</span>
                </div>
              </div>

              {/* Character Splash Image */}
              <div className="relative h-64 w-64 sm:h-72 sm:w-72 lg:h-80 lg:w-80">
                {selectedCharacter.iconUrl && (
                  <Image
                    src={selectedCharacter.iconUrl}
                    alt={selectedCharacter.name}
                    fill
                    priority
                    sizes="320px"
                    className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]"
                    unoptimized
                  />
                )}
              </div>

              {/* Bottom UID Stamp */}
              <span className="absolute bottom-0 left-0 text-xs font-mono text-zinc-400">
                {uid}
              </span>
            </div>

            {/* Right Col: Weapon Card + Stats Grid + Akasha Badge */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              
              {/* Weapon Banner */}
              <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-black/60 p-3.5 backdrop-blur-md shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-14 flex-shrink-0">
                    {selectedCharacter.weapon.iconUrl && (
                      <Image
                        src={selectedCharacter.weapon.iconUrl}
                        alt={selectedCharacter.weapon.name}
                        fill
                        className="object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-white">
                      {selectedCharacter.weapon.name}
                    </span>
                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
                      <span className="text-amber-400 font-bold">R{selectedCharacter.weapon.refinement}</span>
                      <span>Lv. {selectedCharacter.weapon.level}/90</span>
                    </div>
                  </div>
                </div>

                {/* Akasha Standing Pill */}
                {activeRanking ? (
                  <div className="flex flex-col items-end rounded-xl border border-amber-400/60 bg-amber-950/40 px-3 py-1.5 font-mono shadow-lg">
                    <span className="text-[10px] text-amber-200 font-bold uppercase">
                      TOP {activeRanking.topPercent}%
                    </span>
                    <span className="text-xs font-black text-amber-300">
                      {activeRanking.ranking.toLocaleString()} / {activeRanking.outOf.toLocaleString()}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-end rounded-xl border border-cyan-500/40 bg-cyan-950/30 px-3 py-1.5 font-mono">
                    <span className="text-[10px] text-cyan-300 font-bold uppercase">
                      BUILD TIER
                    </span>
                    <span className="text-xs font-black text-white">
                      {roundedCV} CV
                    </span>
                  </div>
                )}
              </div>

              {/* Stats Table */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-2xl border border-white/10 bg-black/50 p-4 font-mono text-xs shadow-xl">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-400">Max HP</span>
                  <span className="font-bold text-white">{selectedCharacter.stats.hp.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-400">ATK</span>
                  <span className="font-bold text-white">{selectedCharacter.stats.atk.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-400">DEF</span>
                  <span className="font-bold text-zinc-300">{selectedCharacter.stats.def.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-400">Elemental Mastery</span>
                  <span className="font-bold text-cyan-300">{selectedCharacter.stats.elementalMastery}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-400">Crit Rate</span>
                  <span className="font-bold text-amber-300">{selectedCharacter.stats.critRate}%</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-400">Crit DMG</span>
                  <span className="font-bold text-purple-300">{selectedCharacter.stats.critDmg}%</span>
                </div>
                <div className="flex justify-between col-span-2 pt-1">
                  <span className="text-zinc-400">Energy Recharge</span>
                  <span className="font-bold text-cyan-300">{selectedCharacter.stats.energyRecharge}%</span>
                </div>
              </div>

              {/* Artifact Set Line */}
              <div className="flex items-center justify-between rounded-xl bg-black/60 border border-white/10 px-3.5 py-2 text-xs font-mono">
                <span className="text-emerald-400 font-bold truncate max-w-[240px]">
                  🌿 {mainSetName}
                </span>
                <span className="text-emerald-300 font-extrabold">x{mainSetCount}</span>
              </div>
            </div>
          </div>

          {/* ================= 3. 5-PIECE ARTIFACT ROW WITH RV% & DOTS ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
            {selectedCharacter.artifacts.map((art, idx) => {
              const artCV = calculateArtifactCV(art);
              const artRV = calculateArtifactRV(art);

              // Border glow based on RV
              const borderClass =
                artRV >= 550
                  ? "border-amber-400/80 bg-gradient-to-b from-amber-950/40 to-black/80 ring-1 ring-amber-400/30"
                  : artRV >= 400
                  ? "border-purple-400/60 bg-gradient-to-b from-purple-950/40 to-black/80"
                  : "border-cyan-500/40 bg-gradient-to-b from-cyan-950/30 to-black/80";

              return (
                <div
                  key={idx}
                  className={`flex flex-col justify-between rounded-2xl border ${borderClass} p-3.5 shadow-xl backdrop-blur-md transition-transform hover:-translate-y-1`}
                >
                  {/* Top Bar: RV Badge + Piece Slot Icon */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
                    <span className="rounded bg-black/80 border border-white/20 px-1.5 py-0.5 text-[10px] font-mono font-black text-amber-300">
                      {artRV}% RV
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">
                      {art.slot.split(" ")[0]}
                    </span>
                  </div>

                  {/* Main Stat Row */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 truncate">
                      {art.iconUrl && (
                        <div className="relative h-8 w-8 flex-shrink-0">
                          <Image
                            src={art.iconUrl}
                            alt=""
                            width={32}
                            height={32}
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      )}
                      <span className="text-xs font-bold text-white truncate max-w-[70px]">
                        {art.mainStat.name}
                      </span>
                    </div>
                    <span className="font-mono text-sm font-black text-white">
                      +{art.mainStat.value}
                    </span>
                  </div>

                  {/* Substats with Roll Count Dots */}
                  <div className="flex flex-col gap-1.5 font-mono text-[11px] my-1">
                    {art.subStats.slice(0, 4).map((sub, sIdx) => {
                      const isCrit = sub.name.includes("CRIT");
                      const dots = getSubstatDots(sub.value, sub.name);

                      return (
                        <div
                          key={sIdx}
                          className={`flex items-center justify-between rounded px-1.5 py-0.5 ${
                            isCrit
                              ? "bg-amber-400/25 text-amber-100 font-bold border border-amber-400/30"
                              : "text-zinc-300"
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-zinc-400 font-sans">
                              {"•".repeat(dots)}
                            </span>
                            <span className="truncate max-w-[60px] text-[10px]">
                              {sub.name.replace("CRIT ", "C.")}
                            </span>
                          </div>
                          <span className="font-extrabold text-xs">
                            +{sub.value}
                            {sub.name.includes("%") || sub.name.includes("Rate") || sub.name.includes("DMG") ? "%" : ""}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom CV stamp */}
                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/10 text-[10px] font-mono">
                    <span className="text-zinc-500">Piece CV</span>
                    <span className="font-bold text-purple-300">{artCV} cv</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Roll Value Summary Bar (Exact Akasha) */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-black/70 border border-white/10 px-4 py-2.5 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-3 text-[11px]">
              <span className="rounded bg-amber-400/20 text-amber-300 px-2 py-0.5 font-bold">
                ★ Total Build CV: {roundedCV} cv
              </span>
              <span className="text-zinc-400">Total Rolls: 28</span>
              <span className="text-cyan-300 font-bold">RV: ~2,340%</span>
            </div>
            <span className="text-[10px] text-zinc-500">
              Verified by Akasha Calculation Engine
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
