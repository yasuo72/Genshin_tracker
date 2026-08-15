"use client";

import { useState } from "react";
import Image from "next/image";
import { CharacterInfo } from "@/lib/types";
import { getCharacterGuide } from "@/lib/guides";

interface CharacterGuideTabProps {
  character: CharacterInfo;
}

export default function CharacterGuideTab({ character }: CharacterGuideTabProps) {
  const guide = getCharacterGuide(character.name);
  const [weaponFilter, setWeaponFilter] = useState<"ALL" | "5STAR" | "F2P">("ALL");

  // Filter weapons safely
  const filteredWeapons = (guide.weapons || []).filter((w) => {
    if (weaponFilter === "5STAR") return w.rarity === 5;
    if (weaponFilter === "F2P") return w.tag === "F2P" || w.source === "Craftable" || w.source === "Fishing" || w.rarity === 3;
    return true;
  });

  return (
    <div className="flex flex-col gap-8 rounded-3xl border border-white/15 bg-black/45 p-5 sm:p-7 lg:p-8 shadow-2xl backdrop-blur-md text-zinc-100 transition-all">
      
      {/* ================= 1. HEADER & PLAYSTYLE ================= */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="rounded-lg bg-indigo-500/25 px-3 py-1 text-xs font-bold text-indigo-200 border border-indigo-500/40">
                THEORYCRAFTING BUILD GUIDE
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {character.name}
              </h3>
              <span className="text-sm font-semibold text-zinc-400">
                • {guide.title}
              </span>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-zinc-300 max-w-3xl leading-relaxed">
              {guide.overview}
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-amber-400/10 border border-amber-400/30 px-4 py-2 text-xs font-bold text-amber-300 shadow-sm">
            <span>★ Recommended Lv. {guide.recommendedLevel}</span>
          </div>
        </div>

        {/* Playstyle Overview Box */}
        {guide.playstyle && (
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/[0.06] p-4 text-xs sm:text-sm text-cyan-200 leading-relaxed">
            <span className="font-bold text-white uppercase tracking-wider text-xs block mb-1">
              Combat Strategy & Rotation Note:
            </span>
            {guide.playstyle}
          </div>
        )}

        {/* Recommended Stat Benchmarks */}
        {guide.statThresholds && guide.statThresholds.length > 0 && (
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
              Recommended Stat Benchmarks
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {guide.statThresholds.map((st, idx) => (
                <div
                  key={`stat-${st.stat}-${idx}`}
                  className="flex flex-col justify-between rounded-xl border border-white/10 bg-black/40 p-3 shadow-inner"
                >
                  <div>
                    <span className="text-[10px] uppercase font-mono text-zinc-400 block">
                      {st.stat}
                    </span>
                    <span className="font-mono text-sm sm:text-base font-black text-amber-300">
                      {st.target}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300 mt-1 leading-snug">
                    {st.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ================= 2. WEAPON TIER LIST & RANKINGS ================= */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-cyan-400">
              Weapon Rankings & Best in Slot ({guide.weapons?.length || 0} Options)
            </h4>
            <span className="text-xs text-zinc-400">Ranked by overall damage output & synergy</span>
          </div>

          {/* Weapon Filters */}
          <div className="flex items-center gap-1.5 bg-black/50 border border-white/10 p-1 rounded-xl">
            <button
              onClick={() => setWeaponFilter("ALL")}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                weaponFilter === "ALL"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              All ({guide.weapons?.length || 0})
            </button>
            <button
              onClick={() => setWeaponFilter("5STAR")}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                weaponFilter === "5STAR"
                  ? "bg-amber-600 text-white shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              5★ Weapons
            </button>
            <button
              onClick={() => setWeaponFilter("F2P")}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                weaponFilter === "F2P"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              F2P / Craftable
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredWeapons.map((w, idx) => {
            const isBis = w.tag === "BiS";
            const isF2p = w.tag === "F2P";

            let tagStyle = "bg-white/10 text-zinc-300 border-white/20";
            if (isBis) tagStyle = "bg-amber-400 text-black border-amber-300 font-black";
            else if (w.tag === "5★ Alt") tagStyle = "bg-purple-500/30 text-purple-200 border-purple-400/40 font-bold";
            else if (isF2p) tagStyle = "bg-emerald-500/30 text-emerald-200 border-emerald-400/40 font-bold";

            return (
              <div
                key={`weapon-${w.name}-${idx}`}
                className={`relative flex flex-col justify-between rounded-2xl border p-4 transition-all shadow-lg ${
                  isBis
                    ? "border-amber-400/60 bg-amber-500/[0.08] hover:border-amber-300"
                    : "border-white/15 bg-white/[0.03] hover:border-white/30"
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Real Weapon Icon */}
                  <div className="relative h-14 w-14 flex-shrink-0 rounded-xl overflow-hidden bg-black/60 border border-white/20 p-1 shadow-inner">
                    <Image
                      src={w.iconUrl}
                      alt={w.name}
                      fill
                      sizes="56px"
                      className="object-contain drop-shadow-md"
                      unoptimized
                    />
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-mono border ${tagStyle}`}>
                        {w.tag}
                      </span>
                      <span className="text-amber-300 text-xs">
                        {"★".repeat(w.rarity)}
                      </span>
                    </div>

                    <span className="truncate text-sm font-bold text-white mt-1" title={w.name}>
                      {w.name}
                    </span>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-300 mt-0.5">
                      <span className="font-mono font-semibold">{w.mainStat}</span>
                      <span>•</span>
                      <span className="text-zinc-400">{w.source}</span>
                    </div>
                  </div>
                </div>

                {w.description && (
                  <p className="text-xs text-zinc-300 mt-2.5 pt-2 border-t border-white/10 leading-relaxed">
                    {w.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= 3. ARTIFACT SETS & MAIN STATS ================= */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-cyan-400">
              Artifact Sets & Optimal Main Stats
            </h4>
            <span className="text-xs text-zinc-400">Best 4-Piece bonuses and 2-Piece hybrid options</span>
          </div>
        </div>

        {/* Set Cards with Real Relic Images */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3 mb-4">
          {(guide.artifacts || []).map((art, idx) => (
            <div
              key={`artifact-${art.name}-${idx}`}
              className={`flex flex-col justify-between rounded-2xl border p-4 shadow-md ${
                art.isRecommended
                  ? "border-indigo-400/60 bg-indigo-500/[0.08]"
                  : "border-white/15 bg-white/[0.03]"
              }`}
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="relative h-12 w-12 flex-shrink-0 rounded-xl overflow-hidden bg-black/60 border border-white/20 p-1 shadow-inner">
                    <Image
                      src={art.iconUrl}
                      alt={art.name}
                      fill
                      sizes="48px"
                      className="object-contain drop-shadow-md"
                      unoptimized
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold text-white truncate max-w-[150px]">{art.name}</span>
                    <span className="text-[10px] font-mono text-zinc-400">{art.pieces}-Piece Set</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {art.bonus}
                </p>
              </div>

              {art.tag && (
                <div className="mt-2.5 pt-2 border-t border-white/10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                    {art.tag}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Main Stats (Sands / Goblet / Circlet) */}
        {guide.mainStats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl border border-white/15 bg-black/40 p-4 mb-3 text-center">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">
                Sands of Eon
              </span>
              <span className="text-sm font-bold text-white mt-1">
                {guide.mainStats.sands.primary}
              </span>
              {guide.mainStats.sands.secondary && (
                <span className="text-[10px] text-zinc-400 mt-0.5">
                  Alt: {guide.mainStats.sands.secondary}
                </span>
              )}
            </div>
            <div className="flex flex-col border-t sm:border-t-0 sm:border-l sm:border-r border-white/10 pt-2.5 sm:pt-0">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">
                Goblet of Eonothem
              </span>
              <span className="text-sm font-bold text-white mt-1">
                {guide.mainStats.goblet.primary}
              </span>
              {guide.mainStats.goblet.secondary && (
                <span className="text-[10px] text-zinc-400 mt-0.5">
                  Alt: {guide.mainStats.goblet.secondary}
                </span>
              )}
            </div>
            <div className="flex flex-col border-t sm:border-t-0 border-white/10 pt-2.5 sm:pt-0">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">
                Circlet of Logos
              </span>
              <span className="text-sm font-bold text-white mt-1">
                {guide.mainStats.circlet.primary}
              </span>
              {guide.mainStats.circlet.secondary && (
                <span className="text-[10px] text-zinc-400 mt-0.5">
                  Alt: {guide.mainStats.circlet.secondary}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Priority Substats Pills */}
        {guide.substatPriority && guide.substatPriority.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold uppercase text-zinc-400 mr-1">
              Priority Substats:
            </span>
            {guide.substatPriority.map((sub, idx) => (
              <span
                key={`substat-${sub}-${idx}`}
                className="rounded-lg bg-black/60 border border-white/20 px-3 py-1 text-xs font-mono font-bold text-white shadow-sm"
              >
                {idx + 1}. {sub}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ================= 4. TALENT PRIORITIES ================= */}
      {guide.talentPriority && (
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h4 className="text-sm font-black uppercase tracking-wider text-cyan-400">
              Talent Leveling Priority & Targets
            </h4>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/[0.03] p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                {/* Normal Attack */}
                <div className="flex flex-col items-center justify-center rounded-xl bg-black/60 border border-white/20 px-4 py-2 min-w-[70px]">
                  <span className="text-[9px] uppercase font-bold text-zinc-400">Normal</span>
                  <span className="text-lg font-black text-white font-mono">{guide.talentPriority.normal}</span>
                </div>
                {/* Skill */}
                <div className="flex flex-col items-center justify-center rounded-xl bg-black/60 border border-white/20 px-4 py-2 min-w-[70px]">
                  <span className="text-[9px] uppercase font-bold text-zinc-400">Skill</span>
                  <span className="text-lg font-black text-white font-mono">{guide.talentPriority.skill}</span>
                </div>
                {/* Burst */}
                <div className="flex flex-col items-center justify-center rounded-xl bg-black/60 border border-white/20 px-4 py-2 min-w-[70px]">
                  <span className="text-[9px] uppercase font-bold text-zinc-400">Burst</span>
                  <span className="text-lg font-black text-white font-mono">{guide.talentPriority.burst}</span>
                </div>
              </div>

              <div className="flex flex-col text-xs sm:text-right">
                <span className="font-semibold text-zinc-400">Priority Sequencing:</span>
                <span className="font-bold text-white text-sm sm:text-base mt-0.5 text-cyan-300 font-mono">
                  {guide.talentPriority.order}
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              {guide.talentPriority.explanation}
            </p>
          </div>
        </div>
      )}

      {/* ================= 5. KEY CONSTELLATION SPIKES ================= */}
      {guide.constellationSpikes && guide.constellationSpikes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h4 className="text-sm font-black uppercase tracking-wider text-cyan-400">
              Key Constellation Spikes & Pull Value
            </h4>
            <span className="text-xs text-zinc-400">Pull recommendations</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {guide.constellationSpikes.map((c, idx) => {
              let tierBg = "bg-amber-500/20 text-amber-300 border-amber-400/40";
              if (c.tier === "Game Changer") tierBg = "bg-rose-500/20 text-rose-300 border-rose-400/40";
              else if (c.tier === "Whale Spike") tierBg = "bg-purple-500/20 text-purple-300 border-purple-400/40";

              return (
                <div
                  key={`constellation-${c.level}-${idx}`}
                  className="flex flex-col justify-between rounded-2xl border border-white/15 bg-black/40 p-4 shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-base font-black text-white">{c.level}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold border ${tierBg}`}>
                        {c.tier}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-zinc-200 mb-1">{c.name}</h5>
                    <p className="text-xs text-zinc-300 leading-relaxed">{c.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= 6. TOP META TEAM COMPOSITIONS ================= */}
      {guide.teams && guide.teams.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-cyan-400">
                Top Meta Team Compositions ({guide.teams.length} Teams)
              </h4>
              <span className="text-xs text-zinc-400">Synergies, reactions, and step-by-step rotations</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {guide.teams.map((team, idx) => (
              <div
                key={`team-${team.name}-${idx}`}
                className="flex flex-col justify-between rounded-2xl border border-white/15 bg-white/[0.03] p-4 sm:p-5 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-base font-bold text-white">{team.name}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] text-zinc-300">
                        {team.reaction}
                      </span>
                      <span className="rounded bg-amber-400/20 px-2 py-0.5 font-mono text-[10px] font-black text-amber-300 border border-amber-400/30">
                        {team.tier} TIER
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-300 mb-3">{team.description}</p>

                  {/* Members with Real Avatar Icons */}
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/10">
                    {team.members.map((m, mIdx) => (
                      <div key={`member-${team.name}-${m.name}-${mIdx}`} className="flex flex-col items-center text-center">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-black/60 border border-white/25 shadow-md">
                          <Image
                            src={m.iconUrl}
                            alt={m.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <span className="mt-1 text-xs font-bold text-zinc-200 truncate max-w-[70px]">
                          {m.name}
                        </span>
                        <span className="text-[9px] text-zinc-400">{m.role}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rotation sequence */}
                {team.rotation && (
                  <div className="mt-3.5 pt-2.5 border-t border-white/10">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">
                      Rotation Sequence:
                    </span>
                    <span className="text-xs font-mono text-cyan-200 font-semibold block">
                      {team.rotation}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= 7. FARMING MATERIALS & SCHEDULE ================= */}
      {guide.farmingMaterials && (
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h4 className="text-sm font-black uppercase tracking-wider text-cyan-400">
              Farming Materials & Weekly Domain Schedule
            </h4>
            <span className="text-xs text-zinc-400">Ascension & Talent materials breakdown</span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {/* Talent Materials */}
            <div className="flex flex-col gap-2 rounded-2xl border border-white/15 bg-black/40 p-4 sm:p-5">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Talent Leveling Materials
              </span>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-white/10">
                <span className="text-zinc-400">Books:</span>
                <span className="font-bold text-white font-mono">
                  {guide.farmingMaterials.talentBooks?.name} ({guide.farmingMaterials.talentBooks?.days})
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-white/10">
                <span className="text-zinc-400">Weekly Boss:</span>
                <span className="font-bold text-amber-300 font-mono">
                  {guide.farmingMaterials.weeklyBoss}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5">
                <span className="text-zinc-400">Monster Drop:</span>
                <span className="font-bold text-white font-mono">
                  {guide.farmingMaterials.commonDrop}
                </span>
              </div>
            </div>

            {/* Character Ascension */}
            <div className="flex flex-col gap-2 rounded-2xl border border-white/15 bg-black/40 p-4 sm:p-5">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Character Ascension Materials
              </span>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-white/10">
                <span className="text-zinc-400">World Boss:</span>
                <span className="font-bold text-amber-300 font-mono">
                  {guide.farmingMaterials.worldBoss}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 border-b border-white/10">
                <span className="text-zinc-400">Local Specialty:</span>
                <span className="font-bold text-emerald-300 font-mono">
                  {guide.farmingMaterials.localSpecialty}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5">
                <span className="text-zinc-400">Common Drop:</span>
                <span className="font-bold text-white font-mono">
                  {guide.farmingMaterials.commonDrop}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
