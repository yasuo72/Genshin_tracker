"use client";

import { useState } from "react";
import { getBuildGuide } from "@/lib/builds";
import BudgetFilter from "@/components/BudgetFilter";
import ConstellationTrack from "@/components/ConstellationTrack";
import WeaponRankList from "@/components/WeaponRankList";
import ArtifactSetCard from "@/components/ArtifactSetCard";
import TeamCompCard from "@/components/TeamCompCard";

interface BuildGuideSectionProps {
  characterId: string;
  characterName?: string;
  userConstellation?: number;
  userWeaponId?: string;
  userWeaponName?: string;
}

export default function BuildGuideSection({
  characterId,
  characterName,
  userConstellation = 0,
  userWeaponId,
  userWeaponName,
}: BuildGuideSectionProps) {
  const guide = getBuildGuide(characterId || characterName || "");
  const [activeTab, setActiveTab] = useState<"overview" | "weapons" | "artifacts" | "teams">("overview");
  const [f2pOnly, setF2pOnly] = useState<boolean>(false);

  // Fallback if guide is not yet curated
  if (!guide) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-black/40 p-8 text-center backdrop-blur-md shadow-xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-amber-300 font-mono text-xl mb-3">
          📖
        </div>
        <h4 className="text-base font-bold text-white">
          Build Guide Coming Soon
        </h4>
        <p className="mt-1 text-xs text-zinc-400 max-w-md">
          A dedicated meta theorycrafting guide is currently being curated for {characterName || "this character"}.
        </p>
      </div>
    );
  }

  // Cross-reference checks
  const isUsingBisWeapon =
    guide.weapons.length > 0 &&
    ((userWeaponId && userWeaponId === guide.weapons[0].weaponId) ||
      (userWeaponName &&
        userWeaponName.toLowerCase() === guide.weapons[0].name.toLowerCase()));

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-white/15 bg-black/45 p-5 sm:p-7 lg:p-8 shadow-2xl backdrop-blur-md text-zinc-100 transition-all">
      {/* ================= 1. HEADER & META METRICS ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded-lg bg-indigo-500/25 px-3 py-1 text-xs font-bold text-indigo-200 border border-indigo-500/40">
              BUILD GUIDE
            </span>
            {guide.tierRank && (
              <span className="rounded-lg bg-amber-400/20 px-2.5 py-1 font-mono text-xs font-black text-amber-300 border border-amber-400/30">
                {guide.tierRank} TIER
              </span>
            )}
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {characterName || `Character ${characterId}`}
            </h3>
            <span className="text-xs font-semibold text-zinc-400">
              • Primary Role: <strong className="text-cyan-300">{guide.role}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-zinc-400">
            {isUsingBisWeapon && (
              <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                <span>✓</span> You are using Best-in-Slot Weapon!
              </span>
            )}
            <span>Last Updated: {guide.lastUpdated}</span>
          </div>
        </div>

        {/* Budget Filter Toggle */}
        <BudgetFilter f2pOnly={f2pOnly} onToggle={setF2pOnly} />
      </div>

      {/* ================= 2. NAVIGATION TABS ================= */}
      <div className="flex flex-nowrap sm:flex-wrap items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none -mx-2 px-2">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`flex-shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === "overview"
              ? "bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/30"
              : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
          }`}
        >
          Overview & Constellations
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("weapons")}
          className={`flex-shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === "weapons"
              ? "bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/30"
              : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
          }`}
        >
          Weapons ({guide.weapons.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("artifacts")}
          className={`flex-shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === "artifacts"
              ? "bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/30"
              : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
          }`}
        >
          Artifacts & Stats ({guide.artifactSets.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("teams")}
          className={`flex-shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
            activeTab === "teams"
              ? "bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/30"
              : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
          }`}
        >
          Team Compositions ({guide.teamComps.length})
        </button>
      </div>

      {/* ================= 3. TAB CONTENTS ================= */}
      {activeTab === "overview" && (
        <div className="flex flex-col gap-7">
          {/* Constellation Track */}
          <ConstellationTrack
            constellations={guide.constellations}
            userConstellation={userConstellation}
          />

          {/* Quick Snapshot of Weapons & Artifacts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <WeaponRankList
              weapons={guide.weapons.slice(0, 3)}
              userWeaponId={userWeaponId}
              userWeaponName={userWeaponName}
              f2pOnly={f2pOnly}
            />
            <ArtifactSetCard artifactSets={guide.artifactSets.slice(0, 2)} />
          </div>

          {/* Strategy Notes */}
          {guide.notes && (
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/[0.06] p-4 text-xs text-cyan-200 leading-relaxed">
              <span className="font-bold text-white uppercase tracking-wider text-xs block mb-1">
                Theorycrafting Strategy Note:
              </span>
              {guide.notes}
            </div>
          )}
        </div>
      )}

      {activeTab === "weapons" && (
        <WeaponRankList
          weapons={guide.weapons}
          userWeaponId={userWeaponId}
          userWeaponName={userWeaponName}
          f2pOnly={f2pOnly}
        />
      )}

      {activeTab === "artifacts" && (
        <ArtifactSetCard artifactSets={guide.artifactSets} />
      )}

      {activeTab === "teams" && (
        <TeamCompCard teamComps={guide.teamComps} f2pOnly={f2pOnly} />
      )}

      {/* Source Footer */}
      {guide.sources && guide.sources.length > 0 && (
        <div className="mt-2 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between text-[10px] text-zinc-500">
          <span>Sources: {guide.sources.join(" • ")}</span>
          <span>Community Theorycrafting Consensus</span>
        </div>
      )}
    </div>
  );
}
