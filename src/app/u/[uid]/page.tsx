"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import useSWR from "swr";
import Navbar from "@/components/Navbar";
import PlayerHeaderCard from "@/components/PlayerHeaderCard";
import CharacterSelectorBar from "@/components/CharacterSelectorBar";
import EnkaShowcaseCard from "@/components/EnkaShowcaseCard";
import CharacterGuideTab from "@/components/CharacterGuideTab";
import BuildGuideSection from "@/components/BuildGuideSection";
import AkashaLeaderboardCard from "@/components/AkashaLeaderboardCard";
import CharacterGrid from "@/components/CharacterGrid";
import { ShowcaseSkeleton } from "@/components/SkeletonCard";
import ErrorState from "@/components/ErrorState";
import Footer from "@/components/Footer";
import { fetcher, FetchError } from "@/lib/fetcher";
import { CombinedResponse, ShowcaseErrorCode } from "@/lib/types";
import { getBuildGuide } from "@/lib/builds";

interface PageProps {
  params: Promise<{ uid: string }>;
}

export default function ShowcasePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const uid = resolvedParams.uid;

  const isInvalidFormat = !/^\d{9,10}$/.test(uid);

  // SWR fetch from the combined endpoint
  const { data, error, isLoading, mutate } = useSWR<CombinedResponse>(
    isInvalidFormat ? null : `/api/combined/${uid}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  );

  const [viewMode, setViewMode] = useState<"card" | "guide" | "akasha" | "grid">("card");
  const [selectedCharId, setSelectedCharId] = useState<string>("");

  // Persist last valid search to localStorage
  useEffect(() => {
    if (data?.showcase?.player) {
      try {
        localStorage.setItem(
          "genshin_last_user",
          JSON.stringify({
            uid: data.uid,
            nickname: data.showcase.player.nickname,
            ar: data.showcase.player.level,
          })
        );
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [data]);

  // Set initial selected character
  useEffect(() => {
    if (data?.showcase?.characters && data.showcase.characters.length > 0) {
      if (!selectedCharId) {
        setSelectedCharId(data.showcase.characters[0].id);
      }
    }
  }, [data, selectedCharId]);

  let content: React.ReactNode = null;

  if (isInvalidFormat) {
    content = <ErrorState error="INVALID_UID" uid={uid} />;
  } else if (isLoading) {
    content = <ShowcaseSkeleton />;
  } else if (error) {
    const fetchErr = error as FetchError;
    const info = fetchErr.info as
      | { code?: ShowcaseErrorCode; showcaseError?: ShowcaseErrorCode }
      | undefined;
    const errCode: ShowcaseErrorCode =
      info?.code ?? info?.showcaseError ?? "UID_NOT_FOUND";
    content = (
      <ErrorState error={errCode} uid={uid} onRetry={() => mutate()} />
    );
  } else if (!data || !data.showcase || data.showcase.characters.length === 0) {
    content = (
      <ErrorState
        error="PRIVATE_SHOWCASE"
        uid={uid}
        onRetry={() => mutate()}
      />
    );
  } else {
    const characters = data.showcase.characters;
    const activeChar =
      characters.find((c) => c.id === selectedCharId) || characters[0];
    const activeRanking =
      data.ranking?.find((r) => r.characterId === activeChar?.id) || null;

    content = (
      <div className="flex flex-col gap-6">
        {/* Top Profile Summary Card */}
        <PlayerHeaderCard
          uid={data.uid}
          player={data.showcase.player}
          onRefresh={() => mutate()}
        />

        {/* Character Selector Carousel & View Switcher */}
        {characters.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Characters in Showcase ({characters.length})
              </span>
              <div className="flex flex-nowrap sm:flex-wrap items-center gap-1.5 bg-black/40 border border-white/10 p-1 rounded-xl overflow-x-auto scrollbar-none">
                <button
                  onClick={() => setViewMode("card")}
                  className={`flex-shrink-0 rounded-lg px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                    viewMode === "card"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Showcase View
                </button>
                <button
                  onClick={() => setViewMode("guide")}
                  className={`flex-shrink-0 rounded-lg px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                    viewMode === "guide"
                      ? "bg-cyan-600 text-white shadow-md"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Build Guide
                </button>
                <button
                  onClick={() => setViewMode("akasha")}
                  className={`flex-shrink-0 rounded-lg px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                    viewMode === "akasha"
                      ? "bg-amber-600 text-white shadow-md"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Akasha Rankings
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex-shrink-0 rounded-lg px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Grid View
                </button>
              </div>
            </div>

            <CharacterSelectorBar
              characters={characters}
              selectedId={activeChar?.id || ""}
              onSelect={(id) => {
                setSelectedCharId(id);
              }}
            />
          </div>
        )}

        {/* Active Character Showcase Card or Guide or Akasha Ranking or Grid View */}
        {viewMode === "card" && activeChar ? (
          <div className="mt-2">
            <EnkaShowcaseCard
              uid={data.uid}
              character={activeChar}
              ranking={activeRanking}
            />
          </div>
        ) : viewMode === "guide" && activeChar ? (
          <div className="mt-2 flex flex-col gap-8">
            <BuildGuideSection
              characterId={activeChar.id}
              characterName={activeChar.name}
              userConstellation={activeChar.constellation}
              userWeaponId={activeChar.weapon?.id}
              userWeaponName={activeChar.weapon?.name}
            />
            <CharacterGuideTab character={activeChar} />
          </div>
        ) : viewMode === "akasha" && activeChar ? (
          <div className="mt-2">
            <AkashaLeaderboardCard
              uid={data.uid}
              character={activeChar}
              ranking={activeRanking}
            />
          </div>
        ) : (
          <div className="mt-4">
            <CharacterGrid
              uid={data.uid}
              characters={data.showcase.characters}
              rankings={data.ranking}
            />
          </div>
        )}
      </div>
    );
  }

  const [bgError, setBgError] = useState(false);

  const activeChar =
    data?.showcase?.characters.find((c) => c.id === selectedCharId) ||
    data?.showcase?.characters[0];

  return (
    <div className="relative min-h-screen bg-[#0b0d14] text-zinc-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      {/* Dynamic Full-Page Character Poster Atmosphere (Steady) */}
      {activeChar?.splashUrl && !bgError && (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-40">
          <div className="relative h-full w-full">
            <Image
              src={activeChar.splashUrl}
              alt=""
              fill
              className="object-cover object-top scale-110 filter blur-[1px] saturate-150 brightness-110"
              onError={() => setBgError(true)}
              priority
              unoptimized
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0d14]/70 via-[#0b0d14]/85 to-[#0b0d14]" />
        </div>
      )}

      <Navbar currentUid={uid} />
      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        {content}
      </main>
      <Footer />
    </div>
  );
}
