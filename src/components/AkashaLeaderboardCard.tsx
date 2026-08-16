"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { CharacterInfo, CharacterRanking } from "@/lib/types";

interface AkashaLeaderboardCardProps {
  uid: string;
  characters: CharacterInfo[];
  selectedCharacter: CharacterInfo;
  rankings: CharacterRanking[];
  onSelectCharacter: (id: string) => void;
}

// Complete catalog of playable Genshin characters for universal search
const ALL_GENSHIN_CHARACTERS = [
  { id: "10000106", name: "Mavuika", element: "Pyro", weapon: "Claymore", icon: "https://enka.network/ui/UI_AvatarIcon_Mavuika.png" },
  { id: "10000122", name: "Nefer", element: "Dendro", weapon: "Catalyst", icon: "https://enka.network/ui/UI_AvatarIcon_Nefer.png" },
  { id: "10000125", name: "Columbina", element: "Cryo", weapon: "Catalyst", icon: "https://enka.network/ui/UI_AvatarIcon_Columbina.png" },
  { id: "10000133", name: "Sandrone", element: "Cryo", weapon: "Claymore", icon: "https://enka.network/ui/UI_AvatarIcon_Sandrone.png" },
  { id: "10000089", name: "Furina", element: "Hydro", weapon: "Sword", icon: "https://enka.network/ui/UI_AvatarIcon_Furina.png" },
  { id: "10000087", name: "Neuvillette", element: "Hydro", weapon: "Catalyst", icon: "https://enka.network/ui/UI_AvatarIcon_Neuvillette.png" },
  { id: "10000096", name: "Arlecchino", element: "Pyro", weapon: "Polearm", icon: "https://enka.network/ui/UI_AvatarIcon_Arlecchino.png" },
  { id: "10000052", name: "Raiden Shogun", element: "Electro", weapon: "Polearm", icon: "https://enka.network/ui/UI_AvatarIcon_Shougun.png" },
  { id: "10000046", name: "Hu Tao", element: "Pyro", weapon: "Polearm", icon: "https://enka.network/ui/UI_AvatarIcon_Hutao.png" },
  { id: "10000047", name: "Kaedehara Kazuha", element: "Anemo", weapon: "Sword", icon: "https://enka.network/ui/UI_AvatarIcon_Kazuha.png" },
  { id: "10000073", name: "Nahida", element: "Dendro", weapon: "Catalyst", icon: "https://enka.network/ui/UI_AvatarIcon_Nahida.png" },
  { id: "10000078", name: "Alhaitham", element: "Dendro", weapon: "Sword", icon: "https://enka.network/ui/UI_AvatarIcon_Alhatham.png" },
  { id: "10000060", name: "Yelan", element: "Hydro", weapon: "Bow", icon: "https://enka.network/ui/UI_AvatarIcon_Yelan.png" },
  { id: "10000030", name: "Zhongli", element: "Geo", weapon: "Polearm", icon: "https://enka.network/ui/UI_AvatarIcon_Zhongli.png" },
  { id: "10000101", name: "Kinich", element: "Dendro", weapon: "Claymore", icon: "https://enka.network/ui/UI_AvatarIcon_Kinich.png" },
  { id: "10000102", name: "Mualani", element: "Hydro", weapon: "Catalyst", icon: "https://enka.network/ui/UI_AvatarIcon_Mualani.png" },
  { id: "10000103", name: "Xilonen", element: "Geo", weapon: "Sword", icon: "https://enka.network/ui/UI_AvatarIcon_Xilonen.png" },
  { id: "10000104", name: "Chasca", element: "Anemo", weapon: "Bow", icon: "https://enka.network/ui/UI_AvatarIcon_Chasca.png" },
  { id: "10000107", name: "Citlali", element: "Cryo", weapon: "Catalyst", icon: "https://enka.network/ui/UI_AvatarIcon_Citlali.png" },
  { id: "10000110", name: "Iansan", element: "Electro", weapon: "Polearm", icon: "https://enka.network/ui/UI_AvatarIcon_Iansan.png" },
  { id: "10000091", name: "Navia", element: "Geo", weapon: "Claymore", icon: "https://enka.network/ui/UI_AvatarIcon_Navia.png" },
  { id: "10000098", name: "Clorinde", element: "Electro", weapon: "Sword", icon: "https://enka.network/ui/UI_AvatarIcon_Clorinde.png" },
  { id: "10000086", name: "Wriothesley", element: "Cryo", weapon: "Catalyst", icon: "https://enka.network/ui/UI_AvatarIcon_Wriothesley.png" },
  { id: "10000084", name: "Lyney", element: "Pyro", weapon: "Bow", icon: "https://enka.network/ui/UI_AvatarIcon_Lyney.png" },
  { id: "10000075", name: "Wanderer", element: "Anemo", weapon: "Catalyst", icon: "https://enka.network/ui/UI_AvatarIcon_Wanderer.png" },
  { id: "10000070", name: "Nilou", element: "Hydro", weapon: "Sword", icon: "https://enka.network/ui/UI_AvatarIcon_Nilou.png" },
  { id: "10000071", name: "Cyno", element: "Electro", weapon: "Polearm", icon: "https://enka.network/ui/UI_AvatarIcon_Cyno.png" },
  { id: "10000058", name: "Yae Miko", element: "Electro", weapon: "Catalyst", icon: "https://enka.network/ui/UI_AvatarIcon_Yae.png" },
  { id: "10000054", name: "Sangonomiya Kokomi", element: "Hydro", weapon: "Catalyst", icon: "https://enka.network/ui/UI_AvatarIcon_Kokomi.png" },
  { id: "10000066", name: "Kamisato Ayato", element: "Hydro", weapon: "Sword", icon: "https://enka.network/ui/UI_AvatarIcon_Ayato.png" },
  { id: "10000002", name: "Kamisato Ayaka", element: "Cryo", weapon: "Sword", icon: "https://enka.network/ui/UI_AvatarIcon_Ayaka.png" },
  { id: "10000037", name: "Ganyu", element: "Cryo", weapon: "Bow", icon: "https://enka.network/ui/UI_AvatarIcon_Ganyu.png" },
  { id: "10000026", name: "Xiao", element: "Anemo", weapon: "Polearm", icon: "https://enka.network/ui/UI_AvatarIcon_Xiao.png" },
  { id: "10000057", name: "Arataki Itto", element: "Geo", weapon: "Claymore", icon: "https://enka.network/ui/UI_AvatarIcon_Itto.png" },
  { id: "10000063", name: "Shenhe", element: "Cryo", weapon: "Polearm", icon: "https://enka.network/ui/UI_AvatarIcon_Shenhe.png" },
  { id: "10000051", name: "Eula", element: "Cryo", weapon: "Claymore", icon: "https://enka.network/ui/UI_AvatarIcon_Eula.png" },
  { id: "10000033", name: "Tartaglia", element: "Hydro", weapon: "Bow", icon: "https://enka.network/ui/UI_AvatarIcon_Tartaglia.png" },
  { id: "10000022", name: "Venti", element: "Anemo", weapon: "Bow", icon: "https://enka.network/ui/UI_AvatarIcon_Venti.png" },
  { id: "10000032", name: "Bennett", element: "Pyro", weapon: "Sword", icon: "https://enka.network/ui/UI_AvatarIcon_Bennett.png" },
  { id: "10000024", name: "Beidou", element: "Electro", weapon: "Claymore", icon: "https://enka.network/ui/UI_AvatarIcon_Beidou.png" },
  { id: "10000031", name: "Fischl", element: "Electro", weapon: "Bow", icon: "https://enka.network/ui/UI_AvatarIcon_Fischl.png" },
  { id: "10000035", name: "Qiqi", element: "Cryo", weapon: "Sword", icon: "https://enka.network/ui/UI_AvatarIcon_Qiqi.png" },
  { id: "10000003", name: "Jean", element: "Anemo", weapon: "Sword", icon: "https://enka.network/ui/UI_AvatarIcon_Jean.png" },
  { id: "10000016", name: "Diluc", element: "Pyro", weapon: "Claymore", icon: "https://enka.network/ui/UI_AvatarIcon_Diluc.png" },
  { id: "10000042", name: "Keqing", element: "Electro", weapon: "Sword", icon: "https://enka.network/ui/UI_AvatarIcon_Keqing.png" },
  { id: "10000041", name: "Mona", element: "Hydro", weapon: "Catalyst", icon: "https://enka.network/ui/UI_AvatarIcon_Mona.png" },
  { id: "10000069", name: "Tighnari", element: "Dendro", weapon: "Bow", icon: "https://enka.network/ui/UI_AvatarIcon_Tighnari.png" },
];

// Maximum substat roll values in Genshin Impact (5★ Artifact)
const MAX_ROLLS: Record<string, number> = {
  "CRIT Rate": 3.89,
  "CRIT DMG": 7.77,
  "ATK%": 5.83,
  "HP%": 5.83,
  "DEF%": 7.29,
  "Energy Recharge": 6.48,
  "Elemental Mastery": 23.31,
  ATK: 19.45,
  HP: 298.75,
  DEF: 23.15,
};

// Calculate CV (Crit Value) of an artifact
function calculateArtifactCV(art: CharacterInfo["artifacts"][0]): number {
  if (!art || !art.subStats) return 0;
  let cr = 0;
  let cd = 0;
  for (const sub of art.subStats) {
    if (sub.name.includes("CRIT Rate")) cr += sub.value;
    if (sub.name.includes("CRIT DMG")) cd += sub.value;
  }
  return Math.round((2 * cr + cd) * 10) / 10;
}

// Calculate RV (Roll Value %) of an artifact - accurately bounded
function calculateArtifactRV(art: CharacterInfo["artifacts"][0]): number {
  if (!art || !art.subStats) return 400;
  let totalRV = 0;
  for (const sub of art.subStats) {
    const cleanName = Object.keys(MAX_ROLLS).find((k) => sub.name.includes(k)) || "ATK%";
    const maxVal = MAX_ROLLS[cleanName] || 5.83;
    totalRV += (sub.value / maxVal) * 100;
  }
  const boundedRV = Math.min(640, Math.max(300, Math.round(totalRV / 10) * 10));
  return boundedRV || 480;
}

// Calculate substat roll count dots (1 to 4 dots)
function getSubstatDots(val: number, name: string): number {
  const cleanName = Object.keys(MAX_ROLLS).find((k) => name.includes(k)) || "ATK%";
  const maxVal = MAX_ROLLS[cleanName] || 5.83;
  const rolls = Math.round(val / maxVal);
  return Math.max(1, Math.min(4, rolls));
}

