# Character Build Guide Feature — Implementation Plan

## Feasibility Summary

**Yes, this can be built for free.** No paid API exists for build-guide content (weapon
tier lists, artifact sets, team comps) — Game8/genshin.gg pay human writers/theorycrafters
to produce that, then serve it from their own database. You need to do the same thing,
just at smaller scale:

- **Data**: You (or an AI assist) write original, in-your-own-words build data into a
  JSON/TS data file per character. Base your reasoning on public community consensus
  (Genshin Impact Fandom Wiki — CC-BY-SA — and open theorycraft tools like Genshin
  Optimizer), but do not copy sentences or tables verbatim from Game8/genshin.gg —
  that's their copyrighted editorial writing, not public data.
- **Hosting**: Static JSON files committed to your repo. Zero cost, zero DB needed for v1.
- **Compute**: None — it's just data + React components, same free tier as the rest
  of your Next.js/Vercel app.

The only real cost is *time* to populate data for many characters. Recommended: ship
15–20 popular/meta characters first, expand incrementally.

---

## Data Model

Each character gets one JSON/TS object. Suggested schema:

```ts
interface CharacterBuildGuide {
  characterId: string; // matches Enka character IDs you already use
  role: "Main DPS" | "Sub DPS" | "Support" | "Healer" | "Battery";
  tierRank?: "SS" | "S" | "A" | "B"; // optional overall tier

  constellations: {
    number: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    summary: string; // 1-2 sentences, your own words
    priority: "low" | "medium" | "high" | "bis"; // how impactful this C-level is
  }[];

  weapons: {
    weaponId: string;
    name: string;
    tier: "F2P" | "Standard Banner" | "Premium (Limited)";
    rank: number; // 1 = best in slot, 2 = second best, etc.
    reasoning: string;
  }[];

  artifactSets: {
    setName: string;
    pieceCount: "4pc" | "2pc+2pc";
    role: "main" | "alternative" | "budget";
    substats: string[]; // priority order, e.g. ["Crit Rate/DMG", "ATK%", "EM"]
    mainStats: { sands: string; goblet: string; circlet: string };
    reasoning: string;
  }[];

  teamComps: {
    name: string; // e.g. "National Team", "F2P Vape Comp"
    budget: "F2P" | "Mixed" | "Premium";
    members: { characterId: string; role: string }[];
    rotation: string; // short rotation summary
    expectedDamage?: string; // rough tier, e.g. "~40-60k avg per rotation at C0R1"
  }[];

  notes?: string;
  sources?: string[]; // e.g. ["Community consensus", "Genshin Impact Fandom Wiki"]
  lastUpdated: string; // ISO date — patch content goes stale fast
}
```

Store these as `src/data/builds/{characterId}.json` (or `.ts` if you want type safety
at author-time). One file per character keeps diffs small and lets you add characters
incrementally without touching a shared file.

---

## UI Additions

### New Components
| Component | Purpose |
|---|---|
| `BuildGuideSection.tsx` | Container on the character detail page, tabbed: Overview / Weapons / Artifacts / Teams |
| `ConstellationTrack.tsx` | Horizontal C0→C6 track, highlights the user's current C-level from their Enka data, shows priority for higher ones |
| `WeaponRankList.tsx` | Ranked list, grouped by F2P / Standard / Premium, badge-colored |
| `ArtifactSetCard.tsx` | Main set + "budget alternative" set side by side, substat priority chips |
| `TeamCompCard.tsx` | Team of 4 character portraits + role labels + budget badge + rotation text |
| `BudgetFilter.tsx` | Toggle: "Show F2P only" / "Show all" — filters weapons + teams client-side |

### Where it plugs into your existing app
- On `src/app/u/[uid]/[characterId]/page.tsx`, add `<BuildGuideSection characterId={...} userConstellation={...} userWeaponId={...} />` below your existing `ArtifactList`.
- Cross-reference: if the user's equipped weapon/artifact set matches a `rank: 1` entry, show a small "✓ You're using BiS" badge — this is the kind of touch that makes it feel premium and is basically free to add since you already have the showcase data loaded.
- The "Ranking" placeholder section you built in Phase 4 is a good home for a "your build vs recommended build" diff.

---

## Suggested New Phase (Phase 8 — Build Guides)

