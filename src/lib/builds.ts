import { CharacterBuildGuide } from "@/lib/types";
import allBuildsData from "@/data/all-builds.json";
import gamedataStatic from "@/data/gamedata-static.json";

const ALL_BUILD_GUIDES = allBuildsData as unknown as Record<string, CharacterBuildGuide>;

// Precompute lowercase name to character ID map
const NAME_TO_ID_MAP: Record<string, string> = {};
for (const char of Object.values(gamedataStatic.characters)) {
  const clean = char.name.toLowerCase().replace(/[^a-z0-9]/g, "");
  NAME_TO_ID_MAP[clean] = char.id;
}

const SPECIAL_ALIAS_MAP: Record<string, string> = {
  columbina: "10000125",
  nefer: "10000122",
  sandrone: "10000133",
  kinich: "10000101",
  mualani: "10000102",
  chasca: "10000104",
  mavuika: "10000106",
  citlali: "10000107",
  xilonen: "10000103",
  emilie: "10000099",
  clorinde: "10000098",
  navia: "10000091",
  alhaitham: "10000078",
  furina: "10000089",
  neuvillette: "10000087",
  arlecchino: "10000096",
  raiden: "10000052",
  nahida: "10000073",
  kazuha: "10000047",
  zhongli: "10000030",
  hutao: "10000046",
  yelan: "10000060",
  bennett: "10000032",
  xiangling: "10000023",
  xingqiu: "10000025",
};

/**
 * Fast O(1) in-memory Build Guide resolver for all 100+ playable characters!
 */
export function getBuildGuide(characterIdOrName: string | number): CharacterBuildGuide | null {
  if (!characterIdOrName) return null;
  const key = String(characterIdOrName).trim();
  const lowerKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");

  // 1. Direct ID match
  if (ALL_BUILD_GUIDES[key]) {
    return ALL_BUILD_GUIDES[key];
  }

  // 2. Fast special alias match
  if (SPECIAL_ALIAS_MAP[lowerKey] && ALL_BUILD_GUIDES[SPECIAL_ALIAS_MAP[lowerKey]]) {
    return ALL_BUILD_GUIDES[SPECIAL_ALIAS_MAP[lowerKey]];
  }

  // 3. Fast static name lookup
  const mappedId = NAME_TO_ID_MAP[lowerKey];
  if (mappedId && ALL_BUILD_GUIDES[mappedId]) {
    return ALL_BUILD_GUIDES[mappedId];
  }

  return null;
}

export function getAllBuildGuides(): Record<string, CharacterBuildGuide> {
  return ALL_BUILD_GUIDES;
}
