"use client";

import { CharacterRanking } from "@/lib/types";

interface RankingSectionProps {
  ranking?: CharacterRanking | null;
  characterName: string;
}

function TrophyIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14M9 3v4a3 3 0 006 0V3m-9 4a5 5 0 004.5 4.975V17h-3a1 1 0 00-1 1v2h10v-2a1 1 0 00-1-1h-3v-5.025A5 5 0 0018 7" />
    </svg>
  );
}

export default function RankingSection({
  ranking,
  characterName,
}: RankingSectionProps) {
  if (!ranking) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <TrophyIcon className="w-6 h-6 text-zinc-500" />
          <h3 className="text-sm font-semibold text-zinc-300">
            Global Build Ranking
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm">
            Leaderboard calculation data is currently not available for this character build.
          </p>
        </div>
      </div>
    );
  }

  // Determine tier styling
  let badgeStyle = "bg-blue-500/20 text-blue-300 border-blue-500/30";
  let progressGradient = "from-blue-600 to-cyan-400";
  if (ranking.topPercent <= 5) {
    badgeStyle = "bg-amber-500/20 text-amber-300 border-amber-500/30 shadow-amber-500/10 shadow-lg";
    progressGradient = "from-amber-500 via-orange-400 to-yellow-300";
  } else if (ranking.topPercent <= 20) {
    badgeStyle = "bg-purple-500/20 text-purple-300 border-purple-500/30";
    progressGradient = "from-purple-600 to-pink-400";
  }

  // Progress width: Top 1% means 99% full bar
  const progressWidth = Math.max(100 - ranking.topPercent, 5);

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent p-6 sm:p-8 backdrop-blur-xl shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrophyIcon className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">
              Global Percentile Ranking
            </h3>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${badgeStyle}`}
            >
              Top {ranking.topPercent}%
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Simulated leaderboard ranking against all registered builds of{" "}
            <span className="font-semibold text-white">{characterName}</span>
          </p>
        </div>

        {ranking.calculation && (
          <div className="text-right">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block">
              Benchmark Category
            </span>
            <span className="text-xs font-bold text-cyan-300">
              {ranking.calculation}
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-400">Percentile Tier</span>
          <span className="font-bold text-white">
            Better than {100 - ranking.topPercent}% of builds
          </span>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="h-3 w-full overflow-hidden rounded-full bg-white/5 p-0.5 border border-white/10">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${progressGradient} transition-all duration-1000 shadow-sm`}
            style={{ width: `${progressWidth}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mt-1">
          <span>Median (50%)</span>
          <span>Top 20%</span>
          <span>Top 5%</span>
          <span className="text-amber-400 font-bold">Top 1% (Elite)</span>
        </div>
      </div>
    </div>
  );
}
