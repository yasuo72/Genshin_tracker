"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CharacterInfo, CharacterRanking } from "@/lib/types";

interface CharacterCardProps {
  uid: string;
  character: CharacterInfo;
  ranking?: CharacterRanking | null;
}

// Elemental Visual Configurations
const ELEMENT_CONFIG: Record<
  string,
  {
    border: string;
    cardGlow: string;
    textColor: string;
    badgeBg: string;
  }
> = {
  Pyro: {
    border: "border-orange-500/40 group-hover:border-orange-400",
    cardGlow: "group-hover:shadow-[0_0_30px_rgba(239,122,53,0.35)]",
    textColor: "text-orange-400",
    badgeBg: "bg-orange-500/25 text-orange-200 border-orange-400/40",
  },
  Hydro: {
    border: "border-sky-500/40 group-hover:border-sky-400",
    cardGlow: "group-hover:shadow-[0_0_30px_rgba(76,194,241,0.35)]",
    textColor: "text-sky-400",
    badgeBg: "bg-sky-500/25 text-sky-200 border-sky-400/40",
  },
  Anemo: {
    border: "border-teal-500/40 group-hover:border-teal-400",
    cardGlow: "group-hover:shadow-[0_0_30px_rgba(116,194,168,0.35)]",
    textColor: "text-teal-400",
    badgeBg: "bg-teal-500/25 text-teal-200 border-teal-400/40",
  },
  Electro: {
    border: "border-purple-500/40 group-hover:border-purple-400",
    cardGlow: "group-hover:shadow-[0_0_30px_rgba(180,127,225,0.35)]",
    textColor: "text-purple-400",
    badgeBg: "bg-purple-500/25 text-purple-200 border-purple-400/40",
  },
  Dendro: {
    border: "border-lime-500/40 group-hover:border-lime-400",
    cardGlow: "group-hover:shadow-[0_0_30px_rgba(165,200,59,0.35)]",
    textColor: "text-lime-400",
    badgeBg: "bg-lime-500/25 text-lime-200 border-lime-400/40",
  },
  Cryo: {
    border: "border-cyan-400/40 group-hover:border-cyan-300",
    cardGlow: "group-hover:shadow-[0_0_30px_rgba(159,214,227,0.35)]",
    textColor: "text-cyan-300",
    badgeBg: "bg-cyan-500/25 text-cyan-200 border-cyan-400/40",
  },
  Geo: {
    border: "border-amber-400/40 group-hover:border-amber-300",
    cardGlow: "group-hover:shadow-[0_0_30px_rgba(245,183,49,0.35)]",
    textColor: "text-amber-400",
    badgeBg: "bg-amber-500/25 text-amber-200 border-amber-400/40",
  },
};

