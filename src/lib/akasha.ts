/**
 * Akasha System API Client — Defensive Implementation
 *
 * Akasha.cv does not have an official public API and endpoints may change.
 * This client runs with a strict 4000ms AbortController timeout, validates
 * with Zod, and NEVER throws unhandled errors.
 */

import { z } from "zod";
import { CharacterRanking } from "./types";

const AKASHA_API_BASE = "https://akasha.cv/api";

// Zod Schema for Akasha user calculation entry
const AkashaUserCalcSchema = z.object({
  id: z.number().optional(),
  calculationId: z.number().optional(),
  name: z.string().optional(),
  characterId: z.union([z.string(), z.number()]).optional(),
  weapon: z
    .object({
      name: z.string().optional(),
    })
    .optional(),
  ranking: z.number().optional(),
  outOf: z.number().optional(),
  topPercent: z.number().optional(),
  result: z.number().optional(),
  variant: z.string().optional(),
});

const AkashaResponseSchema = z.array(AkashaUserCalcSchema);

/**
 * Fetches ranking calculations for a UID from Akasha.cv.
 * Always fails gracefully and returns null on any error or timeout.
 */
export async function fetchRankings(
  uid: string
): Promise<CharacterRanking[] | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(`${AKASHA_API_BASE}/getCalculationsForUser/${uid}`, {
      headers: {
        "User-Agent": "akasha-py/1.0 (GenshinStats)",
        Accept: "application/json",
      },
      signal: controller.signal,
      next: { revalidate: 1200 }, // 20 mins
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(
        `[akasha] HTTP error ${res.status} for UID ${uid}: ${res.statusText}`
      );
      return null;
    }

    const rawJson = await res.json();
    const data = Array.isArray(rawJson) ? rawJson : rawJson?.data;

    if (!Array.isArray(data)) {
      return null;
    }

    // Validate with Zod
    const parseResult = AkashaResponseSchema.safeParse(data);
    if (!parseResult.success) {
      console.warn("[akasha] Zod schema validation failed:", parseResult.error);
      return null;
    }

    const validRankings: CharacterRanking[] = [];

    for (const item of parseResult.data) {
      const charName = item.name ?? "Unknown";
      const charId = String(item.characterId ?? item.id ?? "");
      const weaponName = item.weapon?.name ?? "Unknown Weapon";
      const ranking = item.ranking ?? 1;
      const outOf = item.outOf ?? 100;
      const calcId = item.calculationId ?? item.id ?? 0;

      // Calculate topPercent if not provided directly
      let topPercent = item.topPercent;
      if (topPercent === undefined && outOf > 0) {
        topPercent = parseFloat(((ranking / outOf) * 100).toFixed(1));
      }

      if (topPercent !== undefined) {
        validRankings.push({
          characterName: charName,
          characterId: charId,
          weapon: weaponName,
          topPercent: Math.max(0.1, Math.min(100, topPercent)),
          ranking,
          outOf,
          calculationId: calcId,
        });
      }
    }

    return validRankings.length > 0 ? validRankings : null;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      console.warn(`[akasha] Request timed out (>4000ms) for UID ${uid}`);
    } else {
      console.warn("[akasha] Error fetching rankings (safe fallback):", error);
    }
    return null;
  }
}
