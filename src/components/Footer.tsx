export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 text-xs text-zinc-400 mt-auto bg-[#0b0d14]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <span className="font-bold text-white tracking-wide">
            ASTRALIS <span className="text-zinc-500 font-normal">• Celestial Showcase Engine</span>
          </span>
          <span className="text-[11px] text-zinc-500 hidden sm:inline">|</span>
          <span className="text-[11px] text-zinc-400">All Genshin Impact assets © HoYoverse</span>
        </div>

        {/* Creator Signature / Hallmark Watermark */}
        <div className="flex items-center gap-2.5 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-black/60 px-4 py-2 text-xs font-mono text-zinc-300 backdrop-blur-md shadow-lg shadow-indigo-950/40">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
          </span>
          <span className="text-zinc-400">
            Engineered by <strong className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 font-black">Yasuo</strong> <span className="text-indigo-400">(@yasuo72)</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
