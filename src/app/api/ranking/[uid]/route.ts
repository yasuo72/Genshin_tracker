import { NextResponse } from "next/server";
import { fetchRankings } from "@/lib/akasha";
import { getCached, setCached, deduplicate } from "@/lib/cache";
import { CharacterRanking } from "@/lib/types";

const UID_REGEX = /^\d{9,10}$/;

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/ranking/[uid]">
) {
  const { uid } = await ctx.params;

  if (!UID_REGEX.test(uid)) {
    return NextResponse.json({ ranking: null }, { status: 200 });
  }

  const cacheKey = `akasha:${uid}`;

  // Check cache (20 min TTL)
  try {
    const cached = await getCached<CharacterRanking[] | null>(cacheKey);
    if (cached !== null) {
      return NextResponse.json(
        { ranking: cached },
        { status: 200, headers: { "X-Cache": "HIT" } }
      );
    }
  } catch (err) {
    console.warn("[api/ranking] Cache read error:", err);
  }

  // Deduplicate and fetch fresh
  try {
    const ranking = await deduplicate(cacheKey, () => fetchRankings(uid));
    await setCached(cacheKey, ranking, 1200); // 20 minutes

    return NextResponse.json(
      { ranking },
      { status: 200, headers: { "X-Cache": "MISS" } }
    );
  } catch (err) {
    console.warn("[api/ranking] Failed safely:", err);
    return NextResponse.json({ ranking: null }, { status: 200 });
  }
}
