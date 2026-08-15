export function ShowcaseSkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      {/* Player Header Skeleton */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="h-8 w-44 rounded-lg bg-white/10" />
              <div className="h-6 w-14 rounded-full bg-white/10" />
              <div className="h-6 w-14 rounded-full bg-white/10" />
            </div>
            <div className="h-4 w-28 rounded bg-white/5" />
            <div className="h-4 w-72 rounded bg-white/5" />
          </div>
          <div className="flex gap-3">
            <div className="h-14 w-32 rounded-xl bg-white/5" />
            <div className="h-14 w-32 rounded-xl bg-white/5" />
          </div>
        </div>
      </div>

      {/* Characters Header */}
      <div className="flex items-center justify-between">
        <div className="h-6 w-48 rounded bg-white/10" />
        <div className="h-4 w-36 rounded bg-white/5" />
      </div>

      {/* Character Cards Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            {/* Badges */}
            <div className="flex justify-between">
              <div className="h-5 w-14 rounded bg-white/10" />
              <div className="h-5 w-20 rounded bg-white/10" />
            </div>

            {/* Avatar Circle */}
            <div className="my-6 flex justify-center">
              <div className="h-28 w-28 rounded-full bg-white/10" />
            </div>

            {/* Name */}
            <div className="flex flex-col items-center gap-2">
              <div className="h-5 w-32 rounded bg-white/10" />
              <div className="h-3 w-16 rounded bg-white/5" />
            </div>

            {/* Weapon */}
            <div className="mt-4 h-14 w-full rounded-xl bg-white/5" />

            {/* Stats */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="h-12 rounded-lg bg-white/5" />
              <div className="h-12 rounded-lg bg-white/5" />
            </div>

            <div className="mt-4 h-4 w-full rounded bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