export default function CharacterCard({
  uid,
  character,
  ranking,
}: CharacterCardProps) {
  const [imgError, setImgError] = useState(false);
  const [splashError, setSplashError] = useState(false);
  const [weaponImgError, setWeaponImgError] = useState(false);

  const config =
    ELEMENT_CONFIG[character.element] ?? ELEMENT_CONFIG["Pyro"];

  // Percentile ribbon styling
  const getRankingBadge = () => {
    if (!ranking) return null;
    let badgeStyle = "bg-blue-500/30 text-blue-200 border-blue-400/50";
    if (ranking.topPercent <= 5) {
      badgeStyle = "bg-amber-500/30 text-amber-200 border-amber-400/60 shadow-amber-500/20 shadow-sm";
    } else if (ranking.topPercent <= 20) {
      badgeStyle = "bg-purple-500/30 text-purple-200 border-purple-400/50";
    }

    return (
      <div
        className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold border shadow-sm ${badgeStyle}`}
      >
        <span>Top {ranking.topPercent}%</span>
      </div>
    );
  };

  return (
    <Link
      href={`/u/${uid}/${character.id}`}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border ${config.border} ${config.cardGlow} bg-[#0e111a] p-4 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer shadow-xl`}
    >
      {/* ================= SPLASH ART BACKGROUND IN GRID ================= */}
      {character.splashUrl && !splashError ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
          <div className="relative h-full w-full opacity-40 group-hover:opacity-75 group-hover:scale-110 transition-all duration-500 ease-out">
            <Image
              src={character.splashUrl}
              alt={`${character.name} Artwork`}
              fill
              className="object-cover object-top filter saturate-125 brightness-110"
              onError={() => setSplashError(true)}
              unoptimized
            />
          </div>
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-black/80 z-0" />
      )}

      {/* ================= CARD CONTENT ================= */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Top Meta Header */}
        <div>
          <div className="flex items-center justify-between gap-1.5 mb-2">
            {/* Element Pill & Ranking Badge */}
            <div className="flex items-center gap-1.5">
              <span className="rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase border border-white/20 text-zinc-200 shadow-sm">
                {character.element}
              </span>
              {getRankingBadge()}
            </div>

            {/* Constellation & Level */}
            <div className="flex items-center gap-1 font-mono text-[10px]">
              <span className="rounded-md bg-amber-400/30 px-1.5 py-0.5 font-bold text-amber-200 border border-amber-400/40 shadow-sm">
                C{character.constellation}
              </span>
              <span className="rounded-md bg-black/60 px-1.5 py-0.5 font-bold text-zinc-200 border border-white/20 shadow-sm">
                Lv.{character.level}
              </span>
            </div>
          </div>

          {/* Character Portrait with Element Aura */}
          <div className="relative my-2 flex items-center justify-center">
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 transition-transform duration-300 group-hover:scale-105">
              {character.iconUrl && !imgError ? (
                <Image
                  src={character.iconUrl}
                  alt={character.name}
                  fill
                  sizes="120px"
                  className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]"
                  onError={() => setImgError(true)}
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-black/60 text-2xl font-bold text-white border border-white/20 shadow-inner">
                  {character.name[0]}
                </div>
              )}
            </div>
          </div>

          {/* Character Name */}
          <div className="text-center mb-3">
            <h3 className="text-base font-extrabold tracking-tight text-white group-hover:text-amber-300 transition-colors truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
              {character.name}
            </h3>
          </div>

          {/* Weapon Row */}
          <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-black/50 p-2 shadow-md mb-3">
            {character.weapon.iconUrl && !weaponImgError ? (
              <div className="relative h-8 w-8 flex-shrink-0">
                <Image
                  src={character.weapon.iconUrl}
                  alt={character.weapon.name}
                  fill
                  sizes="32px"
                  className="object-contain drop-shadow-md"
                  onError={() => setWeaponImgError(true)}
                  unoptimized
                />
              </div>
            ) : (
              <div className="h-8 w-8 rounded bg-black/40 flex items-center justify-center text-[9px] font-bold text-zinc-400">
                WEP
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="truncate text-[11px] font-bold text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]" title={character.weapon.name}>
                {character.weapon.name}
              </span>
              <div className="flex items-center gap-1.5 text-[9px] text-zinc-200 font-mono">
                <span className="text-amber-300 font-bold">
                  R{character.weapon.refinement}
                </span>
                <span>•</span>
                <span>Lv.{character.weapon.level}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stat Highlights (CRIT Rate & CRIT DMG) */}
        <div className="grid grid-cols-2 gap-1.5 border-t border-white/20 pt-2.5 font-mono text-[10px]">
          <div className="flex flex-col items-center rounded-lg bg-black/60 p-1.5 border border-white/15 shadow-sm">
            <span className="text-[9px] text-zinc-300 font-semibold tracking-wider uppercase">
              CRIT Rate
            </span>
            <span className="font-extrabold text-amber-200 text-xs drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              {character.stats.critRate}%
            </span>
          </div>
          <div className="flex flex-col items-center rounded-lg bg-black/60 p-1.5 border border-white/15 shadow-sm">
            <span className="text-[9px] text-zinc-300 font-semibold tracking-wider uppercase">
              CRIT DMG
            </span>
            <span className="font-extrabold text-amber-200 text-xs drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              {character.stats.critDmg}%
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
