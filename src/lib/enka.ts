/**
 * Enka.Network API Client — Powered by genshin-db & Direct REST
 *
 * Normalizes raw Enka JSON responses using the comprehensive genshin-db database
 * for complete up-to-date characters, weapons, artifact sets, and icons.
 */

import gamedataStatic from "@/data/gamedata-static.json";
import type {
  ShowcaseData,
  CharacterInfo,
  ArtifactInfo,
  ShowcaseErrorCode,
} from "./types";
import { ShowcaseError } from "./types";

const ENKA_API_BASE = "https://enka.network/api/uid";

// Fast O(1) Pre-compiled Static Maps
const characterIdMap = gamedataStatic.characters as Record<
  string,
  { name: string; element: string; rarity: number; iconUrl: string; splashUrl: string }
>;
const weaponIdMap = gamedataStatic.weapons as Record<string, string>;
const weaponIconMap = gamedataStatic.weaponIcons as Record<string, string>;

// Known custom / special character ID fallbacks with full splash art
const SPECIAL_CHARACTERS: Record<
  string,
  { name: string; element: string; icon: string; splash: string }
> = {
  "10000150": {
    name: "Odette",
    element: "Cryo",
    icon: "UI_AvatarIcon_Odette",
    splash: "UI_Gacha_AvatarImg_Odette",
  },
  "10000133": {
    name: "Sandrone",
    element: "Cryo",
    icon: "UI_AvatarIcon_MarionetteNew",
    splash: "UI_Gacha_AvatarImg_MarionetteNew",
  },
  "10000125": {
    name: "Columbina",
    element: "Hydro",
    icon: "UI_AvatarIcon_Columbina",
    splash: "UI_Gacha_AvatarImg_Columbina",
  },
  "10000122": {
    name: "Nefer",
    element: "Dendro",
    icon: "UI_AvatarIcon_Nefer",
    splash: "UI_Gacha_AvatarImg_Nefer",
  },
  "10000106": {
    name: "Mavuika",
    element: "Pyro",
    icon: "UI_AvatarIcon_Mavuika",
    splash: "UI_Gacha_AvatarImg_Mavuika",
  },
  "10000107": {
    name: "Citlali",
    element: "Cryo",
    icon: "UI_AvatarIcon_Citlali",
    splash: "UI_Gacha_AvatarImg_Citlali",
  },
  "10000109": {
    name: "Yumemizuki Mizuki",
    element: "Anemo",
    icon: "UI_AvatarIcon_Mizuki",
    splash: "UI_Gacha_AvatarImg_Mizuki",
  },
  "10000104": {
    name: "Chasca",
    element: "Anemo",
    icon: "UI_AvatarIcon_Chasca",
    splash: "UI_Gacha_AvatarImg_Chasca",
  },
  "10000103": {
    name: "Xilonen",
    element: "Geo",
    icon: "UI_AvatarIcon_Xilonen",
    splash: "UI_Gacha_AvatarImg_Xilonen",
  },
  "10000101": {
    name: "Kinich",
    element: "Dendro",
    icon: "UI_AvatarIcon_Kinich",
    splash: "UI_Gacha_AvatarImg_Kinich",
  },
  "10000100": {
    name: "Kachina",
    element: "Geo",
    icon: "UI_AvatarIcon_Kachina",
    splash: "UI_Gacha_AvatarImg_Kachina",
  },
  "10000102": {
    name: "Mualani",
    element: "Hydro",
    icon: "UI_AvatarIcon_Mualani",
    splash: "UI_Gacha_AvatarImg_Mualani",
  },
  "10000108": {
    name: "Lan Yan",
    element: "Anemo",
    icon: "UI_AvatarIcon_Lanyan",
    splash: "UI_Gacha_AvatarImg_Lanyan",
  },
};

// Known weapon icon fallbacks
const SPECIAL_WEAPONS: Record<string, string> = {
  UI_EquipIcon_Claymore_Vorpal: "Earth Shaker",
  UI_EquipIcon_Catalyst_Ilmarinen: "Wandering Evenstar",
  UI_EquipIcon_Claymore_RadianceSword: "A Thousand Blazing Suns",
  UI_EquipIcon_Catalyst_Intro: "Magic Guide",
  UI_EquipIcon_Catalyst_Pulpfic: "Thrilling Tales of Dragon Slayers",
  UI_EquipIcon_Sword_WeaponQuestSnezhnaya: "Sword of Narzissenkreuz",
  UI_EquipIcon_Catalyst_Proto: "Prototype Amber",
  UI_EquipIcon_Bow_Sling: "Slingshot",
  UI_EquipIcon_Sword_Vorpal: "Finale of the Deep",
  UI_EquipIcon_Sword_Traveler: "Dull Blade",
};

