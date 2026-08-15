"use client";

import Image from "next/image";
import { useState } from "react";
import { CharacterInfo } from "@/lib/types";

interface CharacterSelectorBarProps {
  characters: CharacterInfo[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const ELEMENT_BORDER_COLORS: Record<string, string> = {
  Pyro: "border-orange-500",
  Hydro: "border-sky-500",
  Anemo: "border-teal-400",
  Electro: "border-purple-500",
  Dendro: "border-lime-500",
  Cryo: "border-cyan-300",
  Geo: "border-amber-400",
};

export default function CharacterSelectorBar({
  characters,
  selectedId,
  onSelect,
}: CharacterSelectorBarProps) {
  return (
    <div className="w-full overflow-x-auto py-2 scrollbar-none flex items-center justify-start sm:justify-center gap-3 sm:gap-4 px-2">
      {characters.map((char) => {
        const isSelected = char.id === selectedId;
        const elemBorder =
          ELEMENT_BORDER_COLORS[char.element] || "border-indigo-500";

        return (
          <button
            key={char.id}
            onClick={() => onSelect(char.id)}
            className={`group relative flex flex-col items-center flex-shrink-0 transition-all duration-300 cursor-pointer ${
              isSelected ? "scale-110 -translate-y-1" : "opacity-75 hover:opacity-100 hover:scale-105"
            }`}
            title={`${char.name} (Lv. ${char.level})`}
          >
            {/* Avatar Circle Frame */}
            <div
              className={`relative h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 overflow-hidden bg-black/60 shadow-lg transition-all ${
                isSelected
                  ? `${elemBorder} ring-4 ring-white/20 shadow-[0_0_20px_rgba(255,255,255,0.25)]`
                  : "border-white/20 hover:border-white/50"
              }`}
            >
              {char.iconUrl ? (
                <Image
                  src={char.iconUrl}
                  alt={char.name}
                  fill
                  sizes="64px"
                  className="object-contain p-0.5"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
                  {char.name[0]}
                </div>
              )}
            </div>

            {/* Level Pill Badge */}
            <span
              className={`-mt-2 z-10 rounded-full px-2 py-0.2 text-[10px] font-mono font-bold shadow-md transition-all ${
                isSelected
                  ? "bg-white text-black font-extrabold"
                  : "bg-black/80 text-zinc-300 border border-white/20"
              }`}
            >
              {char.level}
            </span>
          </button>
        );
      })}
    </div>
  );
}
