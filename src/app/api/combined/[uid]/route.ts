import { NextResponse } from "next/server";
import { fetchShowcase } from "@/lib/enka";
import { fetchRankings } from "@/lib/akasha";
import { getCached, setCached, deduplicate } from "@/lib/cache";
import {
  ShowcaseData,
  CharacterRanking,
  ShowcaseError,
  ShowcaseErrorCode,
} from "@/lib/types";

const UID_REGEX = /^\d{9,10}$/;

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/combined/[uid]">
) {
  const { uid } = await ctx.params;

  if (!UID_REGEX.test(uid)) {
    return NextResponse.json(
      {
        uid,
        showcase: null,
        showcaseError: "INVALID_UID" as ShowcaseErrorCode,
        ranking: null,
      },
      { status: 400 }
    );
  }

  const showcaseKey = `showcase_v2:${uid}`;
  const rankingKey = `akasha_v2:${uid}`;

  // Execute showcase fetch and ranking fetch in parallel (with ranking non-blocking timeout)
  const [showcaseResult, rankingResult] = await Promise.allSettled([
    // Showcase fetch with cache
    (async (): Promise<ShowcaseData> => {
      const cached = await getCached<ShowcaseData>(showcaseKey);
      if (cached) return cached;

      const { data, ttl } = await deduplicate(showcaseKey, () =>
        fetchShowcase(uid)
      );
      const cacheTtl = Math.max(600, ttl || 600);
      await setCached(showcaseKey, data, cacheTtl);
      return data;
    })(),

    // Ranking fetch with fast 800ms non-blocking timeout
    (async (): Promise<CharacterRanking[] | null> => {
      const cached = await getCached<CharacterRanking[] | null>(rankingKey);
      if (cached !== null) return cached;

      const rankingPromise = deduplicate(rankingKey, () => fetchRankings(uid));
      const timeoutPromise = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), 800)
      );

      const rankings = await Promise.race([rankingPromise, timeoutPromise]);
      if (rankings) {
        await setCached(rankingKey, rankings, 3600);
      }
      return rankings;
    })(),
  ]);

  let showcase: ShowcaseData | null = null;
  let showcaseError: ShowcaseErrorCode | null = null;
  let ranking: CharacterRanking[] | null = null;

  if (showcaseResult.status === "fulfilled") {
    showcase = showcaseResult.value;
  } else {
    const err = showcaseResult.reason;
    if (err instanceof ShowcaseError) {
      showcaseError = err.code;
    } else {
      showcaseError = "UPSTREAM_DOWN";
    }
  }

  if (rankingResult.status === "fulfilled") {
    ranking = rankingResult.value;
  } else {
    ranking = null;
  }

  // If showcase failed, return appropriate status code
  if (showcaseError) {
    let status = 502;
    if (showcaseError === "PRIVATE_SHOWCASE") status = 403;
    else if (showcaseError === "UID_NOT_FOUND") status = 404;
    else if (showcaseError === "UPSTREAM_RATE_LIMITED") status = 429;
    else if (showcaseError === "INVALID_UID") status = 400;

    return NextResponse.json(
      { uid, showcase: null, showcaseError, ranking },
      { status }
    );
  }

  return NextResponse.json(
    { uid, showcase, showcaseError: null, ranking },
    { status: 200 }
  );
}