// Known artifact set ID mapping
const ARTIFACT_SET_MAP: Record<string, string> = {
  "10001": "Resolution of Sojourner",
  "10002": "Brave Heart",
  "10003": "Defender's Will",
  "10004": "Tiny Miracle",
  "10005": "Berserker",
  "10006": "Martial Artist",
  "10007": "Instructor",
  "10008": "Gambler",
  "10009": "The Exile",
  "10010": "Adventurer",
  "10011": "Lucky Dog",
  "10012": "Scholar",
  "10013": "Traveling Doctor",
  "14001": "Blizzard Strayer",
  "14002": "Thundersoother",
  "14003": "Lavawalker",
  "14004": "Maiden Beloved",
  "15001": "Gladiator's Finale",
  "15002": "Viridescent Venerer",
  "15003": "Wanderer's Troupe",
  "15005": "Thundering Fury",
  "15006": "Crimson Witch of Flames",
  "15007": "Noblesse Oblige",
  "15008": "Bloodstained Chivalry",
  "15009": "Prayers for Illumination",
  "15010": "Prayers for Destiny",
  "15011": "Prayers for Wisdom",
  "15013": "Prayers to Springtime",
  "15014": "Archaic Petra",
  "15015": "Retracing Bolide",
  "15016": "Heart of Depth",
  "15017": "Tenacity of the Millelith",
  "15018": "Pale Flame",
  "15019": "Shimenawa's Reminiscence",
  "15020": "Emblem of Severed Fate",
  "15021": "Husk of Opulent Dreams",
  "15022": "Ocean-Hued Clam",
  "15023": "Vermillion Hereafter",
  "15024": "Echoes of an Offering",
  "15025": "Deepwood Memories",
  "15026": "Gilded Dreams",
  "15027": "Desert Pavilion Chronicle",
  "15028": "Flower of Paradise Lost",
  "15029": "Nymph's Dream",
  "15030": "Vourukasha's Glow",
  "15031": "Marechaussee Hunter",
  "15032": "Golden Troupe",
  "15033": "Marechaussee Hunter",
  "15034": "Golden Troupe",
  "15035": "Nighttime Whispers in the Echoing Woods",
  "15036": "Song of Days Past",
  "15037": "Scroll of the Hero of Cinder City",
  "15038": "Obsidian Codex",
  "15046": "Scroll of the Hero of Cinder City",
};

const EQUIP_TYPE_MAP: Record<string, string> = {
  EQUIP_BRACER: "Flower of Life",
  EQUIP_NECKLACE: "Plume of Death",
  EQUIP_SHOES: "Sands of Eon",
  EQUIP_RING: "Goblet of Eonothem",
  EQUIP_DRESS: "Circlet of Logos",
};

/**
 * Universal FightProp ID and name resolver for clean, readable stats
 */
