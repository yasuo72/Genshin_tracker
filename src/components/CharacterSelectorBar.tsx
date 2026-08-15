"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Update scroll arrow indicators
  const checkScrollability = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollability();
    window.addEventListener("resize", checkScrollability);
    return () => window.removeEventListener("resize", checkScrollability);
  }, [characters]);

  // Smoothly scroll active character into center view
  useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedId]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === "left" ? -280 : 280;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group w-full my-1">
      {/* Left Scroll Button */}
      {canScrollLeft && (
        <button
          onClick={() => handleScroll("left")}
          aria-label="Scroll Left"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/80 border border-white/20 text-white shadow-2xl backdrop-blur-md transition-all hover:bg-black hover:scale-110 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Left Gradient Edge Fade */}
      <div className={`pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-20 bg-gradient-to-r from-[#0b0d14] to-transparent transition-opacity duration-300 ${canScrollLeft ? "opacity-100" : "opacity-0"}`} />

      {/* Horizontal Carousel Container */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScrollability}
        className="w-full overflow-x-auto py-3 scrollbar-none flex items-center gap-3 sm:gap-4 px-6 sm:px-10 scroll-smooth snap-x snap-mandatory"
      >
        {characters.map((char) => {
          const isSelected = char.id === selectedId;
          const elemBorder =
            ELEMENT_BORDER_COLORS[char.element] || "border-indigo-500";

          return (
            <button
              key={char.id}
              ref={isSelected ? activeItemRef : null}
              onClick={() => onSelect(char.id)}
              className={`group/btn relative flex flex-col items-center flex-shrink-0 transition-all duration-300 cursor-pointer snap-center ${
                isSelected
                  ? "scale-115 -translate-y-1.5 z-10"
                  : "opacity-75 hover:opacity-100 hover:scale-105"
              }`}
              title={`${char.name} (Lv. ${char.level})`}
            >
              {/* Avatar Circle Frame */}
              <div
                className={`relative h-14 w-14 sm:h-16 sm:w-16 rounded-full border-2 overflow-hidden bg-black/70 shadow-xl transition-all ${
                  isSelected
                    ? `${elemBorder} ring-4 ring-white/30 shadow-[0_0_24px_rgba(255,255,255,0.4)]`
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
                    ? "bg-white text-black font-extrabold shadow-[0_0_10px_white]"
                    : "bg-black/90 text-zinc-300 border border-white/20"
                }`}
              >
                {char.level}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right Gradient Edge Fade */}
      <div className={`pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-20 bg-gradient-to-l from-[#0b0d14] to-transparent transition-opacity duration-300 ${canScrollRight ? "opacity-100" : "opacity-0"}`} />

      {/* Right Scroll Button */}
      {canScrollRight && (
        <button
          onClick={() => handleScroll("right")}
          aria-label="Scroll Right"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/80 border border-white/20 text-white shadow-2xl backdrop-blur-md transition-all hover:bg-black hover:scale-110 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
