"use client";

import Image from "next/image";
import { BuildGuideArtifactSet } from "@/lib/types";
import { getArtifactIconUrl } from "@/lib/gamedata";

interface ArtifactSetCardProps {
  artifactSets: BuildGuideArtifactSet[];
}

export default function ArtifactSetCard({ artifactSets }: ArtifactSetCardProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400">
            Recommended Artifact Sets & Stats
          </h4>
          <span className="text-[11px] text-zinc-400">
            Optimal 4-Piece bonuses, 2pc+2pc alternatives, and main stats
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {artifactSets.map((set, idx) => {
          const isMain = set.role === "main";
          const iconUrl = getArtifactIconUrl(set.setName);

          return (
            <div
              key={`artifact-set-${set.setName}-${idx}`}
              className={`flex flex-col justify-between rounded-2xl border p-5 shadow-lg ${
                isMain
                  ? "border-indigo-400/60 bg-indigo-500/[0.08]"
                  : "border-white/15 bg-white/[0.03]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 flex-shrink-0 rounded-xl overflow-hidden bg-black/60 border border-white/20 p-1 shadow-inner">
                      <Image
                        src={iconUrl}
                        alt={set.setName}
                        fill
                        sizes="48px"
                        className="object-contain drop-shadow-md"
                        unoptimized
                      />
                    </div>

                    <div>
                      <span className="text-base font-bold text-white block">
                        {set.setName}
                      </span>
                      <span className="rounded bg-black/60 px-2 py-0.5 font-mono text-[10px] font-bold text-zinc-300 border border-white/15">
                        {set.pieceCount}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                      isMain
                        ? "bg-indigo-500/25 text-indigo-200 border-indigo-400/40"
                        : "bg-emerald-500/20 text-emerald-200 border-emerald-400/40"
                    }`}
                  >
                    {set.role.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                  {set.reasoning}
                </p>

                {/* Main Stats Row */}
                <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-black/40 p-3 mb-3 text-center">
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-zinc-400">
                      Sands
                    </span>
                    <span className="text-xs font-bold text-white mt-0.5 block truncate">
                      {set.mainStats.sands}
                    </span>
                  </div>
                  <div className="border-l border-r border-white/10">
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-zinc-400">
                      Goblet
                    </span>
                    <span className="text-xs font-bold text-white mt-0.5 block truncate">
                      {set.mainStats.goblet}
                    </span>
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-zinc-400">
                      Circlet
                    </span>
                    <span className="text-xs font-bold text-white mt-0.5 block truncate">
                      {set.mainStats.circlet}
                    </span>
                  </div>
                </div>

                {/* Substats Chips */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                    Substat Priority Order:
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {set.substats.map((sub, sIdx) => (
                      <span
                        key={`sub-${sIdx}`}
                        className="rounded-lg bg-black/60 border border-white/15 px-2.5 py-1 text-[11px] font-mono font-bold text-zinc-200 shadow-sm"
                      >
                        {sIdx + 1}. {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
