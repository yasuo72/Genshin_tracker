"use client";

import Image from "next/image";
import { BuildGuideTeamComp } from "@/lib/types";

interface TeamCompCardProps {
  teamComps: BuildGuideTeamComp[];
  f2pOnly?: boolean;
}

const CHAR_ICON_MAP: Record<string, { name: string; iconUrl: string }> = {
  "10000089": { name: "Furina", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Furina.png" },
  "10000087": { name: "Neuvillette", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Neuvillette.png" },
  "10000096": { name: "Arlecchino", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Arlecchino.png" },
  "10000052": { name: "Raiden", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Shougun.png" },
  "10000073": { name: "Nahida", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Nahida.png" },
  "10000047": { name: "Kazuha", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Kazuha.png" },
  "10000030": { name: "Zhongli", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Zhongli.png" },
  "10000046": { name: "Hu Tao", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Hutao.png" },
  "10000060": { name: "Yelan", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Yelan.png" },
  "10000106": { name: "Mavuika", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Mavuika.png" },
  "10000107": { name: "Citlali", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Citlali.png" },
  "10000103": { name: "Xilonen", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Xilonen.png" },
  "10000032": { name: "Bennett", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Bennett.png" },
  "10000023": { name: "Xiangling", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Xiangling.png" },
  "10000025": { name: "Xingqiu", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Xingqiu.png" },
  "10000031": { name: "Fischl", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Fischl.png" },
  "10000065": { name: "Kuki", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Shinobu.png" },
  "10000078": { name: "Baizhu", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Baizhu.png" },
  "10000093": { name: "Xianyun", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Xianyun.png" },
  "10000090": { name: "Chevreuse", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Chevreuse.png" },
  "10000056": { name: "Sara", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Sara.png" },
  "10000083": { name: "Lynette", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Lynette.png" },
  "10000074": { name: "Layla", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Layla.png" },
  "10000033": { name: "Tartaglia", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Tartaglia.png" },
  "10000043": { name: "Sucrose", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Sucrose.png" },
  "10000070": { name: "Nilou", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Nilou.png" },
  "10000054": { name: "Kokomi", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Kokomi.png" },
  "10000067": { name: "Collei", iconUrl: "https://enka.network/ui/UI_AvatarIcon_Collei.png" },
};

export default function TeamCompCard({
  teamComps,
  f2pOnly = false,
}: TeamCompCardProps) {
  const filtered = f2pOnly
    ? teamComps.filter((t) => t.budget === "F2P")
    : teamComps;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400">
            Top Team Synergies & Rotations
          </h4>
          <span className="text-[11px] text-zinc-400">
            Optimal party configurations, member roles, and skill sequences
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map((team, idx) => {
          let budgetStyle = "bg-purple-500/20 text-purple-300 border-purple-400/40";
          if (team.budget === "F2P") budgetStyle = "bg-emerald-500/20 text-emerald-300 border-emerald-400/40";
          else if (team.budget === "Mixed") budgetStyle = "bg-amber-500/20 text-amber-300 border-amber-400/40";

          return (
            <div
              key={`team-comp-${team.name}-${idx}`}
              className="flex flex-col justify-between rounded-2xl border border-white/15 bg-white/[0.03] p-5 shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-base font-bold text-white">
                    {team.name}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${budgetStyle}`}>
                    {team.budget}
                  </span>
                </div>

                {/* Team Roster with Avatar Icons */}
                <div className="grid grid-cols-4 gap-2 pt-2 pb-3 border-t border-white/10">
                  {team.members.map((m, mIdx) => {
                    const resolved = CHAR_ICON_MAP[m.characterId] || {
                      name: `Char ${m.characterId.slice(-2)}`,
                      iconUrl: `https://enka.network/ui/UI_AvatarIcon_${m.characterId}.png`,
                    };

                    return (
                      <div
                        key={`member-${team.name}-${m.characterId}-${mIdx}`}
                        className="flex flex-col items-center text-center"
                      >
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-black/60 border border-white/20 shadow-md">
                          <Image
                            src={resolved.iconUrl}
                            alt={resolved.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <span className="mt-1 text-[11px] font-bold text-zinc-200 truncate max-w-[70px]">
                          {resolved.name}
                        </span>
                        <span className="text-[9px] text-zinc-400">{m.role}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Rotation summary */}
                <div className="mt-2 pt-2.5 border-t border-white/10">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">
                    Rotation Sequence:
                  </span>
                  <span className="text-xs font-mono text-cyan-200 font-semibold block leading-relaxed">
                    {team.rotation}
                  </span>
                </div>

                {/* Expected Damage Benchmark */}
                {team.expectedDamage && (
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-400">Damage Tier:</span>
                    <span className="font-bold text-amber-300">
                      {team.expectedDamage}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