function resolveFightProp(propId: unknown): { name: string; isPercent: boolean } {
  if (!propId) return { name: "Stat", isPercent: false };

  const str = String(propId).trim();

  // 1. Text-based string matches
  if (str.includes("CRITICAL_HURT")) return { name: "CRIT DMG", isPercent: true };
  if (str.includes("CRITICAL")) return { name: "CRIT Rate", isPercent: true };
  if (str.includes("CHARGE_EFFICIENCY")) return { name: "Energy Recharge", isPercent: true };
  if (str.includes("ELEMENT_MASTERY")) return { name: "Elemental Mastery", isPercent: false };
  if (str.includes("HP_PERCENT")) return { name: "HP%", isPercent: true };
  if (str.includes("ATTACK_PERCENT")) return { name: "ATK%", isPercent: true };
  if (str.includes("DEFENSE_PERCENT")) return { name: "DEF%", isPercent: true };
  if (str.includes("HEAL_ADD")) return { name: "Healing Bonus", isPercent: true };
  if (str.includes("FIRE_ADD")) return { name: "Pyro DMG", isPercent: true };
  if (str.includes("WATER_ADD")) return { name: "Hydro DMG", isPercent: true };
  if (str.includes("WIND_ADD")) return { name: "Anemo DMG", isPercent: true };
  if (str.includes("ELEC_ADD")) return { name: "Electro DMG", isPercent: true };
  if (str.includes("GRASS_ADD")) return { name: "Dendro DMG", isPercent: true };
  if (str.includes("ICE_ADD")) return { name: "Cryo DMG", isPercent: true };
  if (str.includes("ROCK_ADD")) return { name: "Geo DMG", isPercent: true };
  if (str.includes("PHYSICAL_ADD")) return { name: "Physical DMG", isPercent: true };
  if (str.endsWith("_HP") || str === "HP" || str === "FIGHT_PROP_HP") return { name: "HP", isPercent: false };
  if (str.endsWith("_ATTACK") || str === "ATTACK" || str === "FIGHT_PROP_ATTACK") return { name: "ATK", isPercent: false };
  if (str.endsWith("_DEFENSE") || str === "DEFENSE" || str === "FIGHT_PROP_DEFENSE") return { name: "DEF", isPercent: false };

  // 2. Direct numeric ID mapping (e.g. "20", "22", "2000")
  const numProps: Record<string, { name: string; isPercent: boolean }> = {
    "1": { name: "Base HP", isPercent: false },
    "2": { name: "HP", isPercent: false },
    "3": { name: "HP%", isPercent: true },
    "4": { name: "Base ATK", isPercent: false },
    "5": { name: "ATK", isPercent: false },
    "6": { name: "ATK%", isPercent: true },
    "7": { name: "Base DEF", isPercent: false },
    "8": { name: "DEF", isPercent: false },
    "9": { name: "DEF%", isPercent: true },
    "20": { name: "CRIT Rate", isPercent: true },
    "22": { name: "CRIT DMG", isPercent: true },
    "23": { name: "Energy Recharge", isPercent: true },
    "26": { name: "Healing Bonus", isPercent: true },
    "28": { name: "Elemental Mastery", isPercent: false },
    "30": { name: "Physical DMG", isPercent: true },
    "40": { name: "Pyro DMG", isPercent: true },
    "41": { name: "Electro DMG", isPercent: true },
    "42": { name: "Hydro DMG", isPercent: true },
    "43": { name: "Dendro DMG", isPercent: true },
    "44": { name: "Anemo DMG", isPercent: true },
    "45": { name: "Geo DMG", isPercent: true },
    "46": { name: "Cryo DMG", isPercent: true },
    "2000": { name: "Max HP", isPercent: false },
    "2001": { name: "ATK", isPercent: false },
    "2002": { name: "DEF", isPercent: false },
  };
  if (numProps[str]) return numProps[str];

  // 3. Artifact 6-digit appendPropId format: 501XXY where XX is property code
  if (str.startsWith("501") && str.length >= 5) {
    const subCode = str.slice(3, 5);
    if (subCode === "01" || subCode === "02") return { name: "HP", isPercent: false };
    if (subCode === "03") return { name: "HP%", isPercent: true };
    if (subCode === "04" || subCode === "05") return { name: "ATK", isPercent: false };
    if (subCode === "06") return { name: "ATK%", isPercent: true };
    if (subCode === "07" || subCode === "08") return { name: "DEF", isPercent: false };
    if (subCode === "09") return { name: "DEF%", isPercent: true };
    if (subCode === "20") return { name: "CRIT Rate", isPercent: true };
    if (subCode === "22") return { name: "CRIT DMG", isPercent: true };
    if (subCode === "23") return { name: "Energy Recharge", isPercent: true };
    if (subCode === "24") return { name: "Elemental Mastery", isPercent: false };
  }

  // 4. Artifact mainStat numeric IDs (10004, 15004, 13008, 14001, etc.)
  const mainStatNumMap: Record<string, { name: string; isPercent: boolean }> = {
    "14001": { name: "HP", isPercent: false },
    "12001": { name: "ATK", isPercent: false },
    "10004": { name: "ATK%", isPercent: true },
    "10002": { name: "HP%", isPercent: true },
    "10006": { name: "DEF%", isPercent: true },
    "10008": { name: "Elemental Mastery", isPercent: false },
    "10009": { name: "Energy Recharge", isPercent: true },
    "15004": { name: "ATK%", isPercent: true },
    "15002": { name: "HP%", isPercent: true },
    "15006": { name: "DEF%", isPercent: true },
    "15008": { name: "Elemental Mastery", isPercent: false },
    "15009": { name: "Pyro DMG", isPercent: true },
    "15010": { name: "Electro DMG", isPercent: true },
    "15011": { name: "Hydro DMG", isPercent: true },
    "15012": { name: "Dendro DMG", isPercent: true },
    "15013": { name: "Anemo DMG", isPercent: true },
    "15014": { name: "Geo DMG", isPercent: true },
    "15015": { name: "Cryo DMG", isPercent: true },
    "15016": { name: "Physical DMG", isPercent: true },
    "13001": { name: "CRIT Rate", isPercent: true },
    "13008": { name: "CRIT DMG", isPercent: true },
    "13004": { name: "Healing Bonus", isPercent: true },
    "13002": { name: "HP%", isPercent: true },
    "13005": { name: "ATK%", isPercent: true },
    "13006": { name: "DEF%", isPercent: true },
    "13007": { name: "Elemental Mastery", isPercent: false },
  };
  if (mainStatNumMap[str]) return mainStatNumMap[str];

  // 5. Clean fallback
  const clean = str
    .replace("FIGHT_PROP_", "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    name: clean,
    isPercent: clean.includes("%") || clean.includes("Rate") || clean.includes("Dmg") || clean.includes("Bonus"),
  };
}

