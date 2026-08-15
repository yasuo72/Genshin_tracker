"use client";

import Image from "next/image";
import { BuildGuideWeapon } from "@/lib/types";
import { getWeaponIconUrl } from "@/lib/gamedata";

interface WeaponRankListProps {
  weapons: BuildGuideWeapon[];
  userWeaponId?: string;
  userWeaponName?: string;
  f2pOnly?: boolean;
}

export default function WeaponRankList({
  weapons,
  userWeaponId,
  userWeaponName,
  f2pOnly = false,
}: WeaponRankListProps) {
  const filtered = f2pOnly
    ? weapons.filter((w) => w.tier === "F2P")
    : weapons;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400">
            Weapon Rankings & Best in Slot
          </h4>
          <span className="text-[11px] text-zinc-400">
            Ranked by overall damage potential & synergy
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((w, idx) => {
          const isEquipped =
            (userWeaponId && userWeaponId === w.weaponId) ||
            (userWeaponName &&
              userWeaponName.toLowerCase() === w.name.toLowerCase());

          const isRank1 = w.rank === 1;

          let tierBadge = "bg-white/10 text-zinc-300 border-white/20";
          if (w.tier === "Premium (Limited)") {
            tierBadge = "bg-purple-500/20 text-purple-300 border-purple-400/40";
          } else if (w.tier === "F2P") {
            tierBadge = "bg-emerald-500/20 text-emerald-300 border-emerald-400/40";
          } else if (w.tier === "Standard Banner") {
            tierBadge = "bg-amber-500/20 text-amber-300 border-amber-400/40";
          }

          const iconUrl = getWeaponIconUrl(w.name);

          return (
            <div
              key={`weapon-${w.weaponId}-${idx}`}
              className={`relative flex flex-col justify-between rounded-2xl border p-4 transition-all shadow-md ${
                isEquipped
                  ? "border-emerald-400/80 bg-emerald-500/[0.08] ring-2 ring-emerald-400/40"
                  : isRank1
                  ? "border-amber-400/60 bg-amber-500/[0.06]"
                  : "border-white/15 bg-white/[0.03] hover:border-white/25"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-black/60 font-mono text-xs font-black text-amber-300 border border-white/20">
                      #{w.rank}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${tierBadge}`}>
                      {w.tier}
                    </span>
                  </div>

                  {isEquipped && (
                    <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-black text-black">
                      {isRank1 ? "✓ Using BiS" : "✓ Equipped"}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 my-2.5">
                  <div className="relative h-12 w-12 flex-shrink-0 rounded-xl overflow-hidden bg-black/60 border border-white/20 p-1 shadow-inner">
                    <Image
                      src={iconUrl}
                      alt={w.name}
                      fill
                      sizes="48px"
                      className="object-contain drop-shadow-md"
                      unoptimized
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h5 className="text-sm font-bold text-white truncate" title={w.name}>
                      {w.name}
                    </h5>
                    <span className="text-[10px] font-mono text-zinc-400">Rank #{w.rank}</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {w.reasoning}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-400">
                <span>{isRank1 ? "★ Top Recommendation" : `Option #${w.rank}`}</span>
                <span className="font-semibold text-zinc-300">{w.tier}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
