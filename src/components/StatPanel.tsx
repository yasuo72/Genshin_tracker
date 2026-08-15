"use client";

import { useEffect, useState } from "react";
import { CharacterStats } from "@/lib/types";

interface StatPanelProps {
  stats: CharacterStats;
  element: string;
}

// Simple counter animation hook for smooth numbers
function useAnimatedNumber(target: number, duration = 800) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = 0;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const val = startValue + (target - startValue) * ease;
      setCurrent(val);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCurrent(target);
      }
    };

    requestAnimationFrame(step);
  }, [target, duration]);

  return current;
}

interface StatRowProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  isPercent?: boolean;
  color?: string;
  highlight?: boolean;
}

function StatRow({
  icon,
  label,
  value,
  isPercent = false,
  color = "text-white",
  highlight = false,
}: StatRowProps) {
  const animated = useAnimatedNumber(value);
  const displayVal = isPercent
    ? animated.toFixed(1) + "%"
    : Math.round(animated).toLocaleString();

  return (
    <div
      className={`flex items-center justify-between rounded-xl px-4 py-3 border transition-all ${
        highlight
          ? "border-amber-400/30 bg-amber-500/[0.08]"
          : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-zinc-400">{icon}</span>
        <span className="text-xs sm:text-sm font-medium text-zinc-200">
          {label}
        </span>
      </div>
      <span className={`font-mono text-sm sm:text-base font-bold ${color}`}>
        {displayVal}
      </span>
    </div>
  );
}

export default function StatPanel({ stats }: StatPanelProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="text-base font-bold text-white">
          Combat Attributes
        </h3>
        <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
          Showcase Stats
        </span>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <StatRow
          icon={
            <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          }
          label="Max HP"
          value={stats.hp}
        />
        <StatRow
          icon={
            <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
          label="Attack (ATK)"
          value={stats.atk}
        />
        <StatRow
          icon={
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
          label="Defense (DEF)"
          value={stats.def}
        />

        <div className="my-1 border-t border-white/5" />

        <StatRow
          icon={
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
            </svg>
          }
          label="CRIT Rate"
          value={stats.critRate}
          isPercent
          color="text-amber-400"
          highlight
        />
        <StatRow
          icon={
            <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
          label="CRIT DMG"
          value={stats.critDmg}
          isPercent
          color="text-amber-400"
          highlight
        />

        <div className="my-1 border-t border-white/5" />

        <StatRow
          icon={
            <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          }
          label="Energy Recharge"
          value={stats.energyRecharge}
          isPercent
          color="text-cyan-300"
        />
        <StatRow
          icon={
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          }
          label="Elemental Mastery"
          value={stats.elementalMastery}
          color="text-emerald-300"
        />
      </div>
    </div>
  );
}
