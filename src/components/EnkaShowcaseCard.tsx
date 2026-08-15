"use client";

import { useState } from "react";
import Image from "next/image";
import { CharacterInfo, CharacterRanking } from "@/lib/types";

interface EnkaShowcaseCardProps {
  uid: string;
  character: CharacterInfo;
  ranking?: CharacterRanking | null;
}

// Elemental Themes with professional styling tokens
const ELEMENT_THEMES: Record<
  string,
  {
    cardBorder: string;
    cardGlow: string;
    accentColor: string;
    textColor: string;
    badgeBorder: string;
    badgeBg: string;
  }
> = {
  Pyro: {
    cardBorder: "border-orange-500/70",
    cardGlow: "shadow-[0_0_80px_rgba(239,122,53,0.4)]",
    accentColor: "text-orange-400",
    textColor: "text-orange-300",
    badgeBorder: "border-orange-500/40",
    badgeBg: "bg-orange-500/20 text-orange-200",
  },
  Hydro: {
    cardBorder: "border-sky-500/70",
    cardGlow: "shadow-[0_0_80px_rgba(76,194,241,0.4)]",
    accentColor: "text-sky-400",
    textColor: "text-sky-300",
    badgeBorder: "border-sky-500/40",
    badgeBg: "bg-sky-500/20 text-sky-200",
  },
  Anemo: {
    cardBorder: "border-teal-400/70",
    cardGlow: "shadow-[0_0_80px_rgba(116,194,168,0.4)]",
    accentColor: "text-teal-400",
    textColor: "text-teal-300",
    badgeBorder: "border-teal-400/40",
    badgeBg: "bg-teal-500/20 text-teal-200",
  },
  Electro: {
    cardBorder: "border-purple-500/70",
    cardGlow: "shadow-[0_0_80px_rgba(180,127,225,0.4)]",
    accentColor: "text-purple-400",
    textColor: "text-purple-300",
    badgeBorder: "border-purple-500/40",
    badgeBg: "bg-purple-500/20 text-purple-200",
  },
  Dendro: {
    cardBorder: "border-lime-500/70",
    cardGlow: "shadow-[0_0_80px_rgba(165,200,59,0.4)]",
    accentColor: "text-lime-400",
    textColor: "text-lime-300",
    badgeBorder: "border-lime-500/40",
    badgeBg: "bg-lime-500/20 text-lime-200",
  },
  Cryo: {
    cardBorder: "border-cyan-400/70",
    cardGlow: "shadow-[0_0_80px_rgba(159,214,227,0.4)]",
    accentColor: "text-cyan-300",
    textColor: "text-cyan-200",
    badgeBorder: "border-cyan-400/40",
    badgeBg: "bg-cyan-500/20 text-cyan-200",
  },
  Geo: {
    cardBorder: "border-amber-400/70",
    cardGlow: "shadow-[0_0_80px_rgba(245,183,49,0.4)]",
    accentColor: "text-amber-400",
    textColor: "text-amber-300",
    badgeBorder: "border-amber-400/40",
    badgeBg: "bg-amber-500/20 text-amber-200",
  },
};

// Professional Vector Icons (Zero Emojis)
function HeartIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

function SwordIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function ShieldIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

function SparklesIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function TargetIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

function LightningIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function RefreshIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

function TrophyIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14M9 3v4a3 3 0 006 0V3m-9 4a5 5 0 004.5 4.975V17h-3a1 1 0 00-1 1v2h10v-2a1 1 0 00-1-1h-3v-5.025A5 5 0 0018 7" />
    </svg>
  );
}

function ArtifactSlotBadge({ slot }: { slot: string }) {
  const shortMap: Record<string, string> = {
    "Flower of Life": "FLOWER",
    "Plume of Death": "PLUME",
    "Sands of Eon": "SANDS",
    "Goblet of Eonothem": "GOBLET",
    "Circlet of Logos": "CIRCLET",
  };
  return (
    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider text-zinc-300 border border-white/10">
      {shortMap[slot] || slot}
    </span>
  );
}

