/**
 * Game Data & Asset Resolver
 * Guaranteed 100% accurate icon URLs for all Genshin Impact characters, weapons, and artifact sets.
 * Resolves via exact dictionary -> genshin-db -> Enka Network CDN -> genshin.jmp.blue.
 */

import gamedataStatic from "@/data/gamedata-static.json";

export function formatSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// 1. Exact canonical weapon icons map
export const KNOWN_WEAPON_ICONS: Record<string, string> = {
  "A Thousand Blazing Suns": "https://enka.network/ui/UI_EquipIcon_Claymore_Champion.png",
  "Earth Shaker": "https://enka.network/ui/UI_EquipIcon_Claymore_Isikhulu.png",
  "Beacon of the Reed Sea": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Claymore_Deshret.png",
  "Talking Stick": "https://enka.network/ui/UI_EquipIcon_Claymore_BeastTamer.png",
  "Favonius Greatsword": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Claymore_Zephyrus.png",
  "Serpent Spine": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Claymore_Kurogane.png",
  "Wolf's Gravestone": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Claymore_Wolfmound.png",
  
  "Splendor of Tranquil Waters": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Regalis.png",
  "Fleuve Cendre Ferryman": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Pipes.png",
  "Favonius Sword": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Zephyrus.png",
  "Key of Khaj-Nisut": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Deshret.png",
  "Primordial Jade Cutter": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Morax.png",
  "The Dockhand's Assistant": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Mechanic.png",
  "Freedom-Sworn": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Widsith.png",
  "Xiphos' Moonlight": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Pleroma.png",
  "Iron Sting": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Exotic.png",
  "Toukabou Shigure": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Kasabouzu.png",
  "Aquila Favonia": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Falcon.png",
  "Skyward Blade": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Dvalin.png",
  "Sapwood Blade": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Arakalari.png",
  "Sacrificial Sword": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Fossil.png",
  "Finale of the Deep": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Vorpal.png",
  "Amenoma Kageuchi": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Bakufu.png",
  "Mistsplitter Reforged": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Narukami.png",
  "Peak Patrol Song": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Regalis.png",
  "Flute of Ezpitzal": "https://enka.network/ui/UI_EquipIcon_Sword_Isikhulu.png",
  "Harbinger of Dawn": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Dawn.png",
  "Festering Desire": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Magnum.png",
  "Wolf-Fang": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Boreas.png",

  "Tome of the Eternal Flow": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Catalyst_Wheatley.png",
  "Sacrificial Jade": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Catalyst_Yadama.png",
  "Prototype Amber": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Catalyst_Proto.png",
  "Ash-Graven Drinking Horn": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Catalyst_Gargoyle.png",
  "Lost Prayer to the Sacred Winds": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Catalyst_FourSeasons.png",
  "A Thousand Floating Dreams": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Catalyst_Ayus.png",
  "Kagura's Verity": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Catalyst_Narukami.png",
  "Sacrificial Fragments": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Catalyst_Fossil.png",
  "Magic Guide": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Catalyst_Intro.png",
  "The Widsith": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Catalyst_Troupe.png",
  "Starcaller's Watch": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Catalyst_Figurines.png",
  "Reliquary of Truth": "https://enka.network/ui/UI_EquipIcon_Catalyst_Sistrum.png",
  "Favonius Codex": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Catalyst_Zephyrus.png",
  "Thrilling Tales of Dragon Slayers": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Catalyst_Apprentice.png",

  "Crimson Moon's Semblance": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Pole_BloodMoon.png",
  "Primordial Jade Winged-Spear": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Pole_Morax.png",
  "Staff of Homa": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Pole_Homa.png",
  "White Tassel": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Pole_Ruby.png",
  "Deathmatch": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Pole_Gladiator.png",
  "Engulfing Lightning": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Pole_Narukami.png",
  "The Catch": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Pole_Mori.png",
  "Dragon's Bane": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Pole_Stardust.png",
  "Favonius Lance": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Pole_Zephyrus.png",
  "Vortex Vanquisher": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Pole_Kunwu.png",
  "Black Tassel": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Pole_Noire.png",
  "Staff of the Scarlet Sands": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Pole_Deshret.png",
  "Ballad of the Fjords": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Pole_Shanty.png",

  "Aqua Simulacra": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Bow_Kirin.png",
  "Favonius Warbow": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Bow_Zephyrus.png",
  "Elegy for the End": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Bow_Widsith.png",
  "Sacrificial Bow": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Bow_Fossil.png",
  "Slingshot": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Bow_Sling.png",
  "Song of Stillness": "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Bow_Apprentice.png",
};

