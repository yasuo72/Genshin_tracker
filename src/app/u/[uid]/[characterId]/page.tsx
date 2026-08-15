"use client";

import { use } from "react";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import StatPanel from "@/components/StatPanel";
import ArtifactList from "@/components/ArtifactList";
import RankingSection from "@/components/RankingSection";
import CharacterGuideTab from "@/components/CharacterGuideTab";
import BuildGuideSection from "@/components/BuildGuideSection";
import { getBuildGuide } from "@/lib/builds";
import { ShowcaseSkeleton } from "@/components/SkeletonCard";
import ErrorState from "@/components/ErrorState";
import Footer from "@/components/Footer";
import { fetcher } from "@/lib/fetcher";
import { CombinedResponse } from "@/lib/types";

interface CharacterDetailPageProps {
  params: Promise<{ uid: string; characterId: string }>;
}

export default function CharacterDetailPage({
  params,
}: CharacterDetailPageProps) {
  const resolvedParams = use(params);
  const { uid, characterId } = resolvedParams;

  // SWR fetch (reuses cached combined response)
  const { data, error, isLoading } = useSWR<CombinedResponse>(
    `/api/combined/${uid}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0d14] text-zinc-100 flex flex-col">
        <Navbar currentUid={uid} />
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
          <ShowcaseSkeleton />
        </main>
      </div>
    );
  }

  if (error || !data || !data.showcase) {
    return (
      <div className="min-h-screen bg-[#0b0d14] text-zinc-100 flex flex-col">
        <Navbar currentUid={uid} />
        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
          <ErrorState error="UID_NOT_FOUND" uid={uid} />
        </main>
      </div>
    );
  }

  const { showcase, ranking } = data;
  const character = showcase.characters.find(
    (c) =>
      c.id === characterId ||
      c.name.toLowerCase() === characterId.toLowerCase()
  );

  if (!character) {
    return (
      <div className="min-h-screen bg-[#0b0d14] text-zinc-100 flex flex-col">
        <Navbar currentUid={uid} />
        <main className="mx-auto w-full max-w-7xl px-4 py-12 text-center">
          <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white mb-2">
              Character Not Found in Showcase
            </h2>
            <p className="text-xs text-zinc-400 mb-6">
              This character is not present in {showcase.player.nickname}&apos;s current in-game showcase.
            </p>
            <Link
              href={`/u/${uid}`}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-colors"
            >
              ← Back to {showcase.player.nickname}&apos;s Showcase
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Find ranking for this character
  const charRanking =
    ranking?.find(
      (r) =>
        r.characterId === character.id ||
        r.characterName.toLowerCase() === character.name.toLowerCase()
    ) || null;

  return (
    <div className="min-h-screen bg-[#0b0d14] text-zinc-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar currentUid={uid} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={`/u/${uid}`}
            className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors group"
          >
            <svg
              className="h-4 w-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to {showcase.player.nickname}&apos;s Showcase</span>
          </Link>

          <span className="text-xs font-mono text-zinc-500">
            UID: {uid}
          </span>
        </div>

        {/* Top Split Hero: Character Portrait & Weapon (Left) + Stat Panel (Right) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 mb-10">
          {/* Left Column: Character Card / Visual Hero */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] via-white/[0.02] to-transparent p-6 sm:p-8 backdrop-blur-2xl shadow-2xl flex flex-col items-center text-center">
              {/* Constellation Badge */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="rounded-lg bg-amber-400/20 px-2.5 py-1 text-xs font-mono font-bold text-amber-300 border border-amber-400/30">
                  C{character.constellation}
                </span>
                <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-mono font-medium text-zinc-300 border border-white/10">
                  Lv. {character.level}
                </span>
              </div>

              {/* Element Tag */}
              <div className="absolute top-4 left-4">
                <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-300 border border-white/10">
                  {character.element}
                </span>
              </div>

              {/* Character Portrait */}
              <div className="relative my-6 h-44 w-44 sm:h-52 sm:w-52">
                {character.iconUrl ? (
                  <Image
                    src={character.iconUrl}
                    alt={character.name}
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white/5 text-4xl font-bold text-zinc-500">
                    {character.name[0]}
                  </div>
                )}
              </div>

              {/* Character Name */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {character.name}
              </h1>

              {/* Weapon Banner */}
              <div className="mt-6 flex w-full items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 text-left backdrop-blur-md">
                {character.weapon.iconUrl && (
                  <div className="relative h-12 w-12 flex-shrink-0">
                    <Image
                      src={character.weapon.iconUrl}
                      alt={character.weapon.name}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="truncate text-sm font-bold text-white">
                    {character.weapon.name}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mt-0.5">
                    <span className="text-amber-400 font-semibold">
                      Rank {character.weapon.refinement}
                    </span>
                    <span>•</span>
                    <span>Level {character.weapon.level}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Combat Attributes StatPanel */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <StatPanel stats={character.stats} element={character.element} />
          </div>
        </div>

        {/* Middle Section: Akasha Ranking */}
        <div className="mb-10">
          <RankingSection ranking={charRanking} characterName={character.name} />
        </div>

        {/* Bottom Section: Artifact Breakdown */}
        <div className="mb-10">
          <ArtifactList artifacts={character.artifacts} />
        </div>

        {/* Curated Build Guide */}
        <div className="mb-10">
          <BuildGuideSection
            characterId={character.id}
            characterName={character.name}
            userConstellation={character.constellation}
            userWeaponId={character.weapon?.id}
            userWeaponName={character.weapon?.name}
          />
        </div>

        {/* Extended Theorycrafting Guide */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Extended Theorycrafting Guide</span>
            </h3>
            <span className="text-xs text-zinc-400">
              Aggregated from KeqingMains, Game8 & Genshin.gg
            </span>
          </div>
          <CharacterGuideTab character={character} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
