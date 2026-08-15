"use client";

import { BuildGuideConstellation } from "@/lib/types";

interface ConstellationTrackProps {
  constellations: BuildGuideConstellation[];
  userConstellation?: number;
}

export default function ConstellationTrack({
  constellations,
  userConstellation = 0,
}: ConstellationTrackProps) {
  const priorityStyles: Record<string, { label: string; bg: string; text: string; border: string }> = {
    bis: { label: "BiS Spike", bg: "bg-rose-500/20", text: "text-rose-300", border: "border-rose-500/40" },
    high: { label: "High Value", bg: "bg-amber-500/20", text: "text-amber-300", border: "border-amber-500/40" },
    medium: { label: "Medium", bg: "bg-indigo-500/20", text: "text-indigo-300", border: "border-indigo-500/40" },
    low: { label: "Baseline", bg: "bg-zinc-500/20", text: "text-zinc-400", border: "border-zinc-500/30" },
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400">
            Constellation Roadmap (C0 → C6)
          </h4>
          <span className="text-[11px] text-zinc-400">
            Current Player Level: <strong className="text-white font-mono">C{userConstellation}</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
        {constellations.map((c) => {
          const isCurrent = c.number === userConstellation;
          const isUnlocked = c.number <= userConstellation;
          const p = priorityStyles[c.priority] || priorityStyles.low;

          return (
            <div
              key={`const-${c.number}`}
              className={`relative flex flex-col justify-between rounded-2xl border p-3.5 transition-all shadow-md ${
                isCurrent
                  ? "border-amber-400 bg-amber-500/[0.12] ring-2 ring-amber-400/40"
                  : isUnlocked
                  ? "border-white/20 bg-white/[0.05]"
                  : "border-white/10 bg-black/40 opacity-80 hover:opacity-100"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-sm font-black text-white">
                      C{c.number}
                    </span>
                    {isCurrent && (
                      <span className="rounded bg-amber-400 px-1.5 py-0.5 text-[9px] font-black text-black">
                        YOURS
                      </span>
                    )}
                  </div>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold border ${p.bg} ${p.text} ${p.border}`}
                  >
                    {c.priority.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-snug">
                  {c.summary}
                </p>
              </div>

              {/* Clean Non-Colliding Footer */}
              <div className="mt-3 pt-2 border-t border-white/10 flex flex-col gap-1 text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Status:</span>
                  <span className={isCurrent ? "text-amber-300 font-bold" : isUnlocked ? "text-emerald-400 font-semibold" : "text-zinc-500 font-medium"}>
                    {isCurrent ? "★ Active" : isUnlocked ? "✓ Unlocked" : "Locked"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Impact:</span>
                  <span className={`font-bold ${p.text}`}>{p.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
