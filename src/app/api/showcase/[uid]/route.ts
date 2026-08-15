/**
 * GET /api/showcase/[uid]
 *
 * Fetches and returns normalized character showcase data for a Genshin Impact UID.
 *
 * Responses:
 * - 200: { uid, player, characters }
 * - 400: { error: "INVALID_UID" }
 * - 403: { error: "PRIVATE_SHOWCASE" }
 * - 404: { error: "UID_NOT_FOUND" }
 * - 429: { error: "UPSTREAM_RATE_LIMITED" }
 * - 502: { error: "UPSTREAM_DOWN" }
 *
 * Headers:
 * - X-Cache: HIT | MISS
 */

import { NextResponse } from "next/server";
import { fetchShowcase } from "@/lib/enka";
import { ShowcaseError, type ShowcaseData, type ShowcaseErrorCode } from "@/lib/types";
import { getCached, setCached, deduplicate } from "@/lib/cache";

// UID must be 9 or 10 digits (different server regions)
const UID_REGEX = /^\d{9,10}$/;

/**
 * Maps our error codes to HTTP status codes.
 */
function errorCodeToStatus(code: ShowcaseErrorCode): number {
  switch (code) {
    case "INVALID_UID":
      return 400;
    case "PRIVATE_SHOWCASE":
      return 403;
    case "UID_NOT_FOUND":
      return 404;
    case "UPSTREAM_RATE_LIMITED":
      return 429;
    case "UPSTREAM_DOWN":
      return 502;
  }
}

export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/showcase/[uid]">
) {
  const { uid } = await ctx.params;

  // 1. Validate UID format before making any network call
  if (!UID_REGEX.test(uid)) {
    return NextResponse.json(
      { error: "INVALID_UID" as const },
      { status: 400 }
    );
  }

  const cacheKey = `showcase:${uid}`;

  // 2. Check cache
  try {
    const cached = await getCached<ShowcaseData>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        status: 200,
        headers: { "X-Cache": "HIT" },
      });
    }
  } catch (err) {
    console.warn("[api/showcase] Cache read error, continuing to fetch:", err);
  }

  // 3. Cache MISS — deduplicate concurrent requests for the same UID
  try {
    const { data, ttl } = await deduplicate(cacheKey, () =>
      fetchShowcase(uid)
    );

    // 4. Store in cache
    const cacheTtl = ttl && ttl > 0 ? ttl : 300;
    await setCached(cacheKey, data, cacheTtl);

    return NextResponse.json(data, {
      status: 200,
      headers: { "X-Cache": "MISS" },
    });
  } catch (error) {
    if (error instanceof ShowcaseError) {
      return NextResponse.json(
        { error: error.code },
        { status: errorCodeToStatus(error.code) }
      );
    }

    console.error("[api/showcase] Unexpected error:", error);
    return NextResponse.json(
      { error: "UPSTREAM_DOWN" as const },
      { status: 502 }
    );
  }
}
