"use client";

interface BudgetFilterProps {
  f2pOnly: boolean;
  onToggle: (f2pOnly: boolean) => void;
}

export default function BudgetFilter({ f2pOnly, onToggle }: BudgetFilterProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-black/40 p-1 shadow-inner backdrop-blur-sm">
      <button
        type="button"
        onClick={() => onToggle(false)}
        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
          !f2pOnly
            ? "bg-indigo-600 text-white shadow-md"
            : "text-zinc-400 hover:text-zinc-200"
        }`}
      >
        Show All Builds
      </button>
      <button
        type="button"
        onClick={() => onToggle(true)}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
          f2pOnly
            ? "bg-emerald-600 text-white shadow-md"
            : "text-zinc-400 hover:text-zinc-200"
        }`}
      >
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        F2P / Accessible Only
      </button>
    </div>
  );
}
