/**
 * Shared TypeScript types for Genshin Stats
 *
 * Full type definitions coming in Phase 1.
 */

// ===== Showcase Data =====

export interface PlayerInfo {
  nickname: string;
  level: number;
  signature: string;
  worldLevel: number;
  achievements: number;
  towerFloor: string;
  abyssText?: string;
  theaterText?: string;
  stygianText?: string;
  avatarUrl?: string;
}

export interface WeaponInfo {
  id?: string;
  name: string;
  iconUrl: string;
  refinement: number;
  level: number;
}

export interface ArtifactSubStat {
  name: string;
  value: number;
}

export interface ArtifactMainStat {
  name: string;
  value: number;
}

export interface ArtifactInfo {
  slot: string;
  setName: string;
  iconUrl?: string;
  mainStat: ArtifactMainStat;
  subStats: ArtifactSubStat[];
}

export interface CharacterStats {
  hp: number;
  atk: number;
  def: number;
  critRate: number;
  critDmg: number;
  elementalMastery: number;
  energyRecharge: number;
}

export interface CharacterInfo {
  id: string;
  name: string;
  iconUrl: string;
  splashUrl?: string;
  element: string;
  level: number;
  constellation: number;
  weapon: WeaponInfo;
  stats: CharacterStats;
  artifacts: ArtifactInfo[];
}

export interface ShowcaseData {
  uid: string;
  player: PlayerInfo;
  characters: CharacterInfo[];
}

// ===== Error Types =====

export type ShowcaseErrorCode =
  | "PRIVATE_SHOWCASE"
  | "UID_NOT_FOUND"
  | "INVALID_UID"
  | "UPSTREAM_RATE_LIMITED"
  | "UPSTREAM_DOWN";

export class ShowcaseError extends Error {
  code: ShowcaseErrorCode;

  constructor(code: ShowcaseErrorCode, message?: string) {
    super(message ?? code);
    this.code = code;
    this.name = "ShowcaseError";
  }
}

// ===== Ranking Types (Phase 5) =====

export interface CharacterRanking {
  characterName: string;
  characterId: string;
  weapon: string;
  topPercent: number;
  ranking: number;
  outOf: number;
  calculationId?: number;
  calculation?: string;
}

export interface RankingData {
  uid: string;
  rankings: CharacterRanking[];
}

// ===== Build Guide Types (Phase 8) =====

export interface BuildGuideConstellation {
  number: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  summary: string;
  priority: "low" | "medium" | "high" | "bis";
}

export interface BuildGuideWeapon {
  weaponId: string;
  name: string;
  tier: "F2P" | "Standard Banner" | "Premium (Limited)";
  rank: number;
  reasoning: string;
}

export interface BuildGuideArtifactSet {
  setName: string;
  pieceCount: "4pc" | "2pc+2pc";
  role: "main" | "alternative" | "budget";
  substats: string[];
  mainStats: { sands: string; goblet: string; circlet: string };
  reasoning: string;
}

export interface BuildGuideTeamComp {
  name: string;
  budget: "F2P" | "Mixed" | "Premium";
  members: { characterId: string; role: string }[];
  rotation: string;
  expectedDamage?: string;
}

export interface CharacterBuildGuide {
  characterId: string;
  role: "Main DPS" | "Sub DPS" | "Support" | "Healer" | "Battery";
  tierRank?: "SS" | "S" | "A" | "B";
  constellations: BuildGuideConstellation[];
  weapons: BuildGuideWeapon[];
  artifactSets: BuildGuideArtifactSet[];
  teamComps: BuildGuideTeamComp[];
  notes?: string;
  sources?: string[];
  lastUpdated: string;
}

// ===== Combined Response =====

export interface CombinedResponse {
  uid: string;
  showcase: ShowcaseData | null;
  showcaseError: ShowcaseErrorCode | null;
  ranking: CharacterRanking[] | null;
}