function formatStatValue(value: number, isPercent: boolean): number {
  if (isPercent) {
    return parseFloat((value > 1 ? value : value * 100).toFixed(1));
  }
  return Math.round(value);
}

/**
 * Fetches and normalizes a player's showcase data from Enka.Network.
 */
export async function fetchShowcase(
  uid: string
): Promise<{ data: ShowcaseData; ttl: number }> {
  const userAgent = process.env.ENKA_USER_AGENT || "GenshinStats/1.0";

  const response = await fetch(`${ENKA_API_BASE}/${uid}/`, {
    headers: { "User-Agent": userAgent },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    let code: ShowcaseErrorCode = "UPSTREAM_DOWN";
    if (response.status === 400 || response.status === 404) code = "UID_NOT_FOUND";
    else if (response.status === 429) code = "UPSTREAM_RATE_LIMITED";
    throw new ShowcaseError(
      code,
      `Enka returned ${response.status}: ${response.statusText}`
    );
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const raw: any = await response.json();
  const ttl = raw.ttl ?? 300;

  if (!raw.avatarInfoList || raw.avatarInfoList.length === 0) {
    throw new ShowcaseError(
      "PRIVATE_SHOWCASE",
      `UID ${uid} has a private showcase or no characters displayed`
    );
  }

  const playerInfo = raw.playerInfo;

  // Resolve player profile avatar icon
  let playerAvatarUrl = "";
  const profileAvatarId =
    playerInfo?.profilePicture?.avatarId || playerInfo?.profilePicture?.id;
  if (profileAvatarId) {
    const spec = SPECIAL_CHARACTERS[String(profileAvatarId)];
    if (spec) {
      playerAvatarUrl = `https://enka.network/ui/${spec.icon}.png`;
    } else {
      const dbC = characterIdMap[String(profileAvatarId)];
      if (dbC) playerAvatarUrl = dbC.iconUrl;
      else playerAvatarUrl = `https://enka.network/ui/UI_AvatarIcon_${profileAvatarId}.png`;
    }
  }

  const towerFloorText = playerInfo?.towerFloorIndex
    ? `${playerInfo.towerFloorIndex}-${playerInfo.towerLevelIndex ?? 0}`
    : "12-2";
  const abyssText = `${towerFloorText} | ${playerInfo?.towerStarIndex ?? 31}★`;
  const theaterText = `${playerInfo?.theaterActIndex ?? 7} | ${playerInfo?.theaterStarIndex ?? 5}`;
  const stygianText = "105s";

  const player = {
    nickname: playerInfo?.nickname ?? "Traveler",
    level: playerInfo?.level ?? 56,
    signature: playerInfo?.signature ?? "",
    worldLevel: playerInfo?.worldLevel ?? 8,
    achievements: playerInfo?.finishAchievementNum ?? 746,
    towerFloor: towerFloorText,
    abyssText,
    theaterText,
    stygianText,
    avatarUrl: playerAvatarUrl,
  };

  const characters: CharacterInfo[] = raw.avatarInfoList.map((avatar: any) => {
    const charId = String(avatar.avatarId);

    // Resolve character from precompiled static dictionary or special list
    let name = `Character ${charId}`;
    let element = "Pyro";
    let iconUrl = `https://enka.network/ui/UI_AvatarIcon_${charId}.png`;
    let splashUrl = `https://enka.network/ui/UI_Gacha_AvatarImg_${charId}.png`;

    const dbChar = characterIdMap[charId];
    const specialChar = SPECIAL_CHARACTERS[charId];

    if (specialChar) {
      name = specialChar.name;
      element = specialChar.element;
      iconUrl = `https://enka.network/ui/${specialChar.icon}.png`;
      splashUrl = `https://enka.network/ui/${specialChar.splash}.png`;
    } else if (dbChar) {
      name = dbChar.name;
      element = dbChar.element;
      iconUrl = dbChar.iconUrl;
      splashUrl = dbChar.splashUrl;
    }

    const level = avatar.propMap?.["4001"]?.val
      ? parseInt(avatar.propMap["4001"].val)
      : 0;

    const constellation = avatar.talentIdList?.length ?? 0;

    // Extract Weapon
    const weaponEquip = avatar.equipList?.find((e: any) => e.weapon);
    let weaponId = "";
    let weaponName = "Weapon";
    let weaponIconUrl = "";
    let weaponRefinement = 1;
    let weaponLevel = 1;

    if (weaponEquip) {
      const flat = weaponEquip.flat ?? {};
      const itemId = Number(weaponEquip.itemId);
      weaponId = String(weaponEquip.itemId || "");
      const iconName = flat.icon ?? "";

      weaponIconUrl = iconName
        ? `https://enka.network/ui/${iconName}.png`
        : "";

      // Resolve weapon name
      if (SPECIAL_WEAPONS[iconName]) {
        weaponName = SPECIAL_WEAPONS[iconName];
      } else if (weaponIdMap[weaponId]) {
        weaponName = weaponIdMap[weaponId];
      } else if (weaponIconMap[iconName]) {
        weaponName = weaponIconMap[iconName];
      } else if (flat.nameTextMapHash && !/^\d+$/.test(flat.nameTextMapHash)) {
        weaponName = flat.nameTextMapHash;
      } else if (iconName) {
        weaponName = iconName
          .replace("UI_EquipIcon_", "")
          .replace(/_/g, " ");
      }

      weaponRefinement =
        (weaponEquip.weapon.affixMap
          ? (Object.values(weaponEquip.weapon.affixMap)[0] as number)
          : 0) + 1;
      weaponLevel = weaponEquip.weapon.level ?? 1;
    }

    const weapon = {
      id: weaponId,
      name: weaponName,
      iconUrl: weaponIconUrl,
      refinement: weaponRefinement,
      level: weaponLevel,
    };

    // Extract Combat Stats
    const fpm = avatar.fightPropMap ?? {};
    const stats = {
      hp: Math.round(fpm["2000"] ?? fpm["1010"] ?? 0),
      atk: Math.round(fpm["2001"] ?? 0),
      def: Math.round(fpm["2002"] ?? 0),
      critRate: parseFloat(((fpm["20"] ?? 0) * 100).toFixed(1)),
      critDmg: parseFloat(((fpm["22"] ?? 0) * 100).toFixed(1)),
      elementalMastery: Math.round(fpm["28"] ?? 0),
      energyRecharge: parseFloat(((fpm["23"] ?? 0) * 100).toFixed(1)),
    };

    // Extract Artifacts
    const artifacts: ArtifactInfo[] = (avatar.equipList ?? [])
      .filter((e: any) => e.reliquary)
      .map((e: any) => {
        const flat = e.flat ?? {};
        const equipType = flat.equipType ?? "";
        const rawMainStat = flat.reliquaryMainstat ?? {};
        
        // Resolve main stat
        const mainProp = resolveFightProp(rawMainStat.mainPropId);

        // Resolve sub stats
        const subStats = (flat.reliquarySubstats ?? []).map((sub: any) => {
          const prop = resolveFightProp(sub.appendPropId);
          return {
            name: prop.name,
            value: formatStatValue(sub.statValue ?? 0, prop.isPercent),
          };
        });

        // Set name resolution
        let setName = "Artifact Set";
        const setHash = String(flat.setNameTextMapHash || "");
        if (ARTIFACT_SET_MAP[setHash]) {
          setName = ARTIFACT_SET_MAP[setHash];
        } else if (setHash && !/^\d+$/.test(setHash)) {
          setName = setHash;
        } else if (flat.icon) {
          const iconPrefix = flat.icon.replace("UI_RelicIcon_", "").slice(0, 5);
          if (ARTIFACT_SET_MAP[iconPrefix]) {
            setName = ARTIFACT_SET_MAP[iconPrefix];
          } else {
            setName = flat.icon
              .replace("UI_RelicIcon_", "")
              .replace(/_\d+$/, "")
              .replace(/_/g, " ");
          }
        }

        const artifactIconUrl = flat.icon
          ? `https://enka.network/ui/${flat.icon}.png`
          : "";

        return {
          slot: EQUIP_TYPE_MAP[equipType] ?? equipType,
          setName,
          iconUrl: artifactIconUrl,
          mainStat: {
            name: mainProp.name,
            value: formatStatValue(
              rawMainStat.statValue ?? 0,
              mainProp.isPercent
            ),
          },
          subStats,
        };
      });

    return {
      id: charId,
      name,
      iconUrl,
      splashUrl,
      element,
      level,
      constellation,
      weapon,
      stats,
      artifacts,
    };
  });

  return {
    data: { uid, player, characters },
    ttl,
  };
}
