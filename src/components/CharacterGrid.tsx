"use client";

import { CharacterInfo, CharacterRanking } from "@/lib/types";
import CharacterCard from "./CharacterCard";

interface CharacterGridProps {
  uid: string;
  characters: CharacterInfo[];
  rankings?: CharacterRanking[] | null;
}

export default function CharacterGrid({
  uid,
  characters,
  rankings,
}: CharacterGridProps) {
  const rankingMap = new Map<string, CharacterRanking>();
  if (rankings) {
    for (const r of rankings) {
      rankingMap.set(r.characterId, r);
      rankingMap.set(r.characterName.toLowerCase(), r);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span>Showcase Characters</span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {characters.length}
          </span>
        </h2>
        <span className="text-xs text-zinc-400 hidden sm:inline">
          Click any character to inspect full artifact & stat build
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
        {characters.map((char) => {
          const ranking =
            rankingMap.get(char.id) ||
            rankingMap.get(char.name.toLowerCase()) ||
            null;

          return (
            <CharacterCard
              key={char.id}
              uid={uid}
              character={char}
              ranking={ranking}
            />
          );
        })}
      </div>
    </div>
  );
}