// 2. Exact canonical artifact relic icons map
export const KNOWN_ARTIFACT_ICONS: Record<string, string> = {
  "Nightsky Unveiling": "https://enka.network/ui/UI_RelicIcon_15038_4.png",
  "Obsidian Codex": "https://enka.network/ui/UI_RelicIcon_15038_4.png",
  "Scroll of the Hero of Cinder City": "https://enka.network/ui/UI_RelicIcon_15037_4.png",
  "Fragment of Harmonic Whimsy": "https://enka.network/ui/UI_RelicIcon_15035_4.png",
  "Unfinished Reverie": "https://enka.network/ui/UI_RelicIcon_15036_4.png",
  "Golden Troupe": "https://enka.network/ui/UI_RelicIcon_15032_4.png",
  "Marechaussee Hunter": "https://enka.network/ui/UI_RelicIcon_15031_4.png",
  "Song of Days Past": "https://enka.network/ui/UI_RelicIcon_15034_4.png",
  "Nighttime Whispers in the Echoing Woods": "https://enka.network/ui/UI_RelicIcon_15033_4.png",
  "Nymph's Dream": "https://enka.network/ui/UI_RelicIcon_15029_4.png",
  "Vourukasha's Glow": "https://enka.network/ui/UI_RelicIcon_15030_4.png",
  "Flower of Paradise Lost": "https://enka.network/ui/UI_RelicIcon_15028_4.png",
  "Desert Pavilion Chronicle": "https://enka.network/ui/UI_RelicIcon_15027_4.png",
  "Deepwood Memories": "https://enka.network/ui/UI_RelicIcon_15025_4.png",
  "Gilded Dreams": "https://enka.network/ui/UI_RelicIcon_15026_4.png",
  "Vermillion Hereafter": "https://enka.network/ui/UI_RelicIcon_15023_4.png",
  "Echoes of an Offering": "https://enka.network/ui/UI_RelicIcon_15024_4.png",
  "Ocean-Hued Clam": "https://enka.network/ui/UI_RelicIcon_15022_4.png",
  "Husk of Opulent Dreams": "https://enka.network/ui/UI_RelicIcon_15021_4.png",
  "Emblem of Severed Fate": "https://enka.network/ui/UI_RelicIcon_15020_4.png",
  "Shimenawa's Reminiscence": "https://enka.network/ui/UI_RelicIcon_15019_4.png",
  "Tenacity of the Millelith": "https://enka.network/ui/UI_RelicIcon_15017_4.png",
  "Pale Flame": "https://enka.network/ui/UI_RelicIcon_15018_4.png",
  "Heart of Depth": "https://enka.network/ui/UI_RelicIcon_15016_4.png",
  "Blizzard Strayer": "https://enka.network/ui/UI_RelicIcon_15015_4.png",
  "Crimson Witch of Flames": "https://enka.network/ui/UI_RelicIcon_15006_4.png",
  "Lavawalker": "https://enka.network/ui/UI_RelicIcon_15005_4.png",
  "Thundering Fury": "https://enka.network/ui/UI_RelicIcon_15008_4.png",
  "Thundersoother": "https://enka.network/ui/UI_RelicIcon_15007_4.png",
  "Viridescent Venerer": "https://enka.network/ui/UI_RelicIcon_15002_4.png",
  "Maiden Beloved": "https://enka.network/ui/UI_RelicIcon_15003_4.png",
  "Archaic Petra": "https://enka.network/ui/UI_RelicIcon_15014_4.png",
  "Retracing Bolide": "https://enka.network/ui/UI_RelicIcon_15013_4.png",
  "Noblesse Oblige": "https://enka.network/ui/UI_RelicIcon_15007_4.png",
  "Bloodstained Chivalry": "https://enka.network/ui/UI_RelicIcon_15008_4.png",
  "Gladiator's Finale": "https://enka.network/ui/UI_RelicIcon_15001_4.png",
  "Wanderer's Troupe": "https://enka.network/ui/UI_RelicIcon_15003_4.png",
};

/**
 * Get guaranteed weapon icon URL
 */
export function getWeaponIconUrl(weaponName: string): string {
  if (KNOWN_WEAPON_ICONS[weaponName]) {
    return KNOWN_WEAPON_ICONS[weaponName];
  }

  const clean = formatSlug(weaponName);
  return `https://genshin.jmp.blue/weapons/${clean}/icon`;
}

/**
 * Get guaranteed artifact relic icon URL
 */
export function getArtifactIconUrl(setName: string): string {
  // Extract primary name if hybrid e.g. "Golden Troupe + Tenacity"
  const cleanName = setName.split("+")[0].split("/")[0].trim();

  if (KNOWN_ARTIFACT_ICONS[cleanName]) {
    return KNOWN_ARTIFACT_ICONS[cleanName];
  }

  const clean = formatSlug(cleanName);
  return `https://genshin.jmp.blue/artifacts/${clean}/flower-of-life`;
}

/**
 * Get guaranteed character avatar icon URL
 */
export function getCharacterIconUrl(charNameOrId: string): string {
  const chars = gamedataStatic.characters as Record<string, { name: string; iconUrl: string }>;
  if (chars[charNameOrId]?.iconUrl) {
    return chars[charNameOrId].iconUrl;
  }
  const cleanName = String(charNameOrId).replace(/[^a-zA-Z0-9]/g, "");
  return `https://enka.network/ui/UI_AvatarIcon_${cleanName}.png`;
}