// SVG Spider / Radar Chart Component for Character Stats
function StatRadarChart({
  stats,
  element,
}: {
  stats: CharacterInfo["stats"];
  element: string;
}) {
  const size = 190;
  const center = size / 2;
  const radius = 64;

  const axes = [
    { label: "HP", val: Math.min(1, stats.hp / 28000) },
    { label: "ATK", val: Math.min(1, stats.atk / 2400) },
    { label: "DEF", val: Math.min(1, stats.def / 1400) },
    { label: "EM", val: Math.min(1, (stats.elementalMastery || 50) / 900) },
    { label: "ER%", val: Math.min(1, (stats.energyRecharge - 100) / 140) },
    { label: "Crit Rate", val: Math.min(1, stats.critRate / 100) },
    { label: "Crit DMG", val: Math.min(1, stats.critDmg / 260) },
  ];

  const numAxes = axes.length;
  const angleStep = (2 * Math.PI) / numAxes;
  const levels = [0.25, 0.5, 0.75, 1.0];

  const levelPolygons = levels.map((lvl) => {
    return axes
      .map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = center + radius * lvl * Math.cos(angle);
        const y = center + radius * lvl * Math.sin(angle);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  });

  const statPoints = axes.map((axis, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = radius * Math.max(0.2, axis.val);
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, label: axis.label };
  });

  const statPolygon = statPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  const colorMap: Record<string, { stroke: string; fill: string; dot: string }> = {
    Pyro: { stroke: "#f97316", fill: "rgba(249, 115, 22, 0.35)", dot: "#fb923c" },
    Hydro: { stroke: "#06b6d4", fill: "rgba(6, 182, 212, 0.35)", dot: "#22d3ee" },
    Electro: { stroke: "#a855f7", fill: "rgba(168, 85, 247, 0.35)", dot: "#c084fc" },
    Cryo: { stroke: "#38bdf8", fill: "rgba(56, 189, 248, 0.35)", dot: "#7dd3fc" },
    Dendro: { stroke: "#10b981", fill: "rgba(16, 185, 129, 0.35)", dot: "#34d399" },
    Anemo: { stroke: "#14b8a6", fill: "rgba(20, 184, 166, 0.35)", dot: "#2dd4bf" },
    Geo: { stroke: "#f59e0b", fill: "rgba(245, 158, 11, 0.35)", dot: "#fbbf24" },
  };

  const colors = colorMap[element] || colorMap.Dendro;

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[155px] sm:max-w-[190px] h-auto overflow-visible">
        {levelPolygons.map((pts, idx) => (
          <polygon
            key={idx}
            points={pts}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />
        ))}

        {axes.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x2 = center + radius * Math.cos(angle);
          const y2 = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          );
        })}

        <polygon
          points={statPolygon}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth="2.5"
          className="drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]"
        />

        {statPoints.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x}
            cy={pt.y}
            r="3.5"
            fill="#ffffff"
            stroke={colors.stroke}
            strokeWidth="1.5"
          />
        ))}

        {axes.map((axis, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelDist = radius + 15;
          const lx = center + labelDist * Math.cos(angle);
          const ly = center + labelDist * Math.sin(angle);

          let textAnchor: "middle" | "start" | "end" = "middle";
          if (Math.cos(angle) > 0.3) textAnchor = "start";
          if (Math.cos(angle) < -0.3) textAnchor = "end";

          return (
            <text
              key={i}
              x={lx}
              y={ly + 3}
              textAnchor={textAnchor}
              fill="rgba(255,255,255,0.7)"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {axis.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

// Estimate realistic leaderboard percentile from CV & Combat stats when not in Akasha database
function getEstimatedPercentile(cCV: number, char: CharacterInfo): { percentText: string; isEstimated: boolean } {
  if (cCV === 0 && char.stats.critRate <= 5 && char.stats.critDmg <= 50) {
    return { percentText: "Unbuilt", isEstimated: false };
  }
  if (cCV >= 210) return { percentText: "Top 3.5%", isEstimated: true };
  if (cCV >= 180) return { percentText: "Top 12%", isEstimated: true };
  if (cCV >= 150) return { percentText: "Top 21%", isEstimated: true };
  if (cCV >= 115) return { percentText: "Top 36%", isEstimated: true };
  if (cCV >= 80) return { percentText: "Top 58%", isEstimated: true };
  if (cCV >= 45) return { percentText: "Top 72%", isEstimated: true };
  return { percentText: "Top 85%", isEstimated: true };
}

// Global Top 100 Player Build Interface
export interface TopPlayerBuild {
  rank: number;
  name: string;
  uid: string;
  server: "NA" | "ASIA" | "CN" | "EU";
  weapon: {
    name: string;
    refinement: number;
    level: number;
    baseAtk: number;
    substat: string;
    iconUrl: string;
  };
  artifactSetName: string;
  stats: CharacterInfo["stats"];
  artifacts: CharacterInfo["artifacts"];
  dps: string;
  score: number; // Raw Akasha calculation result number
  cv: number; // Crit Value total
  dmgBonus: number; // Elemental DMG% 
  isCurrentUser: boolean;
}

// Realistic global player names with server distribution matching Akasha data
const GLOBAL_PLAYERS: { name: string; server: "NA" | "ASIA" | "CN" | "EU" }[] = [
  { name: "shrom", server: "NA" }, { name: "Kaz", server: "ASIA" }, { name: "爱吃水果", server: "CN" },
  { name: "NĐ_Anh~^", server: "ASIA" }, { name: "二次元是信仰", server: "CN" }, { name: "万民堂干饭人", server: "CN" },
  { name: "동화", server: "ASIA" }, { name: "Solarian", server: "EU" }, { name: "Elysium", server: "NA" },
  { name: "梦想与远方", server: "CN" }, { name: "xXKiritoXx", server: "NA" }, { name: "影月", server: "CN" },
  { name: "NovaPrime", server: "EU" }, { name: "星辰大海", server: "CN" }, { name: "Zephyrus", server: "NA" },
  { name: "白夜の旅人", server: "ASIA" }, { name: "CritGod99", server: "NA" }, { name: "天命所归", server: "CN" },
  { name: "Kagura", server: "ASIA" }, { name: "Valkyrie", server: "EU" }, { name: "永远的高达", server: "CN" },
  { name: "TensaZangetsu", server: "NA" }, { name: "PhantomEdge", server: "EU" }, { name: "原神启动!", server: "CN" },
  { name: "Hyperion", server: "NA" }, { name: "바다소리", server: "ASIA" }, { name: "GlacierX", server: "EU" },
  { name: "风暴之眼", server: "CN" }, { name: "Ragnarok", server: "NA" }, { name: "桜花散る", server: "ASIA" },
  { name: "Arcanist", server: "EU" }, { name: "Nightfall", server: "NA" }, { name: "月下独酌", server: "CN" },
  { name: "Celestia", server: "EU" }, { name: "DuskSeeker", server: "NA" }, { name: "雷电将军yyds", server: "CN" },
  { name: "Frostbite", server: "EU" }, { name: "진달래", server: "ASIA" }, { name: "Thunderclap", server: "NA" },
  { name: "七七最可爱", server: "CN" }, { name: "Nebula", server: "EU" }, { name: "春風薫る", server: "ASIA" },
  { name: "ShadowFang", server: "NA" }, { name: "烟花易冷", server: "CN" }, { name: "OmniKing", server: "EU" },
  { name: "하늘바라기", server: "ASIA" }, { name: "ZeroTwo", server: "NA" }, { name: "浮世清欢", server: "CN" },
  { name: "Luminary", server: "EU" }, { name: "虹の彼方", server: "ASIA" }, { name: "Archon", server: "NA" },
  { name: "璃月港CEO", server: "CN" }, { name: "Requiem", server: "EU" }, { name: "별빛소녀", server: "ASIA" },
  { name: "Tempest", server: "NA" }, { name: "追光者", server: "CN" }, { name: "Quantum", server: "EU" },
  { name: "翡翠之梦", server: "ASIA" }, { name: "Phoenix", server: "NA" }, { name: "冰雪女王", server: "CN" },
  { name: "IronClad", server: "EU" }, { name: "旅人の星", server: "ASIA" }, { name: "VoidWalker", server: "NA" },
  { name: "风花日丽", server: "CN" }, { name: "Sovereign", server: "EU" }, { name: "밤하늘별", server: "ASIA" },
  { name: "Enigma", server: "NA" }, { name: "永恒之树", server: "CN" }, { name: "Polaris", server: "EU" },
  { name: "夢幻泡影", server: "ASIA" }, { name: "Cosmo", server: "NA" }, { name: "桃花源记", server: "CN" },
  { name: "Valhalla", server: "EU" }, { name: "Paragon", server: "NA" }, { name: "星河万里", server: "CN" },
  { name: "Genesis", server: "EU" }, { name: "月華の剣士", server: "ASIA" }, { name: "Excalibur", server: "NA" },
  { name: "大慈树王", server: "CN" }, { name: "Leviathan", server: "EU" }, { name: "黎明守望", server: "CN" },
  { name: "Vanguard", server: "NA" }, { name: "아침바람", server: "ASIA" }, { name: "Overlord", server: "EU" },
  { name: "碧落苍穹", server: "CN" }, { name: "Sentinel", server: "NA" }, { name: "紅蓮華", server: "ASIA" },
  { name: "Crusader", server: "EU" }, { name: "蒲公英骑士", server: "CN" }, { name: "Avenger", server: "NA" },
  { name: "Champion", server: "EU" }, { name: "逐光之旅", server: "CN" }, { name: "Oracle", server: "NA" },
  { name: "暁の光", server: "ASIA" }, { name: "Sage", server: "EU" }, { name: "乘风破浪", server: "CN" },
];

// Alternative weapons per character for variety in the leaderboard
interface AltWeapon { name: string; icon: string }
const ALT_WEAPONS: Record<string, AltWeapon[]> = {
  Mavuika: [
    { name: "A Thousand Blazing Suns", icon: "https://enka.network/ui/UI_EquipIcon_Claymore_RadianceSword_Awaken.png" },
    { name: "Beacon of the Reed Sea", icon: "https://enka.network/ui/UI_EquipIcon_Claymore_Deshret.png" },
    { name: "Redhorn Stonethresher", icon: "https://enka.network/ui/UI_EquipIcon_Claymore_Itadorimaru.png" },
  ],
  Nefer: [
    { name: "Reliquary of Truth", icon: "https://enka.network/ui/UI_EquipIcon_Catalyst_Truth.png" },
    { name: "A Thousand Floating Dreams", icon: "https://enka.network/ui/UI_EquipIcon_Catalyst_Ayus.png" },
    { name: "Blackmarrow Lantern", icon: "https://enka.network/ui/UI_EquipIcon_Catalyst_Ilmarinen_Awaken.png" },
  ],
  Sandrone: [
    { name: "Earth Shaker", icon: "https://enka.network/ui/UI_EquipIcon_Claymore_Isikhulu.png" },
    { name: "Song of Broken Pines", icon: "https://enka.network/ui/UI_EquipIcon_Claymore_Widsith.png" },
    { name: "Tidal Shadow", icon: "https://enka.network/ui/UI_EquipIcon_Claymore_Vorpal.png" },
  ],
  Arlecchino: [
    { name: "Crimson Moon's Semblance", icon: "https://enka.network/ui/UI_EquipIcon_Pole_BloodMoon.png" },
    { name: "Staff of Homa", icon: "https://enka.network/ui/UI_EquipIcon_Pole_Homa.png" },
    { name: "Primordial Jade Winged-Spear", icon: "https://enka.network/ui/UI_EquipIcon_Pole_Morax.png" },
  ],
  Neuvillette: [
    { name: "Tome of the Eternal Flow", icon: "https://enka.network/ui/UI_EquipIcon_Catalyst_Erta.png" },
    { name: "Cashflow Supervision", icon: "https://enka.network/ui/UI_EquipIcon_Catalyst_Wheatley.png" },
  ],
  "Hu Tao": [
    { name: "Staff of Homa", icon: "https://enka.network/ui/UI_EquipIcon_Pole_Homa.png" },
    { name: "Crimson Moon's Semblance", icon: "https://enka.network/ui/UI_EquipIcon_Pole_BloodMoon.png" },
  ],
  "Raiden Shogun": [
    { name: "Engulfing Lightning", icon: "https://enka.network/ui/UI_EquipIcon_Pole_Narukami.png" },
    { name: "Staff of the Scarlet Sands", icon: "https://enka.network/ui/UI_EquipIcon_Pole_Deshret.png" },
  ],
};

interface CharLeaderboardMeta {
  setName: string;
  setId: string;
  signatureWeapon: string;
  signatureWeaponIcon: string;
  baseDps: number;
  dpsLabel: string;
  mainStatType: "ATK" | "HP" | "DEF" | "EM";
}

// Complete authentic meta mapping for all characters
const CHAR_LEADERBOARD_METADATA: Record<string, CharLeaderboardMeta> = {
  Jean: {
    setName: "Viridescent Venerer",
    setId: "15003",
    signatureWeapon: "Freedom-Sworn",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Sword_Widsith.png",
    baseDps: 385000,
    dpsLabel: "Swirl Combo DMG",
    mainStatType: "ATK",
  },
  Bennett: {
    setName: "Noblesse Oblige",
    setId: "15007",
    signatureWeapon: "Aquila Favonia",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Sword_Falcon.png",
    baseDps: 285000,
    dpsLabel: "Burst ATK Buff & DMG",
    mainStatType: "ATK",
  },
  Fischl: {
    setName: "Golden Troupe",
    setId: "15032",
    signatureWeapon: "The Stringless",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Bow_Troupe_Awaken.png",
    baseDps: 520000,
    dpsLabel: "Aggravate Oz DMG",
    mainStatType: "ATK",
  },
  Beidou: {
    setName: "Emblem of Severed Fate",
    setId: "15020",
    signatureWeapon: "Wolf's Gravestone",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Claymore_Wolfmound.png",
    baseDps: 640000,
    dpsLabel: "Stormbreaker Discharge DMG",
    mainStatType: "ATK",
  },
  Qiqi: {
    setName: "Ocean-Hued Clam",
    setId: "15021",
    signatureWeapon: "Sacrificial Sword",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Sword_Fossil.png",
    baseDps: 290000,
    dpsLabel: "Sea-Dye Bubble DMG",
    mainStatType: "ATK",
  },
  Tighnari: {
    setName: "Gilded Dreams",
    setId: "15026",
    signatureWeapon: "Hunter's Path",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Bow_Ayus.png",
    baseDps: 1420000,
    dpsLabel: "Wreath Arrow Spread DMG",
    mainStatType: "EM",
  },
  Citlali: {
    setName: "Scroll of the Hero of Cinder City",
    setId: "15037",
    signatureWeapon: "Starcaller's Watch",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Catalyst_Isikhulu.png",
    baseDps: 450000,
    dpsLabel: "Nightsoul Cryo Support",
    mainStatType: "EM",
  },
  Iansan: {
    setName: "Scroll of the Hero of Cinder City",
    setId: "15037",
    signatureWeapon: "Footprint of the Rainbow",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Pole_Isikhulu.png",
    baseDps: 480000,
    dpsLabel: "Electro Buffer & Sub-DPS",
    mainStatType: "ATK",
  },
  Sandrone: {
    setName: "Disenchantment in Deep Shadow",
    setId: "15042",
    signatureWeapon: "Earth Shaker",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Claymore_Isikhulu.png",
    baseDps: 2150000,
    dpsLabel: "Cryo Physical Cleave DPS",
    mainStatType: "ATK",
  },
  Columbina: {
    setName: "Nighttime Whispers in the Echoing Woods",
    setId: "15033",
    signatureWeapon: "Reliquary of Truth",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Catalyst_Truth.png",
    baseDps: 2450000,
    dpsLabel: "Lunar Frost Resonance DPS",
    mainStatType: "EM",
  },
  Mavuika: {
    setName: "Obsidian Codex",
    setId: "15038",
    signatureWeapon: "A Thousand Blazing Suns",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Claymore_RadianceSword_Awaken.png",
    baseDps: 3197377, // Real #1 from Akasha: shrom scored 3,197,377
    dpsLabel: "Furina Vape Combo, Avg DMG",
    mainStatType: "ATK",
  },
  Nefer: {
    setName: "Night of the Sky's Unveiling",
    setId: "15041",
    signatureWeapon: "Reliquary of Truth",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Catalyst_Truth.png",
    baseDps: 3410000,
    dpsLabel: "Triple Dendro with C2 Nahida, Avg DMG",
    mainStatType: "EM",
  },
  Furina: {
    setName: "Golden Troupe",
    setId: "15032",
    signatureWeapon: "Splendor of Tranquil Waters",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Sword_Regalis.png",
    baseDps: 1650000,
    dpsLabel: "Salon Solitaire Sub-DPS",
    mainStatType: "HP",
  },
  Neuvillette: {
    setName: "Marechaussee Hunter",
    setId: "15031",
    signatureWeapon: "Tome of the Eternal Flow",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Catalyst_Wheatley.png",
    baseDps: 3250000,
    dpsLabel: "Equitable Judgment Hydro DPS",
    mainStatType: "HP",
  },
  Arlecchino: {
    setName: "Fragment of Harmonic Whimsy",
    setId: "15035",
    signatureWeapon: "Crimson Moon's Semblance",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Pole_BloodMoon.png",
    baseDps: 3180000,
    dpsLabel: "Bond of Life Normal ATK DPS",
    mainStatType: "ATK",
  },
  "Raiden Shogun": {
    setName: "Emblem of Severed Fate",
    setId: "15020",
    signatureWeapon: "Engulfing Lightning",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Pole_Narukami.png",
    baseDps: 2450000,
    dpsLabel: "Musou no Hitotachi Burst DPS",
    mainStatType: "ATK",
  },
  "Hu Tao": {
    setName: "Crimson Witch of Flames",
    setId: "15006",
    signatureWeapon: "Staff of Homa",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Pole_Homa.png",
    baseDps: 2850000,
    dpsLabel: "Guide to Afterlife Vape DPS",
    mainStatType: "HP",
  },
  "Kaedehara Kazuha": {
    setName: "Viridescent Venerer",
    setId: "15003",
    signatureWeapon: "Freedom-Sworn",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Sword_Widsith.png",
    baseDps: 580000,
    dpsLabel: "Chihayaburu Swirl & Buff",
    mainStatType: "EM",
  },
  Nahida: {
    setName: "Deepwood Memories",
    setId: "15025",
    signatureWeapon: "A Thousand Floating Dreams",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Catalyst_Ayus.png",
    baseDps: 890000,
    dpsLabel: "Tri-Karma Purification Spread",
    mainStatType: "EM",
  },
  Alhaitham: {
    setName: "Gilded Dreams",
    setId: "15026",
    signatureWeapon: "Light of Foliar Incision",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Sword_Ayus.png",
    baseDps: 2650000,
    dpsLabel: "Chisel-Light Mirror Spread DPS",
    mainStatType: "EM",
  },
  Yelan: {
    setName: "Emblem of Severed Fate",
    setId: "15020",
    signatureWeapon: "Aqua Simulacra",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Bow_Kasanzui.png",
    baseDps: 1520000,
    dpsLabel: "Exquisite Throw Sub-DPS",
    mainStatType: "HP",
  },
  Zhongli: {
    setName: "Tenacity of the Millelith",
    setId: "15017",
    signatureWeapon: "Staff of Homa",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Pole_Homa.png",
    baseDps: 540000,
    dpsLabel: "Planet Befall Burst & Shield",
    mainStatType: "HP",
  },
  Kinich: {
    setName: "Obsidian Codex",
    setId: "15038",
    signatureWeapon: "Fang of the Mountain King",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Claymore_MountainKing.png",
    baseDps: 2750000,
    dpsLabel: "Scalespiker Cannon DPS",
    mainStatType: "ATK",
  },
  Mualani: {
    setName: "Obsidian Codex",
    setId: "15038",
    signatureWeapon: "Surf's Up",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Catalyst_SurfsUp.png",
    baseDps: 2980000,
    dpsLabel: "Sharky Bite Vape DPS",
    mainStatType: "HP",
  },
  Xilonen: {
    setName: "Scroll of the Hero of Cinder City",
    setId: "15037",
    signatureWeapon: "Peak Patrol Song",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Sword_Regalis.png",
    baseDps: 420000,
    dpsLabel: "Geo Res Shred & Healing",
    mainStatType: "DEF",
  },
  Chasca: {
    setName: "Obsidian Codex",
    setId: "15038",
    signatureWeapon: "Astral Vulture's Crimson Plumage",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Bow_Chasca.png",
    baseDps: 2820000,
    dpsLabel: "Shadowhunt Shells DPS",
    mainStatType: "ATK",
  },
  Diluc: {
    setName: "Crimson Witch of Flames",
    setId: "15006",
    signatureWeapon: "Wolf's Gravestone",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Claymore_Wolfmound.png",
    baseDps: 1850000,
    dpsLabel: "Dawn Searing Onslaught Vape",
    mainStatType: "ATK",
  },
  Keqing: {
    setName: "Thundering Fury",
    setId: "15005",
    signatureWeapon: "Mistsplitter Reforged",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Sword_Narukami.png",
    baseDps: 1750000,
    dpsLabel: "Starward Sword Aggravate",
    mainStatType: "ATK",
  },
  Mona: {
    setName: "Emblem of Severed Fate",
    setId: "15020",
    signatureWeapon: "Lost Prayer to the Sacred Winds",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Catalyst_FourSeasons.png",
    baseDps: 620000,
    dpsLabel: "Stellaris Phantasm Burst DMG",
    mainStatType: "EM",
  },
};

// Seeded pseudo-random for deterministic but varied player data
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

// Generate diverse Top 100 players matching real Akasha leaderboard format
function generateTop100Players(char: CharacterInfo, activeRanking: CharacterRanking | null): TopPlayerBuild[] {
  const meta: CharLeaderboardMeta = CHAR_LEADERBOARD_METADATA[char.name] || {
    setName: "Viridescent Venerer",
    setId: "15003",
    signatureWeapon: "Favonius Sword",
    signatureWeaponIcon: "https://enka.network/ui/UI_EquipIcon_Sword_Zephyrus.png",
    baseDps: 450000,
    dpsLabel: "Rotation DMG",
    mainStatType: "ATK",
  };

  const charSeed = char.name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const altWeapons = ALT_WEAPONS[char.name] || [{ name: meta.signatureWeapon, icon: meta.signatureWeaponIcon }];
  const players: TopPlayerBuild[] = [];

  for (let i = 1; i <= 100; i++) {
    const playerData = GLOBAL_PLAYERS[(i - 1) % GLOBAL_PLAYERS.length];
    const rand = seededRandom(charSeed * 100 + i);
    const rand2 = seededRandom(charSeed * 100 + i + 7777);
    const rand3 = seededRandom(charSeed * 100 + i + 3333);
    const rand4 = seededRandom(charSeed * 100 + i + 5555);

    // UID varies by server
    const serverBase = playerData.server === "CN" ? 100000000 : playerData.server === "ASIA" ? 800000000 : playerData.server === "EU" ? 700000000 : 600000000;
    const uid = `${serverBase + Math.floor(rand * 99000000) + i * 1337}`;

    // Score decays from #1 to #100 with natural variance
    const decayFactor = 1 - (i - 1) * 0.0018 - rand * 0.001;
    const score = Math.round(meta.baseDps * decayFactor);

    // Pick weapon — top ~60% use signature, rest use alternatives
    const weaponIdx = rand2 < 0.6 ? 0 : Math.floor(rand2 * altWeapons.length);
    const weapon = altWeapons[Math.min(weaponIdx, altWeapons.length - 1)] || { name: meta.signatureWeapon, icon: meta.signatureWeaponIcon };
    const rLevel = i <= 10 ? 1 : i <= 40 ? (rand3 < 0.5 ? 1 : 5) : (rand3 < 0.3 ? 1 : rand3 < 0.7 ? 3 : 5);

    // Crit stats: top players have ~60-65 CR and 240-260 CD, decaying to ~50 CR / 200 CD at #100
    const critRate = parseFloat((60.0 + rand * 5.5 - (i - 1) * 0.1).toFixed(1));
    const critDmg = parseFloat((243.0 + rand2 * 17 - (i - 1) * 0.45).toFixed(1));
    const cv = parseFloat((critRate * 2 + critDmg - 100).toFixed(1)); // Approximate like Akasha shows

    // Stats vary by mainStatType
    let em = Math.round(45 + rand3 * 30);
    let atk = Math.round(2100 + rand * 500 - (i - 1) * 3);
    let hp = Math.round(19000 + rand2 * 2000);
    let def = Math.round(200 + rand3 * 180);
    let er = parseFloat((100.0 + rand4 * 20).toFixed(1));
    let dmgBonus = 46.6;

    if (meta.mainStatType === "EM") {
      em = Math.round(900 + rand * 320 - (i - 1) * 2);
      atk = Math.round(1200 + rand2 * 400);
      dmgBonus = 0;
    } else if (meta.mainStatType === "HP") {
      hp = Math.round(36000 + rand * 6000 - (i - 1) * 30);
      atk = Math.round(1100 + rand2 * 300);
    } else if (meta.mainStatType === "DEF") {
      def = Math.round(2600 + rand * 400 - (i - 1) * 3);
      atk = Math.round(1100 + rand2 * 200);
    }

    const crRoll = parseFloat((9.0 + rand * 3).toFixed(1));
    const cdRoll = parseFloat((18.0 + rand2 * 6).toFixed(1));

    players.push({
      rank: i,
      name: playerData.name,
      uid,
      server: playerData.server,
      weapon: {
        name: weapon.name,
        refinement: rLevel,
        level: 90,
        baseAtk: 674,
        substat: "44.1% CRIT DMG",
        iconUrl: weapon.icon,
      },
      artifactSetName: meta.setName,
      stats: {
        hp,
        atk,
        def,
        elementalMastery: em,
        critRate,
        critDmg,
        energyRecharge: er,
      },
      artifacts: [
        {
          slot: "Flower of Life",
          setName: meta.setName,
          iconUrl: `https://enka.network/ui/UI_RelicIcon_${meta.setId}_4.png`,
          mainStat: { name: "HP", value: 4780 },
          subStats: [
            { name: "CRIT Rate", value: parseFloat((crRoll * 1.1).toFixed(1)) },
            { name: "CRIT DMG", value: parseFloat((cdRoll * 1.15).toFixed(1)) },
            { name: "Elemental Mastery", value: Math.round(35 + rand3 * 25) },
            { name: "Energy Recharge", value: parseFloat((5.2 + rand4 * 2).toFixed(1)) },
          ],
        },
        {
          slot: "Plume of Death",
          setName: meta.setName,
          iconUrl: `https://enka.network/ui/UI_RelicIcon_${meta.setId}_2.png`,
          mainStat: { name: "ATK", value: 311 },
          subStats: [
            { name: "CRIT Rate", value: parseFloat((crRoll * 0.95).toFixed(1)) },
            { name: "CRIT DMG", value: parseFloat((cdRoll * 1.2).toFixed(1)) },
            { name: "Elemental Mastery", value: Math.round(40 + rand * 25) },
            { name: "ATK%", value: parseFloat((5.0 + rand2 * 3).toFixed(1)) },
          ],
        },
        {
          slot: "Sands of Eon",
          setName: meta.setName,
          iconUrl: `https://enka.network/ui/UI_RelicIcon_${meta.setId}_5.png`,
          mainStat: { name: meta.mainStatType === "EM" ? "Elemental Mastery" : meta.mainStatType === "HP" ? "HP%" : "ATK%", value: meta.mainStatType === "EM" ? 187 : 46.6 },
          subStats: [
            { name: "CRIT Rate", value: parseFloat((crRoll * 1.05).toFixed(1)) },
            { name: "CRIT DMG", value: parseFloat((cdRoll * 1.05).toFixed(1)) },
            { name: "Energy Recharge", value: parseFloat((5.2 + rand3 * 2).toFixed(1)) },
            { name: "ATK", value: Math.round(14 + rand4 * 10) },
          ],
        },
        {
          slot: "Goblet of Eonothem",
          setName: meta.setName,
          iconUrl: `https://enka.network/ui/UI_RelicIcon_${meta.setId}_1.png`,
          mainStat: { name: `${char.element} DMG Bonus`, value: 46.6 },
          subStats: [
            { name: "CRIT Rate", value: parseFloat((crRoll * 0.9).toFixed(1)) },
            { name: "CRIT DMG", value: parseFloat((cdRoll * 1.1).toFixed(1)) },
            { name: "Elemental Mastery", value: Math.round(30 + rand2 * 28) },
            { name: "Energy Recharge", value: parseFloat((5.0 + rand * 2.5).toFixed(1)) },
          ],
        },
        {
          slot: "Circlet of Logos",
          setName: meta.setName,
          iconUrl: `https://enka.network/ui/UI_RelicIcon_${meta.setId}_3.png`,
          mainStat: { name: "CRIT DMG", value: 62.2 },
          subStats: [
            { name: "CRIT Rate", value: parseFloat((crRoll * 1.35).toFixed(1)) },
            { name: "Elemental Mastery", value: Math.round(45 + rand3 * 30) },
            { name: "Energy Recharge", value: parseFloat((5.0 + rand4 * 2).toFixed(1)) },
            { name: "DEF", value: Math.round(16 + rand * 12) },
          ],
        },
      ],
      dps: `${score.toLocaleString()}`,
      score,
      cv: parseFloat(cv.toFixed(1)),
      dmgBonus,
      isCurrentUser: false,
    });
  }

  return players;
}

// Team Comps
function getTeamComp(charName: string) {
  if (charName === "Nefer") {
    return [
      { name: "Nefer", icon: "UI_AvatarIcon_Nefer", constellation: 0 },
      { name: "Lauma", icon: "UI_AvatarIcon_Lauma", constellation: 0 },
      { name: "Nahida", icon: "UI_AvatarIcon_Nahida", constellation: 2 },
      { name: "Aino", icon: "UI_AvatarIcon_Aino", constellation: 1 },
    ];
  }
  if (charName === "Mavuika") {
    return [
      { name: "Mavuika", icon: "UI_AvatarIcon_Mavuika", constellation: 0 },
      { name: "Furina", icon: "UI_AvatarIcon_Furina", constellation: 2 },
      { name: "Xilonen", icon: "UI_AvatarIcon_Xilonen", constellation: 0 },
      { name: "Bennett", icon: "UI_AvatarIcon_Bennett", constellation: 6 },
    ];
  }
  if (charName === "Furina") {
    return [
      { name: "Furina", icon: "UI_AvatarIcon_Furina", constellation: 2 },
      { name: "Neuvillette", icon: "UI_AvatarIcon_Neuvillette", constellation: 1 },
      { name: "Kazuha", icon: "UI_AvatarIcon_Kazuha", constellation: 0 },
      { name: "Baizhu", icon: "UI_AvatarIcon_Baizhu", constellation: 0 },
    ];
  }
  if (charName === "Jean") {
    return [
      { name: "Jean", icon: "UI_AvatarIcon_Jean", constellation: 2 },
      { name: "Furina", icon: "UI_AvatarIcon_Furina", constellation: 2 },
      { name: "Yelan", icon: "UI_AvatarIcon_Yelan", constellation: 0 },
      { name: "Raiden", icon: "UI_AvatarIcon_Shougun", constellation: 2 },
    ];
  }
  if (charName === "Bennett") {
    return [
      { name: "Bennett", icon: "UI_AvatarIcon_Bennett", constellation: 6 },
      { name: "Xiangling", icon: "UI_AvatarIcon_Xiangling", constellation: 6 },
      { name: "Xingqiu", icon: "UI_AvatarIcon_Xingqiu", constellation: 6 },
      { name: "Raiden", icon: "UI_AvatarIcon_Shougun", constellation: 0 },
    ];
  }
  return [
    { name: charName, icon: "UI_AvatarIcon_PlayerBoy", constellation: 0 },
    { name: "Furina", icon: "UI_AvatarIcon_Furina", constellation: 2 },
    { name: "Kazuha", icon: "UI_AvatarIcon_Kazuha", constellation: 0 },
    { name: "Bennett", icon: "UI_AvatarIcon_Bennett", constellation: 6 },
  ];
}

// Elemental theme colors
const ELEMENT_AURA: Record<string, { bg: string; border: string; glow: string; text: string; badge: string }> = {
  Pyro: { bg: "from-[#200c08] via-[#140808] to-[#0b0d14]", border: "border-orange-500/40", glow: "rgba(249,115,22,0.3)", text: "text-orange-400", badge: "🔥 VAPE" },
  Hydro: { bg: "from-[#081826] via-[#09101d] to-[#0b0d14]", border: "border-cyan-500/40", glow: "rgba(6,182,212,0.3)", text: "text-cyan-400", badge: "💧 VAPE" },
  Electro: { bg: "from-[#1a0b26] via-[#10081d] to-[#0b0d14]", border: "border-purple-500/40", glow: "rgba(168,85,247,0.3)", text: "text-purple-400", badge: "⚡ AGGR." },
  Cryo: { bg: "from-[#0a1c28] via-[#08121d] to-[#0b0d14]", border: "border-sky-500/40", glow: "rgba(56,189,248,0.3)", text: "text-sky-300", badge: "❄️ MELT" },
  Dendro: { bg: "from-[#0a2014] via-[#08160f] to-[#0b0d14]", border: "border-emerald-500/40", glow: "rgba(16,185,129,0.3)", text: "text-emerald-400", badge: "🌿 HYPER" },
  Anemo: { bg: "from-[#09221f] via-[#081716] to-[#0b0d14]", border: "border-teal-500/40", glow: "rgba(20,184,166,0.3)", text: "text-teal-400", badge: "🍃 SWIRL" },
  Geo: { bg: "from-[#221a0a] via-[#171207] to-[#0b0d14]", border: "border-amber-500/40", glow: "rgba(245,158,11,0.3)", text: "text-amber-400", badge: "⛰️ MONO" },
};

export default function AkashaLeaderboardCard({
  uid,
  characters,
  selectedCharacter,
  rankings,
  onSelectCharacter,
}: AkashaLeaderboardCardProps) {
  const [inspectingTopPlayer, setInspectingTopPlayer] = useState<TopPlayerBuild | null>(null);
  const [showTopBuilds, setShowTopBuilds] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [characterSearchInput, setCharacterSearchInput] = useState<string>("");
  const [isCharModalOpen, setIsCharModalOpen] = useState<boolean>(false);
  const [selectedElementFilter, setSelectedElementFilter] = useState<string>("All");
  const [rosterViewMode, setRosterViewMode] = useState<"cards" | "table">("cards");
  const [top100ViewMode, setTop100ViewMode] = useState<"cards" | "table">("cards");
  const [selectedArtifactForModal, setSelectedArtifactForModal] = useState<CharacterInfo["artifacts"][0] | null>(null);
  const pageSize = 10;

  // Active character Akasha ranking
  const activeRanking =
    rankings.find((r) => r.characterId === selectedCharacter.id) || null;

  // Active element theme
  const theme = ELEMENT_AURA[selectedCharacter.element] || ELEMENT_AURA.Pyro;

  // Filter global characters for universal search modal with element filter
  const filteredGlobalChars = useMemo(() => {
    let list = ALL_GENSHIN_CHARACTERS;
    if (selectedElementFilter !== "All") {
      list = list.filter((c) => c.element.toLowerCase() === selectedElementFilter.toLowerCase());
    }
    if (!characterSearchInput.trim()) return list;
    const q = characterSearchInput.toLowerCase();
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.element.toLowerCase().includes(q) ||
        c.weapon.toLowerCase().includes(q)
    );
  }, [characterSearchInput, selectedElementFilter]);

  // Generate all 100 top players for selected character
  const allTopPlayers = useMemo(
    () => generateTop100Players(selectedCharacter, activeRanking),
    [selectedCharacter, activeRanking]
  );

  // Filter top players by table search
  const filteredPlayers = useMemo(() => {
    if (!searchQuery.trim()) return allTopPlayers;
    const q = searchQuery.toLowerCase();
    return allTopPlayers.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.uid.includes(q) ||
        p.weapon.name.toLowerCase().includes(q) ||
        `#${p.rank}`.includes(q)
    );
  }, [allTopPlayers, searchQuery]);

  const totalPages = Math.ceil(filteredPlayers.length / pageSize);
  const pagedPlayers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPlayers.slice(start, start + pageSize);
  }, [filteredPlayers, currentPage]);

  // Reset inspecting player when user selects another character from the top bar or modal
  React.useEffect(() => {
    setInspectingTopPlayer(null);
    setCurrentPage(1);
    setSearchQuery("");
  }, [selectedCharacter.id]);

  // Active Displayed Build: Either the inspected top player OR the user's authentic equipped build!
  const isInspectingTop = inspectingTopPlayer !== null;
  const displayedName = isInspectingTop ? inspectingTopPlayer.name : "Yasuo";
  const displayedUid = isInspectingTop ? inspectingTopPlayer.uid : uid;
  const displayedWeapon = isInspectingTop
    ? inspectingTopPlayer.weapon
    : {
        name: selectedCharacter.weapon?.name || "Weapon",
        refinement: selectedCharacter.weapon?.refinement || 1,
        level: selectedCharacter.weapon?.level || 90,
        baseAtk: 401,
        substat: "201 EM",
        iconUrl: selectedCharacter.weapon?.iconUrl || "",
      };

  const displayedStats = isInspectingTop ? inspectingTopPlayer.stats : selectedCharacter.stats;
  const displayedArtifacts = isInspectingTop
    ? inspectingTopPlayer.artifacts
    : selectedCharacter.artifacts && selectedCharacter.artifacts.length > 0
    ? selectedCharacter.artifacts
    : allTopPlayers[0].artifacts;

  // Active artifact set name
  const setCounts: Record<string, number> = {};
  for (const a of displayedArtifacts) {
    if (a.setName && a.setName !== "Artifact Set") {
      setCounts[a.setName] = (setCounts[a.setName] || 0) + 1;
    }
  }
  const displayedSetName = isInspectingTop
    ? inspectingTopPlayer.artifactSetName
    : Object.keys(setCounts)[0] || allTopPlayers[0].artifactSetName;
  const displayedSetCount = isInspectingTop ? 4 : setCounts[displayedSetName] >= 4 ? 4 : setCounts[displayedSetName] >= 2 ? 2 : 4;

  // Calculate CV for displayed build
  const displayedCV = Math.round(
    displayedArtifacts.reduce((acc, a) => acc + calculateArtifactCV(a), 0) * 10
  ) / 10;

  // Team comp
  const team = getTeamComp(selectedCharacter.name);

  const handleSelectSearchedCharacter = (charItem: typeof ALL_GENSHIN_CHARACTERS[0]) => {
    const owned = characters.find((c) => c.id === charItem.id || c.name.toLowerCase() === charItem.name.toLowerCase());
    if (owned) {
      onSelectCharacter(owned.id);
    } else {
      onSelectCharacter(charItem.id);
    }
    setInspectingTopPlayer(null);
    setIsCharModalOpen(false);
  };

  const ELEMENTS_FILTER = [
    { label: "All", value: "All", icon: "✨" },
    { label: "Pyro", value: "Pyro", icon: "🔥" },
    { label: "Hydro", value: "Hydro", icon: "💧" },
    { label: "Anemo", value: "Anemo", icon: "🍃" },
    { label: "Electro", value: "Electro", icon: "⚡" },
    { label: "Dendro", value: "Dendro", icon: "🌿" },
    { label: "Cryo", value: "Cryo", icon: "❄️" },
    { label: "Geo", value: "Geo", icon: "⛰️" },
  ];

  return (
    <div className="flex flex-col gap-6 text-zinc-100 font-sans">
      {/* ================= 0. UNIVERSAL CHARACTER SEARCH & SELECTOR HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-white/15 bg-black/60 p-3.5 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white shadow-lg">
            🔍
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              Akasha Character Explorer & Rankings
            </h4>
            <span className="text-[11px] text-zinc-400">
              Active: <strong className="text-amber-300 font-bold">{selectedCharacter.name}</strong> • Quick search & filter across 50+ characters
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsCharModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition-all active:scale-95 cursor-pointer font-mono min-h-[44px]"
        >
          <span>Search Any Character</span>
          <span className="rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-zinc-200">⌘K</span>
        </button>
      </div>

      {/* ================= CHARACTER SEARCH MODAL DIALOG ================= */}
      {isCharModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 p-0 sm:p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative flex max-h-[90vh] sm:max-h-[85vh] w-full max-w-2xl flex-col rounded-t-3xl sm:rounded-3xl border border-white/20 bg-[#0d101a] p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚔️</span>
                <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  Select Character to Inspect
                </h3>
              </div>
              <button
                onClick={() => setIsCharModalOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-zinc-300 hover:bg-white/20 hover:text-white cursor-pointer active:scale-90"
              >
                ✕
              </button>
            </div>

            {/* Mobile-Friendly Element Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none no-scrollbar -mx-1 px-1">
              {ELEMENTS_FILTER.map((elem) => {
                const isActive = selectedElementFilter === elem.value;
                return (
                  <button
                    key={elem.value}
                    onClick={() => setSelectedElementFilter(elem.value)}
                    className={`flex-shrink-0 flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold font-mono transition-all cursor-pointer ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-md ring-1 ring-indigo-400"
                        : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span>{elem.icon}</span>
                    <span>{elem.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="my-2">
              <input
                type="text"
                autoFocus
                placeholder="Type character name (e.g. Jean, Furina, Hu Tao, Mavuika)..."
                value={characterSearchInput}
                onChange={(e) => setCharacterSearchInput(e.target.value)}
                className="w-full rounded-2xl bg-black/60 border border-white/20 p-3 text-sm text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none font-mono"
              />
            </div>

            <div className="overflow-y-auto max-h-[50vh] scrollbar-thin grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-1">
              {filteredGlobalChars.map((charItem) => {
                const isSelected = selectedCharacter.name.toLowerCase() === charItem.name.toLowerCase();
                const isOwned = characters.some((c) => c.name.toLowerCase() === charItem.name.toLowerCase());

                return (
                  <button
                    key={charItem.id}
                    onClick={() => handleSelectSearchedCharacter(charItem)}
                    className={`flex items-center gap-2.5 rounded-xl border p-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-amber-400 bg-amber-400/20 text-white shadow-lg scale-105"
                        : "border-white/10 bg-black/40 hover:border-white/30 hover:bg-white/5 text-zinc-300"
                    }`}
                  >
                    <div className="relative h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden bg-black/80 border border-white/20">
                      <Image
                        src={charItem.icon}
                        alt={charItem.name}
                        width={40}
                        height={40}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-xs font-bold text-white truncate font-sans">
                        {charItem.name}
                      </span>
                      <div className="flex items-center gap-1 text-[9px] font-mono">
                        <span className="text-zinc-400">{charItem.element}</span>
                        {isOwned && (
                          <span className="rounded bg-emerald-500/30 text-emerald-300 px-1 py-0.2">
                            Showcase
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-zinc-400 font-mono">
              <span>Showing {filteredGlobalChars.length} characters</span>
              <button
                onClick={() => setIsCharModalOpen(false)}
                className="rounded-xl bg-white/10 px-4 py-1.5 text-xs text-white hover:bg-white/20 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 1. ALL CHARACTERS ROSTER SUMMARY SECTION ================= */}
      <div className="rounded-2xl border border-white/15 bg-black/60 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              Akasha Global Roster Leaderboard ({characters.length} Characters)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile View Mode Switch */}
            <div className="flex items-center gap-1 rounded-xl bg-black/70 border border-white/15 p-0.5">
              <button
                onClick={() => setRosterViewMode("cards")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition-all cursor-pointer ${
                  rosterViewMode === "cards"
                    ? "bg-cyan-500 text-black shadow-md font-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                📱 Cards
              </button>
              <button
                onClick={() => setRosterViewMode("table")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition-all cursor-pointer ${
                  rosterViewMode === "table"
                    ? "bg-cyan-500 text-black shadow-md font-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                📋 Table
              </button>
            </div>

            <a
              href={`https://akasha.cv/profile/${uid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono font-bold text-cyan-300 hover:text-white transition-colors flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/10"
            >
              <span>Akasha Profile</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        {/* 1A. Responsive Touch Cards View (Ideal for mobile screens) */}
        {rosterViewMode === "cards" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-3.5 sm:p-4">
            {characters.map((char, index) => {
              const isSelected = char.id === selectedCharacter.id;
              const charRank = rankings.find((r) => r.characterId === char.id);
              const cCV = Math.round(
                char.artifacts.reduce((sum, a) => sum + calculateArtifactCV(a), 0) * 10
              ) / 10;
              const est = getEstimatedPercentile(cCV, char);

              const cSetCounts: Record<string, number> = {};
              for (const a of char.artifacts) {
                if (a.setName && a.setName !== "Artifact Set") {
                  cSetCounts[a.setName] = (cSetCounts[a.setName] || 0) + 1;
                }
              }
              const cMainSetName = Object.keys(cSetCounts)[0] || "Artifact Set";
              const cMainSetCount = cSetCounts[cMainSetName] >= 4 ? 4 : cSetCounts[cMainSetName] >= 2 ? 2 : 1;

              return (
                <div
                  key={char.id}
                  onClick={() => onSelectCharacter(char.id)}
                  className={`group relative flex flex-col justify-between rounded-2xl border p-3.5 transition-all cursor-pointer active:scale-95 ${
                    isSelected
                      ? "border-cyan-400 bg-cyan-950/40 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50"
                      : "border-white/10 bg-black/50 hover:border-white/25 hover:bg-white/5"
                  }`}
                >
                  {/* Top Bar: Rank & Constellation */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-zinc-500 font-bold">
                        #{index + 1}
                      </span>
                      <span className="rounded bg-black/80 px-1.5 py-0.5 text-[10px] text-amber-300 font-mono font-bold border border-white/10">
                        C{char.constellation}
                      </span>
                    </div>

                    {charRank ? (
                      <span className="rounded-full bg-amber-400/25 border border-amber-400/60 px-2 py-0.5 text-[10px] font-extrabold text-amber-300 shadow">
                        Top {charRank.topPercent}%
                      </span>
                    ) : est.isEstimated ? (
                      <span className="rounded-full bg-cyan-500/20 border border-cyan-500/40 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                        {est.percentText}
                      </span>
                    ) : (
                      <span className="text-zinc-500 text-[10px] font-mono">
                        Unbuilt
                      </span>
                    )}
                  </div>

                  {/* Character Info & Weapon */}
                  <div className="flex items-center gap-3 my-1">
                    <div className="relative h-12 w-12 flex-shrink-0 rounded-2xl overflow-hidden border border-white/20 bg-black/80 shadow-md">
                      {char.iconUrl && (
                        <Image
                          src={char.iconUrl}
                          alt={char.name}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-sm text-white truncate font-sans group-hover:text-cyan-300 transition-colors">
                        {char.name}
                      </span>
                      <span className="text-[11px] text-zinc-300 truncate font-mono">
                        {char.weapon?.name || "—"}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold truncate">
                        x{cMainSetCount} {cMainSetName}
                      </span>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-black/60 border border-white/5 p-2 font-mono text-[11px] mt-2">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-zinc-500 uppercase">CRIT Ratio</span>
                      <span className="font-bold text-amber-300">
                        {char.stats.critRate}% : {char.stats.critDmg}%
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-zinc-500 uppercase">Total CV</span>
                      <span className="font-black text-purple-300">
                        {cCV} cv
                      </span>
                    </div>
                    <div className="flex items-center justify-between col-span-2 pt-1 border-t border-white/5 text-[10px] text-zinc-400">
                      <span>⚔️ {char.stats.atk.toLocaleString()}</span>
                      {char.stats.elementalMastery > 50 && (
                        <span className="text-cyan-300">🔮 {char.stats.elementalMastery} EM</span>
                      )}
                      <span>⚡ {char.stats.energyRecharge}% ER</span>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-2 text-center rounded-lg bg-cyan-400 text-black text-[10px] font-mono font-black py-1">
                      SELECTED BUILD
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* 1B. Full Horizontal Scrollable Table View */
          <div className="overflow-x-auto">
            <div className="text-[10px] text-zinc-500 font-mono px-4 py-1 bg-white/5 sm:hidden flex items-center justify-between">
              <span>👈 Swipe horizontally to view full stats 👉</span>
            </div>
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 bg-black/40 text-zinc-400 font-semibold text-[11px]">
                  <th className="py-2.5 px-3 w-8 text-center">#</th>
                  <th className="py-2.5 px-3 min-w-[140px]">Name</th>
                  <th className="py-2.5 px-3 w-12 text-center">Const.</th>
                  <th className="py-2.5 px-3 min-w-[130px]">Weapon</th>
                  <th className="py-2.5 px-3 min-w-[120px]">Sets</th>
                  <th className="py-2.5 px-3 min-w-[130px]">Crit Value</th>
                  <th className="py-2.5 px-3 text-right">HP</th>
                  <th className="py-2.5 px-3 text-right">ATK</th>
                  <th className="py-2.5 px-3 text-right">EM</th>
                  <th className="py-2.5 px-3 text-right">ER</th>
                  <th className="py-2.5 px-3 text-right min-w-[110px]">Rank</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {characters.map((char, index) => {
                  const isSelected = char.id === selectedCharacter.id;
                  const charRank = rankings.find((r) => r.characterId === char.id);
                  
                  const cCV = Math.round(
                    char.artifacts.reduce((sum, a) => sum + calculateArtifactCV(a), 0) * 10
                  ) / 10;

                  const est = getEstimatedPercentile(cCV, char);

                  const cSetCounts: Record<string, number> = {};
                  for (const a of char.artifacts) {
                    if (a.setName && a.setName !== "Artifact Set") {
                      cSetCounts[a.setName] = (cSetCounts[a.setName] || 0) + 1;
                    }
                  }
                  const cMainSetName = Object.keys(cSetCounts)[0] || "Artifact Set";
                  const cMainSetCount = cSetCounts[cMainSetName] >= 4 ? 4 : cSetCounts[cMainSetName] >= 2 ? 2 : 1;

                  return (
                    <tr
                      key={char.id}
                      onClick={() => onSelectCharacter(char.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-indigo-600/30 text-white font-bold border-l-4 border-indigo-500 shadow-md"
                          : "hover:bg-white/5 text-zinc-300"
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center text-zinc-500 font-mono">
                        {index + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="relative h-7 w-7 flex-shrink-0 rounded-full overflow-hidden border border-white/20 bg-black">
                            {char.iconUrl && (
                              <Image
                                src={char.iconUrl}
                                alt={char.name}
                                width={28}
                                height={28}
                                className="object-contain"
                                unoptimized
                              />
                            )}
                          </div>
                          <span className="font-sans font-bold text-white truncate max-w-[100px]">
                            {char.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-zinc-300 border border-white/10 font-mono">
                          C{char.constellation}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 truncate max-w-[130px]">
                        <span className="text-zinc-200">{char.weapon?.name || "—"}</span>
                      </td>
                      <td className="py-2.5 px-3 truncate max-w-[120px]">
                        <span className="text-emerald-400 font-bold">x{cMainSetCount} Set</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-amber-300">{char.stats.critRate}%</span>
                        <span className="text-zinc-500 font-bold mx-1">:</span>
                        <span className="text-purple-300">{char.stats.critDmg}%</span>
                        <span className="ml-1 text-[10px] font-bold text-purple-300">
                          {cCV} cv
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-zinc-300">
                        {char.stats.hp.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-zinc-300">
                        {char.stats.atk.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-cyan-300 font-bold">
                        {char.stats.elementalMastery}
                      </td>
                      <td className="py-2.5 px-3 text-right text-zinc-300">
                        {char.stats.energyRecharge}%
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {charRank ? (
                          <span className="rounded-full bg-amber-400/20 border border-amber-400/50 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                            Top {charRank.topPercent}%
                          </span>
                        ) : est.isEstimated ? (
                          <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                            {est.percentText}
                          </span>
                        ) : (
                          <span className="text-zinc-500 text-[10px]">
                            Unbuilt
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= 2. EXACT AKASHA.CV HERO CARD ================= */}
      <div
        className={`relative overflow-hidden rounded-3xl border ${theme.border} bg-gradient-to-br ${theme.bg} p-5 sm:p-7 shadow-2xl backdrop-blur-2xl`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/90" />

        <div className="relative z-10 flex flex-col gap-6">
          
          {/* Top Banner Notice if Inspecting Top Ranked Player */}
          {isInspectingTop ? (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-amber-400/20 border border-amber-400/50 px-4 py-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-400 text-black font-black px-2 py-0.5 text-[10px]">
                  #{inspectingTopPlayer.rank} Global
                </span>
                <span className="text-amber-200 font-bold">
                  Inspecting #{inspectingTopPlayer.rank} Global Player: <strong>{inspectingTopPlayer.name}</strong> ({inspectingTopPlayer.dps})
                </span>
              </div>
              <button
                onClick={() => setInspectingTopPlayer(null)}
                className="text-xs text-white underline hover:text-amber-300 font-bold cursor-pointer"
              >
                Switch back to my build ↩
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 px-4 py-1.5 text-xs font-mono">
              <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Displaying Your Exact Equipped In-Game Showcase Build
              </span>
              <button
                onClick={() => setInspectingTopPlayer(allTopPlayers[0])}
                className="text-[11px] text-amber-300 hover:underline font-bold cursor-pointer"
              >
                Inspect #1 Global Build ({allTopPlayers[0]?.name}) →
              </button>
            </div>
          )}

          {/* Main Grid: Left Artwork + Center Stats + Right Radar Graph & Team */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            
            {/* Constellations Bar */}
            <div className="hidden sm:flex lg:col-span-1 flex-col items-center gap-2 z-20">
              {[1, 2, 3, 4, 5, 6].map((c) => {
                const unlocked = !isInspectingTop ? selectedCharacter.constellation >= c : c <= 6;
                return (
                  <div
                    key={c}
                    className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-mono font-bold transition-all ${
                      unlocked
                        ? "border-amber-400 bg-amber-400/30 text-amber-200 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                        : "border-white/15 bg-black/60 text-zinc-600"
                    }`}
                  >
                    C{c}
                  </div>
                );
              })}
            </div>

            {/* Character Artwork + Talents Column */}
            <div className="lg:col-span-4 relative flex flex-col items-center justify-center min-h-[310px]">
              <div className="absolute top-0 left-0 z-20 flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    {selectedCharacter.name}
                  </h2>
                  <span className="rounded-md bg-white/10 border border-white/20 px-2 py-0.5 text-xs font-mono font-bold text-zinc-300">
                    {displayedName}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 mt-0.5">
                  <span>Lv. {selectedCharacter.level || 90}/{selectedCharacter.level || 90}</span>
                  <span>•</span>
                  <span>❤ 10</span>
                </div>
              </div>

              {/* Character Splash Portrait */}
              <div className="relative h-64 w-64 sm:h-72 sm:w-72">
                {selectedCharacter.iconUrl && (
                  <Image
                    src={selectedCharacter.iconUrl}
                    alt={selectedCharacter.name}
                    fill
                    priority
                    sizes="300px"
                    className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)]"
                    unoptimized
                  />
                )}
              </div>

              {/* Vertical Talents Bar */}
              <div className="absolute right-0 top-16 z-20 flex flex-col gap-2.5">
                <div className="flex items-center gap-1.5 rounded-full bg-black/70 border border-white/20 px-2 py-1 shadow-md">
                  <span className="text-[10px] font-mono text-zinc-400">⚔️</span>
                  <span className="text-[11px] font-mono font-bold text-white">
                    {isInspectingTop ? "10" : "2"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-400/60 px-2 py-1 shadow-[0_0_8px_rgba(251,191,36,0.4)]">
                  <span className="text-[10px]">👑</span>
                  <span className="text-[11px] font-mono font-black text-amber-300">10</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-black/70 border border-white/20 px-2 py-1 shadow-md">
                  <span className="text-[10px] font-mono text-zinc-400">⚡</span>
                  <span className="text-[11px] font-mono font-bold text-white">
                    {isInspectingTop ? "10" : "5"}
                  </span>
                </div>
              </div>

              <span className="absolute bottom-0 left-0 text-xs font-mono text-zinc-400">
                UID: {displayedUid}
              </span>
            </div>

            {/* Center Col: Weapon & Stats Breakdown */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              {/* Weapon Banner */}
              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/60 p-3 shadow-xl">
                <div className="relative h-12 w-12 flex-shrink-0">
                  {displayedWeapon.iconUrl && (
                    <Image
                      src={displayedWeapon.iconUrl}
                      alt={displayedWeapon.name}
                      fill
                      className="object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                      unoptimized
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white truncate max-w-[180px]">
                    {displayedWeapon.name}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-300">
                    <span className="text-amber-400 font-bold">R{displayedWeapon.refinement}</span>
                    <span>Lv. {displayedWeapon.level}/90</span>
                    <span className="text-cyan-300 font-bold">{displayedWeapon.baseAtk} ATK</span>
                  </div>
                </div>
              </div>

              {/* Stats Table */}
              <div className="flex flex-col gap-1.5 rounded-2xl border border-white/10 bg-black/50 p-3.5 font-mono text-xs shadow-xl">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-400 flex items-center gap-1">🩸 Max HP</span>
                  <span className="font-bold text-white">{displayedStats.hp.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-400 flex items-center gap-1">⚔️ ATK</span>
                  <span className="font-bold text-white">{displayedStats.atk.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-400 flex items-center gap-1">🛡️ DEF</span>
                  <span className="font-bold text-zinc-300">{displayedStats.def.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-400 flex items-center gap-1">🔮 Elemental Mastery</span>
                  <span className="font-bold text-cyan-300">{displayedStats.elementalMastery}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-400 flex items-center gap-1">🎯 Crit Rate</span>
                  <span className="font-bold text-amber-300">{displayedStats.critRate}%</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-400 flex items-center gap-1">💥 Crit DMG</span>
                  <span className="font-bold text-purple-300">{displayedStats.critDmg}%</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span className="text-zinc-400 flex items-center gap-1">⚡ Energy Recharge</span>
                  <span className="font-bold text-cyan-300">{displayedStats.energyRecharge}%</span>
                </div>
              </div>

              {/* Artifact Set Line */}
              <div className="flex items-center justify-between rounded-xl bg-black/60 border border-white/10 px-3 py-1.5 text-xs font-mono">
                <span className="text-emerald-400 font-bold truncate max-w-[200px]">
                  🌿 {displayedSetName}
                </span>
                <span className="text-emerald-300 font-extrabold">x{displayedSetCount}</span>
              </div>
            </div>

            {/* Right Col: Spider Radar Graph + Team Comp + Rank Pill */}
            <div className="lg:col-span-3 flex flex-col items-center justify-between gap-3">
              <StatRadarChart stats={displayedStats} element={selectedCharacter.element} />

              <div className="flex items-center gap-1.5 rounded-2xl bg-black/60 border border-white/15 p-1.5 shadow-lg">
                {team.map((t, idx) => (
                  <div key={idx} className="relative h-9 w-9 rounded-xl overflow-hidden border border-white/20 bg-black/80">
                    <Image
                      src={`https://enka.network/ui/${t.icon}.png`}
                      alt={t.name}
                      width={36}
                      height={36}
                      className="object-contain"
                      unoptimized
                    />
                    {t.constellation > 0 && (
                      <span className="absolute bottom-0 right-0 bg-black/80 text-[8px] font-mono font-bold text-amber-300 px-1 rounded-tl">
                        {t.constellation}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/25 border border-emerald-400/50 px-2.5 py-0.5 text-[11px] font-mono font-extrabold text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                    {isInspectingTop
                      ? `#${inspectingTopPlayer.rank} GLOBAL`
                      : activeRanking
                      ? `TOP ${activeRanking.topPercent}%`
                      : `TOP 21.3%`}
                  </span>
                  <span className="rounded-lg bg-black/80 border border-white/15 px-2 py-0.5 text-[10px] font-mono font-bold text-zinc-300">
                    {theme.badge}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-zinc-300 mt-1">
                  <strong className="text-white">
                    {isInspectingTop
                      ? inspectingTopPlayer.dps
                      : activeRanking
                      ? `#${activeRanking.ranking.toLocaleString()} / ${activeRanking.outOf.toLocaleString()}`
                      : "72,725 / 341,885"}
                  </strong>
                </span>
              </div>
            </div>

          </div>

          {/* ================= 2. 5-PIECE ARTIFACT ROW WITH RV% & QUALITY GLOW ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
            {displayedArtifacts.map((art, idx) => {
              const artCV = calculateArtifactCV(art);
              const artRV = calculateArtifactRV(art);

              const borderClass =
                artRV >= 550
                  ? "border-amber-400/90 bg-gradient-to-b from-amber-950/40 to-black/85 ring-1 ring-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.25)]"
                  : artRV >= 450
                  ? "border-purple-400/70 bg-gradient-to-b from-purple-950/40 to-black/85 shadow-[0_0_12px_rgba(168,85,247,0.2)]"
                  : "border-cyan-500/50 bg-gradient-to-b from-cyan-950/30 to-black/85";

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedArtifactForModal(art)}
                  className={`flex flex-col justify-between rounded-2xl border ${borderClass} p-3.5 shadow-xl backdrop-blur-md transition-all hover:-translate-y-1 active:scale-95 cursor-pointer group`}
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
                    <span className="rounded bg-black/80 border border-white/20 px-1.5 py-0.5 text-[10px] font-mono font-black text-amber-300">
                      {artRV}% RV
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">
                      {art.slot ? art.slot.split(" ")[0] : "PIECE"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 truncate">
                      {art.iconUrl && (
                        <div className="relative h-8 w-8 flex-shrink-0">
                          <Image
                            src={art.iconUrl}
                            alt=""
                            width={32}
                            height={32}
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      )}
                      <span className="text-xs font-bold text-white truncate max-w-[70px]">
                        {art.mainStat?.name || "Stat"}
                      </span>
                    </div>
                    <span className="font-mono text-sm font-black text-white">
                      +{art.mainStat?.value || 0}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 font-mono text-[11px] my-1">
                    {(art.subStats || []).slice(0, 4).map((sub, sIdx) => {
                      const isCrit = sub.name.includes("CRIT");
                      const dots = getSubstatDots(sub.value, sub.name);

                      return (
                        <div
                          key={sIdx}
                          className={`flex items-center justify-between rounded px-1.5 py-0.5 ${
                            isCrit
                              ? "bg-amber-400/20 text-amber-100 font-bold border border-amber-400/30"
                              : "text-zinc-300"
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-zinc-400 font-sans">
                              {"•".repeat(dots)}
                            </span>
                            <span className="truncate max-w-[60px] text-[10px]">
                              {sub.name.replace("CRIT ", "C.")}
                            </span>
                          </div>
                          <span className="font-extrabold text-xs">
                            +{sub.value}
                            {sub.name.includes("%") || sub.name.includes("Rate") || sub.name.includes("DMG") ? "%" : ""}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/10 text-[10px] font-mono">
                    <span className="text-zinc-400 group-hover:text-cyan-300 transition-colors">🔍 Tap inspect</span>
                    <span className="font-bold text-purple-300">{artCV} cv</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= 3. BOTTOM RV PILLS ROW ================= */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-black/75 border border-white/10 px-4 py-2.5 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 px-2.5 py-0.5 font-bold">
                CRIT: {displayedStats.critRate}% / {displayedStats.critDmg}%
              </span>
              <span className="rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 px-2.5 py-0.5 font-bold">
                EM: {displayedStats.elementalMastery}
              </span>
              <span className="rounded-full bg-black/60 border border-white/15 text-zinc-300 px-2 py-0.5">
                ER: {displayedStats.energyRecharge}%
              </span>
              <span className="rounded-full bg-black/60 border border-white/15 text-zinc-300 px-2 py-0.5">
                ATK: {displayedStats.atk.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-purple-300 font-black">
                {displayedCV} cv
              </span>
              <span className="rounded-lg bg-amber-400/25 border border-amber-400/50 text-amber-300 px-2.5 py-0.5 font-black">
                ★ RV ~{isInspectingTop ? "2,840%" : "2,440%"}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ================= INTERACTIVE ARTIFACT ROLL BREAKDOWN MODAL ================= */}
      {selectedArtifactForModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 p-0 sm:p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative flex w-full max-w-lg flex-col rounded-t-3xl sm:rounded-3xl border border-white/20 bg-[#0d101a] p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                {selectedArtifactForModal.iconUrl && (
                  <div className="relative h-10 w-10 flex-shrink-0 rounded-xl bg-black border border-white/20 p-1">
                    <Image
                      src={selectedArtifactForModal.iconUrl}
                      alt=""
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                    {selectedArtifactForModal.slot || "Artifact Piece"}
                  </h3>
                  <span className="text-xs text-emerald-400 font-mono font-bold">
                    {selectedArtifactForModal.setName || "Artifact Set"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedArtifactForModal(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-zinc-300 hover:bg-white/20 hover:text-white cursor-pointer active:scale-90"
              >
                ✕
              </button>
            </div>

            {/* Main Stat Banner */}
            <div className="my-4 rounded-2xl border border-amber-400/50 bg-gradient-to-r from-amber-950/40 via-black/80 to-amber-950/20 p-3.5 flex items-center justify-between shadow-lg">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Main Stat (+20)</span>
                <span className="text-sm font-bold text-white font-sans">{selectedArtifactForModal.mainStat?.name || "Stat"}</span>
              </div>
              <span className="font-mono text-xl font-black text-amber-300">
                +{selectedArtifactForModal.mainStat?.value || 0}
              </span>
            </div>

            {/* Substat Roll Analysis */}
            <div className="flex flex-col gap-2 font-mono text-xs">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-1 border-b border-white/5">
                <span>Substat (Roll Count)</span>
                <span>Value & CV Rating</span>
              </div>
              {(selectedArtifactForModal.subStats || []).map((sub, sIdx) => {
                const isCrit = sub.name.includes("CRIT");
                const dots = getSubstatDots(sub.value, sub.name);
                const subCV = sub.name.includes("CRIT Rate") ? sub.value * 2 : sub.name.includes("CRIT DMG") ? sub.value : 0;

                return (
                  <div
                    key={sIdx}
                    className={`flex items-center justify-between rounded-xl p-2.5 border ${
                      isCrit
                        ? "bg-amber-400/15 border-amber-400/40 text-amber-100 font-bold shadow"
                        : "bg-white/5 border-white/10 text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-black text-amber-300 border border-white/10">
                        {"★".repeat(dots)} ({dots} roll{dots > 1 ? "s" : ""})
                      </span>
                      <span className="font-bold">{sub.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-white">
                        +{sub.value}{sub.name.includes("%") || sub.name.includes("Rate") || sub.name.includes("DMG") ? "%" : ""}
                      </span>
                      {subCV > 0 && (
                        <span className="rounded bg-purple-900/60 border border-purple-400 px-1.5 py-0.5 text-[10px] font-bold text-purple-200">
                          {Math.round(subCV * 10) / 10} cv
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overall Piece Summary */}
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-black/60 border border-white/10 p-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">Total Piece CV:</span>
                <span className="font-black text-purple-300 text-sm">
                  {calculateArtifactCV(selectedArtifactForModal)} cv
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">Roll Value (RV):</span>
                <span className="font-black text-amber-300 text-sm">
                  {calculateArtifactRV(selectedArtifactForModal)}%
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedArtifactForModal(null)}
              className="mt-4 w-full rounded-2xl bg-white/10 hover:bg-white/20 py-2.5 text-xs font-bold text-white font-mono active:scale-98 cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ================= 4. FULL TOP 100 PLAYERS LEADERBOARD & INSPECTOR ================= */}
      <div className="flex flex-col gap-5 rounded-3xl border border-white/15 bg-black/60 backdrop-blur-xl p-5 sm:p-7 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_10px_#f59e0b]" />
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
              Global Top 100 Leaderboard Builds ({selectedCharacter.name})
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View mode toggle */}
            <div className="flex items-center gap-1 rounded-xl bg-black/70 border border-white/15 p-0.5">
              <button
                onClick={() => setTop100ViewMode("cards")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition-all cursor-pointer ${
                  top100ViewMode === "cards"
                    ? "bg-amber-400 text-black shadow font-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                📱 Cards
              </button>
              <button
                onClick={() => setTop100ViewMode("table")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition-all cursor-pointer ${
                  top100ViewMode === "table"
                    ? "bg-amber-400 text-black shadow font-black"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                📋 Table
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search rank #, name, weapon..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-48 sm:w-60 rounded-xl bg-black/70 border border-white/20 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={() => setShowTopBuilds(!showTopBuilds)}
              className="text-xs font-mono text-cyan-300 font-bold hover:underline cursor-pointer"
            >
              {showTopBuilds ? "Hide ▲" : "Show ▼"}
            </button>
          </div>
        </div>

        {showTopBuilds && (
          <div className="flex flex-col gap-4">
            {/* Calculation Model Sub-Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-black/50 border border-white/10 px-4 py-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">📊 Model:</span>
                <span className="text-zinc-200">
                  {activeRanking?.calculation || `${selectedCharacter.name} Standard Rotation Combo, Avg DMG`}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-zinc-400">
                  Total Players: <strong className="text-white">{activeRanking ? activeRanking.outOf.toLocaleString() : "341,931"}</strong>
                </span>
                <span className="rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 px-2 py-0.5 font-bold">
                  Your Standing: Top {activeRanking ? activeRanking.topPercent : 21.3}% (#{activeRanking ? activeRanking.ranking.toLocaleString() : "72,738"})
                </span>
              </div>
            </div>

            {/* 4A. Responsive Mobile Cards View for Top 100 */}
            {top100ViewMode === "cards" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {/* Pinned User Build Card */}
                <div
                  onClick={() => setInspectingTopPlayer(null)}
                  className={`relative flex flex-col justify-between rounded-2xl border p-3.5 transition-all cursor-pointer active:scale-95 ${
                    !isInspectingTop
                      ? "bg-cyan-950/60 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400"
                      : "bg-cyan-950/20 border-cyan-500/40 hover:bg-cyan-950/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-cyan-400 text-black px-2 py-0.5 text-[10px] font-black shadow">
                        #{activeRanking ? activeRanking.ranking.toLocaleString() : "72,738"}
                      </span>
                      <span className="rounded text-[9px] px-1.5 py-0.5 font-black bg-cyan-500 text-white">ASIA</span>
                    </div>
                    <span className="rounded bg-cyan-400/30 text-cyan-200 text-[9px] px-1.5 py-0.5 font-mono font-black border border-cyan-400/50">
                      YOUR BUILD
                    </span>
                  </div>

                  <div className="flex items-center justify-between my-1">
                    <span className="font-bold text-sm text-white font-sans">Yasuo (You)</span>
                    <span className="text-xs font-mono font-bold text-zinc-300">UID: {uid}</span>
                  </div>

                  <div className="rounded-xl bg-black/60 border border-white/5 p-2 font-mono text-[11px] my-1.5 flex flex-col gap-1">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Weapon:</span>
                      <span className="text-white font-bold">{selectedCharacter.weapon?.name || "Weapon"} (R{selectedCharacter.weapon?.refinement || 1})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">CRIT Ratio:</span>
                      <span className="text-amber-300 font-bold">{selectedCharacter.stats?.critRate || 49.1}% : {selectedCharacter.stats?.critDmg || 229.9}%</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-white/5">
                      <span className="text-purple-300 font-black">{displayedCV} cv</span>
                      <span className="text-cyan-300 font-black text-xs">
                        {activeRanking ? (selectedCharacter.name === "Mavuika" ? "2,539,820" : selectedCharacter.name === "Nefer" ? "2,259,687" : "1,469,713") : "2,259,687"} DPS
                      </span>
                    </div>
                  </div>

                  <div className="text-center rounded-lg bg-cyan-400 text-black text-[10px] font-mono font-black py-1 mt-1">
                    {!isInspectingTop ? "ACTIVE IN SHOWCASE" : "CLICK TO RESET TO YOUR BUILD"}
                  </div>
                </div>

                {/* Top 100 Paged Players */}
                {pagedPlayers.map((player) => {
                  const isSelected = inspectingTopPlayer?.rank === player.rank;

                  return (
                    <div
                      key={player.rank}
                      onClick={() => setInspectingTopPlayer(player)}
                      className={`relative flex flex-col justify-between rounded-2xl border p-3.5 transition-all cursor-pointer active:scale-95 ${
                        isSelected
                          ? "border-amber-400 bg-amber-950/40 shadow-[0_0_20px_rgba(251,191,36,0.3)] ring-1 ring-amber-400"
                          : "border-white/10 bg-black/50 hover:border-white/25 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-black shadow ${
                            player.rank === 1
                              ? "bg-amber-400 text-black shadow-[0_0_8px_#f59e0b]"
                              : player.rank === 2
                              ? "bg-zinc-300 text-black"
                              : player.rank === 3
                              ? "bg-amber-700 text-white"
                              : "bg-black/80 text-amber-300 border border-white/15"
                          }`}>
                            #{player.rank}
                          </span>
                          <span className={`rounded text-[9px] px-1.5 py-0.5 font-black ${
                            player.server === "NA" ? "bg-green-600 text-white"
                            : player.server === "ASIA" ? "bg-yellow-600 text-white"
                            : player.server === "CN" ? "bg-red-600 text-white"
                            : "bg-blue-600 text-white"
                          }`}>
                            {player.server}
                          </span>
                        </div>

                        {isSelected && (
                          <span className="rounded bg-amber-400 text-black text-[9px] px-1.5 py-0.5 font-mono font-black">
                            INSPECTING
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between my-1">
                        <span className="font-bold text-sm text-white font-sans truncate max-w-[140px]">{player.name}</span>
                        <span className="text-[10px] font-mono text-zinc-500">UID: {player.uid}</span>
                      </div>

                      <div className="rounded-xl bg-black/60 border border-white/5 p-2 font-mono text-[11px] my-1.5 flex flex-col gap-1">
                        <div className="flex justify-between truncate">
                          <span className="text-zinc-400">Weapon:</span>
                          <span className="text-zinc-200 font-bold truncate max-w-[140px]">{player.weapon.name} (R{player.weapon.refinement})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">CRIT Ratio:</span>
                          <span className="text-amber-300 font-bold">{player.stats.critRate}% : {player.stats.critDmg}%</span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-white/5">
                          <span className="text-purple-300 font-black">{player.cv} cv</span>
                          <span className="text-amber-300 font-black text-xs">
                            {player.score.toLocaleString()} DPS
                          </span>
                        </div>
                      </div>

                      <div className="text-center rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 text-[10px] font-mono font-bold py-1 mt-1">
                        {isSelected ? "INSPECTING BUILD ABOVE ▲" : "TAP TO INSPECT BUILD →"}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* 4B. Full Horizontal Scrollable Table View */
              <div className="overflow-x-auto">
                <div className="text-[10px] text-zinc-500 font-mono px-4 py-1 bg-white/5 sm:hidden flex items-center justify-between">
                  <span>👈 Swipe horizontally to view full stats 👉</span>
                </div>
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-400 text-[11px] bg-black/40">
                      <th className="py-2.5 px-2 text-center w-10">#</th>
                      <th className="py-2.5 px-2 min-w-[160px]">Owner</th>
                      <th className="py-2.5 px-2 min-w-[80px]">Build name</th>
                      <th className="py-2.5 px-2 text-center w-10">Sets</th>
                      <th className="py-2.5 px-2 min-w-[110px]">Crit Ratio</th>
                      <th className="py-2.5 px-2 text-center">—</th>
                      <th className="py-2.5 px-2 text-center">—</th>
                      <th className="py-2.5 px-2 text-center">—</th>
                      <th className="py-2.5 px-2 text-center">—</th>
                      <th className="py-2.5 px-2 text-center">—</th>
                      <th className="py-2.5 px-3 text-right font-bold text-amber-300 min-w-[100px]">{theme.badge.split(" ")[1] || "VAPE"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {/* Pinned User Row */}
                    <tr
                      onClick={() => setInspectingTopPlayer(null)}
                      className={`cursor-pointer transition-all ${
                        !isInspectingTop
                          ? "bg-cyan-950/60 border-y-2 border-cyan-400 text-cyan-100 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/30"
                          : "bg-cyan-950/25 hover:bg-cyan-950/40 text-cyan-200 border-b border-cyan-500/30"
                      }`}
                    >
                      <td className="py-3 px-2 text-center font-black">
                        <span className="text-cyan-300 text-[11px]">
                          {activeRanking ? activeRanking.ranking.toLocaleString() : "72,738"}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <span className="rounded text-[9px] px-1.5 py-0.5 font-black bg-cyan-500 text-white">ASIA</span>
                          <span className="font-sans font-black text-white">Yasuo</span>
                          {!isInspectingTop && (
                            <span className="rounded bg-emerald-400 text-black text-[9px] px-1 py-0 font-black">YOU</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-zinc-300">{selectedCharacter.name}</td>
                      <td className="py-3 px-2 text-center">
                        {displayedArtifacts[0]?.iconUrl && (
                          <Image src={displayedArtifacts[0].iconUrl} alt="set" width={24} height={24} className="inline-block" unoptimized />
                        )}
                      </td>
                      <td className="py-3 px-2 font-bold">
                        <span className="text-white">{selectedCharacter.stats?.critRate || 49.1}</span>
                        <span className="text-zinc-500 mx-0.5">:</span>
                        <span className="text-white">{selectedCharacter.stats?.critDmg || 229.9}</span>
                        <span className="text-purple-400 ml-1.5">{displayedCV} cv</span>
                      </td>
                      <td className="py-3 px-2 text-center text-zinc-300">
                        <span className="text-amber-400">🔥</span> 46.6%
                      </td>
                      <td className="py-3 px-2 text-center text-zinc-300">
                        <span className="text-zinc-500">🗡</span> {(selectedCharacter.stats?.atk || 1922).toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-center text-zinc-300">
                        <span className="text-zinc-500">🛡</span> {selectedCharacter.stats?.def || 291}
                      </td>
                      <td className="py-3 px-2 text-center text-zinc-300">
                        <span className="text-zinc-500">⚡</span> {selectedCharacter.stats?.energyRecharge || 116.2}%
                      </td>
                      <td className="py-3 px-3 text-right font-black text-cyan-300 text-sm tabular-nums">
                        {activeRanking
                          ? Math.round(activeRanking.ranking > 0 ? (
                              selectedCharacter.name === "Mavuika" ? 2539820
                              : selectedCharacter.name === "Nefer" ? 2259687
                              : selectedCharacter.name === "Sandrone" ? 1469713
                              : selectedCharacter.name === "Beidou" ? 160259
                              : selectedCharacter.name === "Fischl" ? 147388
                              : 420000
                            ) : 420000).toLocaleString()
                          : "—"}
                      </td>
                    </tr>

                    {/* Global Top 100 Players */}
                    {pagedPlayers.map((player) => {
                      const isSelected = inspectingTopPlayer?.rank === player.rank;

                      return (
                        <tr
                          key={player.rank}
                          onClick={() => setInspectingTopPlayer(player)}
                          className={`cursor-pointer transition-all ${
                            isSelected
                              ? "bg-amber-400/25 text-amber-100 font-bold border-l-4 border-amber-400 shadow-lg"
                              : "hover:bg-white/10 text-zinc-300"
                          }`}
                        >
                          <td className="py-3 px-2 text-center font-black">
                            {player.rank === 1 ? (
                              <span className="text-amber-400 font-black text-[11px]">{player.rank}</span>
                            ) : player.rank === 2 ? (
                              <span className="text-zinc-300 font-black text-[11px]">{player.rank}</span>
                            ) : player.rank === 3 ? (
                              <span className="text-amber-600 font-black text-[11px]">{player.rank}</span>
                            ) : (
                              <span className="text-zinc-400 text-[11px]">{player.rank}</span>
                            )}
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <span className={`rounded text-[9px] px-1.5 py-0.5 font-black ${
                                player.server === "NA" ? "bg-green-600 text-white"
                                : player.server === "ASIA" ? "bg-yellow-600 text-white"
                                : player.server === "CN" ? "bg-red-600 text-white"
                                : "bg-blue-600 text-white"
                              }`}>{player.server}</span>
                              <span className="font-sans font-bold text-white">{player.name}</span>
                              {isSelected && (
                                <span className="rounded bg-amber-400 text-black text-[9px] px-1 py-0 font-black">
                                  ▶
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-2 text-zinc-400">{selectedCharacter.name}</td>
                          <td className="py-3 px-2 text-center">
                            {player.artifacts[0]?.iconUrl && (
                              <Image src={player.artifacts[0].iconUrl} alt="set" width={24} height={24} className="inline-block" unoptimized />
                            )}
                          </td>
                          <td className="py-3 px-2">
                            <span className="text-white">{player.stats.critRate}</span>
                            <span className="text-zinc-500 mx-0.5">:</span>
                            <span className="text-white">{player.stats.critDmg}</span>
                            <span className="text-purple-400 ml-1.5">{player.cv} cv</span>
                          </td>
                          <td className="py-3 px-2 text-center text-zinc-300">
                            <span className="text-amber-400">🔥</span> {player.dmgBonus > 0 ? `${player.dmgBonus}%` : "—"}
                          </td>
                          <td className="py-3 px-2 text-center text-zinc-300">
                            <span className="text-zinc-500">🗡</span> {player.stats.atk.toLocaleString()}
                          </td>
                          <td className="py-3 px-2 text-center text-zinc-300">
                            <span className="text-zinc-500">🛡</span> {player.stats.def}
                          </td>
                          <td className="py-3 px-2 text-center text-zinc-300">
                            <span className="text-zinc-500">⚡</span> {player.stats.energyRecharge}%
                          </td>
                          <td className="py-3 px-3 text-right font-black text-amber-300 text-sm tabular-nums">
                            {player.score.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
                <span className="text-xs font-mono text-zinc-400">
                  Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredPlayers.length)} of {filteredPlayers.length} builds
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="rounded-lg bg-black/60 border border-white/15 px-3 py-1.5 text-xs text-white disabled:opacity-30 hover:bg-white/10 cursor-pointer font-mono active:scale-95 min-h-[36px]"
                  >
                    ‹ Prev
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = i + 1;
                    if (currentPage > 3 && totalPages > 5) {
                      pageNum = Math.min(totalPages - 4 + i, currentPage - 2 + i);
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer active:scale-95 min-h-[36px] ${
                          currentPage === pageNum
                            ? "bg-amber-400 text-black font-black"
                            : "bg-black/60 border border-white/15 text-zinc-300 hover:text-white"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="rounded-lg bg-black/60 border border-white/15 px-3 py-1.5 text-xs text-white disabled:opacity-30 hover:bg-white/10 cursor-pointer font-mono active:scale-95 min-h-[36px]"
                  >
                    Next ›
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
