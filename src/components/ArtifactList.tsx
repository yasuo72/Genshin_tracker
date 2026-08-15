"use client";

import Image from "next/image";
import { ArtifactInfo } from "@/lib/types";

interface ArtifactListProps {
  artifacts: ArtifactInfo[];
}

/**
 * Approximate max possible single-roll values for 5★ artifact substats.
 * Max potential total rolls on a +20 artifact is 6 rolls (1 base + 5 upgrades).
 */
const MAX_SINGLE_ROLL: Record<string, number> = {
  "CRIT Rate": 3.89,
  "CRIT DMG": 7.77,
  "ATK%": 5.83,
  "HP%": 5.83,
  "DEF%": 7.29,
  "Energy Recharge": 6.48,
  "Elemental Mastery": 23.31,
  "ATK": 19.45,
  "HP": 298.75,
  "DEF": 23.15,
};

function getSubstatRollScore(name: string, value: number): number {
  // Normalize name key
  let key = name;
  if (name.includes("CRIT Rate")) key = "CRIT Rate";
  else if (name.includes("CRIT DMG")) key = "CRIT DMG";
  else if (name === "ATK" && value < 60) key = "ATK%";
  else if (name === "HP" && value < 60) key = "HP%";
  else if (name === "DEF" && value < 60) key = "DEF%";

  const maxSingle = MAX_SINGLE_ROLL[key] || 10;
  // Maximum theoretical rolls for a single substat is 6 rolls (e.g. 6 * 3.89 = 23.34% CRIT Rate)
  const maxPossible = maxSingle * 5;
  const ratio = Math.min(Math.max(value / maxPossible, 0.1), 1.0);
  return Math.round(ratio * 100);
}

export default function ArtifactList({ artifacts }: ArtifactListProps) {
  if (!artifacts || artifacts.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-zinc-400">
        No artifacts currently equipped on this character.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>Equipped Artifacts</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
            {artifacts.length} / 5
          </span>
        </h3>
        <span className="text-xs text-zinc-400">
          Substat bars indicate roll efficiency
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {artifacts.map((art, idx) => (
          <div
            key={idx}
            className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md hover:border-white/20 transition-all shadow-lg"
          >
            {/* Slot & Set Name & Real Artifact Image */}
            <div className="flex items-start justify-between gap-2 border-b border-white/5 pb-2.5">
              <div className="flex items-center gap-2">
                {art.iconUrl && (
                  <div className="relative h-10 w-10 flex-shrink-0">
                    <Image
                      src={art.iconUrl}
                      alt={art.setName}
                      fill
                      sizes="40px"
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    {art.slot}
                  </span>
                  <h4 className="text-xs font-bold text-white truncate max-w-[120px]" title={art.setName}>
                    {art.setName}
                  </h4>
                </div>
              </div>
              <span className="text-[10px] font-mono font-semibold text-amber-400/90 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                +20
              </span>
            </div>

            {/* Main Stat */}
            <div className="my-3 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.07] p-2.5">
              <span className="text-[10px] font-medium uppercase tracking-wider text-indigo-300 block">
                {art.mainStat.name}
              </span>
              <span className="font-mono text-base font-extrabold text-white">
                {art.mainStat.value}
                {art.mainStat.name.includes("%") ||
                art.mainStat.name.includes("Rate") ||
                art.mainStat.name.includes("DMG") ||
                art.mainStat.name.includes("Recharge") ||
                art.mainStat.name.includes("Bonus")
                  ? "%"
                  : ""}
              </span>
            </div>

            {/* Sub Stats List */}
            <div className="flex flex-col gap-2 pt-1 flex-1">
              <span className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
                Substats
              </span>

              {art.subStats.map((sub, sIdx) => {
                const score = getSubstatRollScore(sub.name, sub.value);
                const isCrit =
                  sub.name.includes("CRIT Rate") || sub.name.includes("CRIT DMG");

                return (
                  <div key={sIdx} className="flex flex-col gap-1 text-xs">
                    <div className="flex items-center justify-between font-mono">
                      <span
                        className={`truncate ${
                          isCrit ? "text-amber-300 font-semibold" : "text-zinc-300"
                        }`}
                      >
                        {sub.name}
                      </span>
                      <span className="font-bold text-white">
                        +{sub.value}
                        {sub.name.includes("%") ||
                        sub.name.includes("Rate") ||
                        sub.name.includes("DMG") ||
                        sub.name.includes("Recharge")
                          ? "%"
                          : ""}
                      </span>
                    </div>

                    {/* Quality bar */}
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCrit
                            ? "bg-gradient-to-r from-amber-500 to-amber-300"
                            : score > 50
                            ? "bg-gradient-to-r from-indigo-500 to-cyan-400"
                            : "bg-zinc-500"
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
