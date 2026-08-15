export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-6 text-center text-xs text-zinc-400 mt-auto bg-[#0b0d14]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span>GenshinStats — Real-time Character Builds & Global Showcase Engine.</span>
        <div className="flex items-center gap-4 text-zinc-400">
          <span>All Genshin Impact assets belong to HoYoverse</span>
        </div>
      </div>
    </footer>
  );
}