export default function EnkaShowcaseCard({
  uid,
  character,
  ranking,
}: EnkaShowcaseCardProps) {
  const [portraitImgError, setPortraitImgError] = useState(false);
  const [splashBgError, setSplashBgError] = useState(false);
  const [weaponImgError, setWeaponImgError] = useState(false);

  const theme =
    ELEMENT_THEMES[character.element] ?? ELEMENT_THEMES["Pyro"];

  // Artifact Sets resolution
  const setCounts: Record<string, number> = {};
  for (const a of character.artifacts) {
    if (a.setName && a.setName !== "Artifact Set") {
      setCounts[a.setName] = (setCounts[a.setName] || 0) + 1;
    }
  }
  const activeSets = Object.entries(setCounts)
    .filter(([_, count]) => count >= 2)
    .map(([setName, count]) => ({
      name: setName,
      count: count >= 4 ? 4 : 2,
    }));

  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border ${theme.cardBorder} p-5 sm:p-7 shadow-2xl ${theme.cardGlow} transition-all duration-500`}
    >
      {/* ================= BACKGROUND SPLASH POSTER (STEADY HIGH BRIGHTNESS) ================= */}
      {character.splashUrl && !splashBgError ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="relative h-full w-full">
            <Image
              src={character.splashUrl}
              alt={`${character.name} Artwork`}
              fill
              className="object-cover object-center scale-105 filter saturate-125 brightness-115"
              onError={() => setSplashBgError(true)}
              priority
              unoptimized
            />
          </div>
          {/* Soft static vignette to preserve edge definition */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/45" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[#0e111a]" />
      )}

      {/* ================= MAIN 3-COLUMN SHOWCASE CARD ================= */}
      <div className="relative z-10 grid grid-cols-1 gap-5 lg:grid-cols-12 xl:gap-6 items-stretch">
        
        {/* ================= LEFT COLUMN: Character Profile Portrait & Constellations ================= */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-white/20 bg-black/45 p-5 relative min-h-[500px] overflow-hidden shadow-2xl hover:bg-black/55 transition-all">
          
          {/* Header Info: Name, Level, Element */}
          <div className="flex items-start justify-between z-20">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-black uppercase tracking-wider border ${theme.badgeBorder} ${theme.badgeBg}`}>
                  {character.element}
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)]">
                  {character.name}
                </h2>
              </div>
              <div className="mt-2 flex items-center gap-2.5 text-xs sm:text-sm font-mono">
                <span className="font-bold text-white bg-black/60 px-2.5 py-1 rounded-lg border border-white/25 shadow-md">
                  Lv. {character.level} / 90
                </span>
                <span className="text-amber-300 font-bold flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-lg border border-amber-400/40">
                  <HeartIcon className="w-3.5 h-3.5 fill-amber-300 text-amber-300" /> 10
                </span>
              </div>
            </div>

            {/* Top Percentile Ribbon */}
            {ranking && (
              <div className="flex items-center gap-1.5 rounded-xl border border-amber-400/80 bg-black/70 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-bold text-amber-300 shadow-xl">
                <TrophyIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span>Top {ranking.topPercent}%</span>
              </div>
            )}
          </div>

          {/* Constellation Indicators (C1 - C6) Responsive: Top bar on mobile, left column on desktop */}
          <div className="flex flex-row justify-center sm:flex-col sm:absolute sm:left-4 sm:top-28 z-20 gap-2 sm:gap-3 my-3 sm:my-0">
            {[1, 2, 3, 4, 5, 6].map((cNum) => {
              const isUnlocked = character.constellation >= cNum;
              return (
                <div
                  key={cNum}
                  className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border text-[11px] sm:text-xs font-bold font-mono transition-all ${
                    isUnlocked
                      ? "border-amber-400 bg-amber-400/40 text-amber-100 ring-2 ring-amber-400/30 shadow-[0_0_12px_rgba(251,191,36,0.6)]"
                      : "border-white/20 bg-black/50 text-zinc-500"
                  }`}
                  title={`Constellation ${cNum}: ${isUnlocked ? "Unlocked" : "Locked"}`}
                >
                  C{cNum}
                </div>
              );
            })}
          </div>

          {/* Center Character Profile Portrait */}
          <div className="relative my-auto flex h-56 sm:h-64 lg:h-76 w-full items-center justify-center py-2 z-10">
            {character.iconUrl && !portraitImgError ? (
              <div className="relative h-48 w-48 sm:h-60 sm:w-60 lg:h-68 lg:w-68 transition-transform duration-300 hover:scale-105">
                <Image
                  src={character.iconUrl}
                  alt={character.name}
                  fill
                  sizes="280px"
                  className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)]"
                  onError={() => setPortraitImgError(true)}
                  priority
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex h-48 w-48 items-center justify-center rounded-full bg-black/50 text-7xl font-black text-white border border-white/30 shadow-2xl">
                {character.name[0]}
              </div>
            )}
          </div>

          {/* Bottom Card Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-white/20 text-xs font-mono text-zinc-200 z-20">
            <span className="drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">UID: <strong className="text-white font-bold">{uid}</strong></span>
            <span className={`font-black uppercase tracking-wider px-3 py-1 rounded-md bg-black/60 border border-white/30 ${theme.textColor} drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]`}>
              {character.element}
            </span>
          </div>
        </div>

        {/* ================= CENTER COLUMN: Weapon Banner & Combat Stats ================= */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-3.5">
          {/* Weapon Card Banner */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-white/20 bg-black/45 p-4 shadow-xl hover:bg-black/55 transition-all">
            {character.weapon.iconUrl && !weaponImgError ? (
              <div className="relative h-16 w-16 flex-shrink-0">
                <Image
                  src={character.weapon.iconUrl}
                  alt={character.weapon.name}
                  fill
                  sizes="70px"
                  className="object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]"
                  onError={() => setWeaponImgError(true)}
                  priority
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-black/50 text-xs font-bold text-zinc-400">
                WEAPON
              </div>
            )}
            <div className="flex flex-col min-w-0 flex-1">
              <span className="truncate text-base font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]" title={character.weapon.name}>
                {character.weapon.name}
              </span>
              <div className="flex items-center gap-1 text-xs text-amber-400 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                <span>★★★★★</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-mono text-zinc-100 mt-1">
                <span className="rounded bg-amber-400/50 px-2 py-0.5 font-extrabold text-amber-100 border border-amber-300/60 shadow-sm">
                  R{character.weapon.refinement}
                </span>
                <span className="font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">Lv. {character.weapon.level} / 90</span>
              </div>
            </div>
          </div>

          {/* Combat Stats List */}
          <div className="flex flex-col gap-2 rounded-2xl border border-white/20 bg-black/45 p-4 sm:p-5 shadow-xl hover:bg-black/55 transition-all">
            <div className="text-xs font-extrabold uppercase tracking-wider text-zinc-200 border-b border-white/20 pb-2 flex justify-between drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">
              <span>Combat Attributes</span>
              <span className="text-zinc-400">Showcase Data</span>
            </div>

            {/* Max HP */}
            <div className="flex items-center justify-between text-sm py-1 border-b border-white/15">
              <span className="flex items-center gap-2 text-zinc-100 drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)] font-semibold">
                <HeartIcon className="w-4 h-4 text-red-400" />
                <span>Max HP</span>
              </span>
              <span className="font-mono font-black text-white text-base drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                {character.stats.hp.toLocaleString()}
              </span>
            </div>

            {/* ATK */}
            <div className="flex items-center justify-between text-sm py-1 border-b border-white/15">
              <span className="flex items-center gap-2 text-zinc-100 drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)] font-semibold">
                <SwordIcon className="w-4 h-4 text-orange-400" />
                <span>Attack (ATK)</span>
              </span>
              <span className="font-mono font-black text-white text-base drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                {character.stats.atk.toLocaleString()}
              </span>
            </div>

            {/* DEF */}
            <div className="flex items-center justify-between text-sm py-1 border-b border-white/15">
              <span className="flex items-center gap-2 text-zinc-100 drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)] font-semibold">
                <ShieldIcon className="w-4 h-4 text-amber-400" />
                <span>Defense (DEF)</span>
              </span>
              <span className="font-mono font-black text-white text-base drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                {character.stats.def.toLocaleString()}
              </span>
            </div>

            {/* Elemental Mastery */}
            <div className="flex items-center justify-between text-sm py-1 border-b border-white/15">
              <span className="flex items-center gap-2 text-zinc-100 drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)] font-semibold">
                <SparklesIcon className="w-4 h-4 text-emerald-400" />
                <span>Elemental Mastery</span>
              </span>
              <span className="font-mono font-black text-emerald-300 text-base drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                {character.stats.elementalMastery}
              </span>
            </div>

            {/* CRIT Rate */}
            <div className="flex items-center justify-between text-sm py-2 border border-amber-300/60 bg-amber-400/30 px-3 rounded-xl shadow-md">
              <span className="flex items-center gap-2 text-amber-200 font-extrabold text-sm drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">
                <TargetIcon className="w-4 h-4 text-amber-300" />
                <span>CRIT Rate</span>
              </span>
              <span className="font-mono font-black text-amber-100 text-lg drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                {character.stats.critRate}%
              </span>
            </div>

            {/* CRIT DMG */}
            <div className="flex items-center justify-between text-sm py-2 border border-amber-300/60 bg-amber-400/30 px-3 rounded-xl shadow-md">
              <span className="flex items-center gap-2 text-amber-200 font-extrabold text-sm drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">
                <LightningIcon className="w-4 h-4 text-amber-300" />
                <span>CRIT DMG</span>
              </span>
              <span className="font-mono font-black text-amber-100 text-lg drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                {character.stats.critDmg}%
              </span>
            </div>

            {/* Energy Recharge */}
            <div className="flex items-center justify-between text-sm py-1">
              <span className="flex items-center gap-2 text-zinc-100 drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)] font-semibold">
                <RefreshIcon className="w-4 h-4 text-cyan-400" />
                <span>Energy Recharge</span>
              </span>
              <span className="font-mono font-black text-cyan-300 text-base drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                {character.stats.energyRecharge}%
              </span>
            </div>
          </div>

          {/* Active Artifact Set Bonus */}
          {activeSets.length > 0 && (
            <div className="flex flex-col gap-1.5 rounded-2xl border border-white/20 bg-black/45 p-3.5 shadow-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">
                Set Bonuses
              </span>
              <div className="flex flex-wrap gap-2">
                {activeSets.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-xl border border-emerald-400/70 bg-emerald-500/40 px-3 py-1.5 text-xs font-bold text-emerald-100 shadow-md"
                  >
                    <span className="truncate max-w-[200px] drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">{s.name}</span>
                    <span className="rounded-md bg-emerald-400/60 px-1.5 font-mono font-black text-xs text-white">
                      {s.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================= RIGHT COLUMN: 5 Stacked Artifacts ================= */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-zinc-200 px-1 flex justify-between drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">
            <span>Artifacts ({character.artifacts.length}/5)</span>
            <span className="text-amber-300 font-mono font-black drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">+20 MAX</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
            {character.artifacts.map((art, idx) => (
              <div
                key={idx}
                className="flex flex-col rounded-2xl border border-white/20 bg-black/45 p-3 hover:bg-black/55 hover:border-white/40 transition-all shadow-xl"
              >
                {/* Top Row: Main Stat + Artifact Piece Image + Title */}
                <div className="flex items-center justify-between border-b border-white/20 pb-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    {art.iconUrl ? (
                      <div className="relative h-11 w-11 flex-shrink-0">
                        <Image
                          src={art.iconUrl}
                          alt={art.setName}
                          fill
                          sizes="44px"
                          className="object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <ArtifactSlotBadge slot={art.slot} />
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-white truncate max-w-[110px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]" title={art.mainStat.name}>
                        {art.mainStat.name}
                      </span>
                      <span className="text-[10px] text-zinc-300 font-medium truncate max-w-[110px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]" title={art.setName}>
                        {art.setName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-base sm:text-lg font-black text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                      {art.mainStat.value}
                      {art.mainStat.name.includes("%") ||
                      art.mainStat.name.includes("Rate") ||
                      art.mainStat.name.includes("DMG") ||
                      art.mainStat.name.includes("Recharge") ||
                      art.mainStat.name.includes("Bonus")
                        ? "%"
                        : ""}
                    </span>
                    <span className="rounded bg-amber-400/50 px-1.5 py-0.5 text-[9px] font-mono font-extrabold text-amber-100 border border-amber-300/70 shadow-sm">
                      +20
                    </span>
                  </div>
                </div>

                {/* Substats (2x2 Grid with Vector Highlighting) */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 font-mono text-xs">
                  {art.subStats.slice(0, 4).map((sub, sIdx) => {
                    const isCrit =
                      sub.name.includes("CRIT Rate") || sub.name.includes("CRIT DMG");

                    return (
                      <div
                        key={sIdx}
                        className={`flex items-center justify-between rounded-lg px-2 py-1 ${
                          isCrit
                            ? "bg-amber-400/40 text-amber-100 font-bold border border-amber-300/60 shadow-sm"
                            : "bg-black/50 text-zinc-100 border border-white/20"
                        }`}
                      >
                        <span className="truncate max-w-[60px] text-[10px] text-zinc-200 drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] font-semibold">
                          {sub.name.replace("CRIT ", "C.").replace("Energy Recharge", "ER")}
                        </span>
                        <span className="font-extrabold drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] text-xs">
                          +{sub.value}
                          {sub.name.includes("%") ||
                          sub.name.includes("Rate") ||
                          sub.name.includes("DMG") ||
                          sub.name.includes("Recharge")
                            ? "%"
                            : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
