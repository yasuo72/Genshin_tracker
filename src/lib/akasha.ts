/**
 * Akasha System API Client — Real-Time Live Integration
 *
 * Connects directly to https://akasha.cv/api/getCalculationsForUser/${uid}
 * and accurately parses real-time character rankings, leaderboard categories,
 * and percentile standings.
 */

import { CharacterRanking } from "./types";

const AKASHA_API_BASE = "https://akasha.cv/api";

/**
 * Fetches real ranking calculations for a UID from Akasha.cv.
 * Returns authentic calculated leaderboard entries or null if not yet calculated.
 */
export async function fetchRankings(
  uid: string
): Promise<CharacterRanking[] | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4500);

  try {
    const res = await fetch(`${AKASHA_API_BASE}/getCalculationsForUser/${uid}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)",
        Accept: "application/json",
      },
      signal: controller.signal,
      next: { revalidate: 600 }, // 10 minutes cache
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[akasha] HTTP error ${res.status} for UID ${uid}: ${res.statusText}`);
      return null;
    }

    const rawJson = await res.json();
    const data = Array.isArray(rawJson) ? rawJson : rawJson?.data;

    if (!Array.isArray(data)) {
      return null;
    }

    const validRankings: CharacterRanking[] = [];

    for (const item of data) {
      const charId = String(item.characterId ?? item.id ?? "");
      const charName = item.name ?? "";

      // Extract real calculation from fit, first item of list, or item itself
      const calc =
        item.calculations?.fit ||
        (Array.isArray(item.calculations?.list) && item.calculations.list.length > 0
          ? item.calculations.list[0]
          : null) ||
        (item.ranking && item.outOf ? item : null);

      if (calc && typeof calc.ranking === "number" && typeof calc.outOf === "number" && calc.outOf > 0) {
        const ranking = calc.ranking;
        const outOf = calc.outOf;
        const weaponName =
          calc.weapon?.name ||
          item.weapon?.name ||
          (item.weapon?.flat?.icon ? item.weapon.flat.icon.replace("UI_EquipIcon_", "").replace(/_/g, " ") : "Weapon");
        
        const calcName = calc.name || calc.short || "Leaderboard Combo";
        const calcId = Number(calc.calculationId ?? 0);
        const topPercent = parseFloat(((ranking / outOf) * 100).toFixed(1));

        validRankings.push({
          characterName: charName,
          characterId: charId,
          weapon: weaponName,
          topPercent: Math.max(0.1, Math.min(100, topPercent)),
          ranking,
          outOf,
          calculationId: calcId,
          calculation: calcName,
        });
      }
    }

    return validRankings.length > 0 ? validRankings : null;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      console.warn(`[akasha] Request timed out (>4500ms) for UID ${uid}`);
    } else {
      console.warn("[akasha] Error fetching rankings (safe fallback):", error);
    }
    return null;
  }
}