### What to build
1. `src/data/builds/` — JSON data files, start with 15-20 characters
2. `src/lib/builds.ts` — `getBuildGuide(characterId)`, returns `null` if not yet curated (don't crash — just hide the section or show "Guide coming soon")
3. The 6 components above
4. Wire into character detail page with the cross-reference badges
5. A simple `src/data/builds/_template.json` so future data entry is copy-paste

### Testing
- Character with a guide → full section renders
- Character without a guide → page still works, shows "Build guide coming soon"
- F2P filter toggle hides premium weapons/teams correctly
- Constellation track correctly highlights user's actual C-level from Enka data

---

## Detailed AI Prompt (paste into Claude Code / your AI tool)

```
I'm adding a "Character Build Guide" feature to my existing Next.js Genshin Impact
stats app (Enka.Network showcase + Akasha rankings, already built in prior phases).

GOAL
Add build guide content per character: constellation priority, weapon rankings
(F2P vs Standard vs Premium), best + budget artifact sets, and team compositions
(F2P to premium) with expected damage tier — same category of content as Game8 or
genshin.gg character pages, but original data I own, not scraped/copied text.

DATA SOURCE RULES (important)
- Do NOT scrape or copy text from Game8, genshin.gg, or any other build-guide site.
- Base build reasoning on general public theorycraft consensus (mechanics, stat
  weights, known team synergies) and write all reasoning/summaries in original
  wording.
- If you're not confident about current-patch specifics (a new character, a recent
  weapon), say so in the data with a lower confidence note rather than guessing
  authoritatively.

DATA MODEL
Create `src/data/builds/{characterId}.json` per character using this TypeScript
interface (put the interface in `src/lib/types.ts` alongside my existing types):

[paste the CharacterBuildGuide interface from above]

Start with these characters: [list 15-20 characters you want first — e.g. your
most-searched showcase characters].

LIB FUNCTION
`src/lib/builds.ts`:
- `getBuildGuide(characterId: string): CharacterBuildGuide | null`
- Reads from the JSON files (static import or fs read at build time — your call,
  prefer static import for type safety and zero runtime cost)
- Returns null gracefully if no file exists for that character — never throw

COMPONENTS (all in src/components/, follow my existing glassmorphism dark theme
and element-color accent system from earlier phases)
1. BuildGuideSection — tabbed container: Overview / Weapons / Artifacts / Teams
2. ConstellationTrack — C0-C6 horizontal track; accepts `userConstellation` prop
   and highlights it; shows priority badge (low/medium/high/bis) for each level
3. WeaponRankList — grouped by F2P/Standard/Premium tier, ranked, with a
   "✓ Currently equipped" badge if it matches `userWeaponId` prop
4. ArtifactSetCard — shows main recommended set + one budget alternative,
   substat priority as ordered chips
5. TeamCompCard — 4 character portraits + role label under each + budget badge
   (F2P/Mixed/Premium) + rotation summary text
6. BudgetFilter — client-side toggle, filters WeaponRankList and TeamCompCard
   lists down to F2P-tagged entries only

INTEGRATION
On `src/app/u/[uid]/[characterId]/page.tsx`, render
`<BuildGuideSection characterId={char.id} userConstellation={char.constellation}
userWeaponId={char.weapon.id} />` below the existing ArtifactList component.
If getBuildGuide returns null, render a small "Build guide coming soon for this
character" placeholder instead of hiding the section entirely — keeps the layout
consistent.

TESTING
- Character with guide data renders full section with all 4 tabs
- Character without guide data shows the "coming soon" placeholder, no crash
- BudgetFilter correctly narrows weapon/team lists
- ConstellationTrack correctly highlights the actual user constellation from
  their Enka showcase data
- npm run build and npm run lint pass with no errors

Do not fetch this data from any external site at runtime. It should all be
static, bundled JSON — no new API calls, no new external dependency.
```

---

## Honest Caveats

- **Content freshness**: Genshin patches every ~6 weeks and can shift weapon/team
  meta. Add a `lastUpdated` field per character and consider a small "meta may be
  outdated" disclaimer if a guide is more than 2-3 patches old.
- **Scale of manual work**: Writing 15-20 character guides by hand (even with AI
  drafting help) is a real time investment — budget a few hours per character if
  you want genuinely good reasoning rather than generic filler.
- **Don't let AI "helpfully" pull in phrasing from known Game8/genshin.gg pages**
  when drafting this data — review each file before committing, since an AI model
  may unintentionally mirror wording it's seen from those sites during training.
