# Genshin Impact Stats Website — Phased AI Agent Build Prompts

How to use this file: feed **one phase at a time** to your AI coding agent (Claude Code, Cursor, etc.), in order. Each phase is self-contained — it has its own context, task list, file structure, and a "Definition of Done" checklist. Don't move to the next phase until the current one's checklist is fully satisfied and tested against a real UID.

Recommended: save this whole file as `SPEC.md` in your repo root so the agent can reference earlier phases automatically, then paste each `### Prompt to give the agent` block as your actual message.

---

## Phase 0 — Project Setup

### Context for the agent
We're building a Next.js web app that looks up a Genshin Impact player's UID, fetches their public character showcase from the Enka.Network API, and displays it. No login, no database yet — just the skeleton.

### Prompt to give the agent
```
Set up a new Next.js 14+ project (App Router) with TypeScript and Tailwind CSS.

Requirements:
- Use `npx create-next-app@latest` with TypeScript, Tailwind, App Router, src/ directory.
- Add these dependencies: swr, zod, framer-motion.
- Create this folder structure:
  src/app/page.tsx                 -> landing page (placeholder for now)
  src/app/u/[uid]/page.tsx         -> showcase page (placeholder for now)
  src/app/api/showcase/[uid]/route.ts  -> API route (placeholder for now)
  src/lib/enka.ts                  -> Enka API client (placeholder for now)
  src/lib/types.ts                 -> shared TypeScript types (placeholder for now)
  src/components/                  -> empty folder for components
- Set up a dark theme by default in globals.css (dark background, light text).
- Set up .env.local.example with a placeholder ENKA_USER_AGENT variable.
- Confirm the app runs with `npm run dev` and shows a placeholder page at localhost:3000.

Do not implement any actual Enka or Akasha logic yet — this phase is scaffolding only.
```

### Definition of Done
- [ ] `npm run dev` runs with no errors
- [ ] Folder structure matches exactly what's listed above
- [ ] Tailwind dark theme visible on placeholder page
- [ ] `.env.local.example` exists with `ENKA_USER_AGENT`

---

## Phase 1 — Enka Showcase Data (MVP)

### Context for the agent
Now we connect to the real Enka.Network API and display real character showcase data. This is the core value of the app — get this right before anything else.

Give the agent this reference info directly:
```
Enka.Network API endpoint: GET https://enka.network/api/uid/{UID}/
Required header: User-Agent: <value from env var ENKA_USER_AGENT>

Use the npm package `enka-network-api` to parse the response instead of
hand-parsing raw IDs — it resolves character names, icons, artifact set
names, and stat names automatically.

Known failure cases to handle explicitly:
- Private showcase -> response has playerInfo but no avatarInfoList
- UID not found -> non-200 response
- Enka rate limited (429) or down (5xx) -> must not crash the route
```

### Prompt to give the agent
```
Implement Phase 1: real Enka showcase data.

1. In src/lib/enka.ts, write a function `fetchShowcase(uid: string)` that:
   - Uses the `enka-network-api` package's EnkaClient to fetch the user.
   - Returns a clean, normalized object (NOT raw Enka JSON) shaped like:
     {
       uid: string,
       player: { nickname, level, signature, worldLevel, achievements, towerFloor },
       characters: [{
         id, name, iconUrl, element, level, constellation,
         weapon: { name, iconUrl, refinement, level },
         stats: { hp, atk, def, critRate, critDmg, elementalMastery, energyRecharge },
         artifacts: [{ slot, setName, mainStat: {name, value}, subStats: [{name, value}] }]
       }]
     }
   - Throws a typed error with one of these codes on failure:
     "PRIVATE_SHOWCASE" | "UID_NOT_FOUND" | "UPSTREAM_RATE_LIMITED" | "UPSTREAM_DOWN"

2. Define the TypeScript types for the shape above in src/lib/types.ts.

3. In src/app/api/showcase/[uid]/route.ts:
   - Validate the uid param is 9-10 digits before calling fetchShowcase. Return 400 with
     { error: "INVALID_UID" } if not.
   - Call fetchShowcase and return the JSON with status 200.
   - On thrown errors, map the error code to an appropriate HTTP status
     (404 for UID_NOT_FOUND, 403 for PRIVATE_SHOWCASE, 429 for rate limited, 502 for down)
     and return { error: "<code>" }.

4. Write a simple test (or manual curl instructions) confirming a real public UID
   returns clean JSON. Use UID 618285856 as a known test case if it's still public,
   otherwise ask me for a UID to test with.

Do not build the UI yet — just get this API route returning correct, clean JSON.
```

### Definition of Done
- [ ] `GET /api/showcase/618285856` (or another known-public UID) returns clean, normalized JSON matching the shape above
- [ ] Private showcase UID returns 403 + `{"error":"PRIVATE_SHOWCASE"}`
- [ ] Invalid UID format returns 400 before any network call is made
- [ ] Response does NOT contain any raw Enka field names (no `fightPropMap`, `avatarId`, etc.)

---

## Phase 2 — Caching Layer

### Context for the agent
Enka is a free, rate-limited community service. We must cache responses so repeated lookups of the same UID don't hit Enka every time.

### Prompt to give the agent
```
Implement Phase 2: Redis caching for the showcase API.

1. Add the `@upstash/redis` package. Add UPSTASH_REDIS_REST_URL and
   UPSTASH_REDIS_REST_TOKEN to .env.local.example.

2. In src/lib/cache.ts, write:
   - `getCached<T>(key: string): Promise<T | null>`
   - `setCached<T>(key: string, value: T, ttlSeconds: number): Promise<void>`

3. Update src/app/api/showcase/[uid]/route.ts to:
   - Check cache key `showcase:{uid}` before calling fetchShowcase.
   - On cache miss, fetch fresh, store in cache with TTL 300 seconds
     (or whatever ttl Enka's response specifies, if the wrapper exposes it).
   - Add an in-memory de-duplication map so if 10 requests for the same UID
     arrive within milliseconds of each other, only ONE actual Enka call is made
     and all 10 requests share that one promise's result.

4. Add a response header `X-Cache: HIT` or `X-Cache: MISS` so we can verify
   caching is working during testing.

Test by calling the same UID twice in a row and confirming the second call
is faster and returns X-Cache: HIT.
```

### Definition of Done
- [ ] Second request for the same UID within TTL window returns `X-Cache: HIT`
- [ ] Cache entries expire correctly after TTL
- [ ] Concurrent simultaneous requests for the same UID only trigger one upstream Enka call (verify via a log line count)

---

## Phase 3 — Landing Page & Showcase UI

### Context for the agent
Now build the actual user-facing UI: a landing page with UID search, and a showcase page that renders the data from Phase 1/2's API.

### Prompt to give the agent
```
Implement Phase 3: landing page and showcase display UI.

1. Landing page (src/app/page.tsx):
   - Centered hero with a UID input field and "View Showcase" button.
   - Client-side validation: must be 9-10 digits, show inline error otherwise,
     do not submit if invalid.
   - On submit, navigate to /u/[uid].
   - Below the search bar, show 2-3 example UID chips that are clickable and
     pre-fill + navigate.
   - Short one-paragraph explainer of what the site does.
   - Dark theme, Tailwind, mobile-first responsive layout.

2. Showcase page (src/app/u/[uid]/page.tsx):
   - Use SWR to call GET /api/showcase/[uid] client-side (fetcher in src/lib/fetcher.ts).
   - Loading state: render skeleton cards (same grid layout, gray pulsing
     placeholders) — do NOT use a spinner.
   - Error states: branch on the `error` code returned by the API and show a
     distinct, friendly message + illustration/icon for each of:
     PRIVATE_SHOWCASE, UID_NOT_FOUND, INVALID_UID, UPSTREAM_RATE_LIMITED, UPSTREAM_DOWN
   - Success state:
     - PlayerHeaderCard component: nickname, level, signature, world level,
       achievements, Spiral Abyss floor.
     - CharacterGrid component: one CharacterCard per character showing
       character art, level, constellation badge, weapon icon + refinement,
       Crit Rate / Crit DMG prominently, element-colored border/glow
       (Pyro=red, Hydro=blue, Anemo=teal, Electro=purple, Dendro=green,
       Cryo=cyan, Geo=yellow).
   - No character detail page yet — that's Phase 4.

Build these as clean, reusable, typed React components in src/components/.
```

### Definition of Done
- [ ] Landing page UID validation works without hitting the network on bad input
- [ ] Showcase page shows skeleton loaders while fetching, not a spinner
- [ ] All 5 error states render distinct, correct UI
- [ ] Character cards are color-themed by element and show core stats at a glance
- [ ] Layout is usable on a 375px-wide mobile viewport

---

## Phase 4 — Character Detail Page

### Context for the agent
Clicking a character card should open a full detail view with all stats and artifact breakdown.

### Prompt to give the agent
```
Implement Phase 4: character detail page.

1. Create src/app/u/[uid]/[characterId]/page.tsx.
   - Reuse the same SWR-cached /api/showcase/[uid] data (find the matching
     character by id client-side — don't add a new API route for this).
   - Large character art on one side, full stat panel on the other; stack
     vertically on mobile.
   - StatPanel component: HP, ATK, DEF, Crit Rate, Crit DMG, Elemental Mastery,
     Energy Recharge, elemental DMG bonus — animate numbers counting up on
     mount using framer-motion.
   - ArtifactList component: one card per equipped artifact (up to 5) showing
     icon, rarity stars, level, main stat, and substats. For each substat,
     render a small horizontal bar indicating roll quality relative to that
     stat's max possible roll (use reasonable approximate max-roll constants;
     note them in a comment since exact values depend on game version).

2. Make CharacterCard (from Phase 3) link to this detail page on click.

Leave a clearly marked placeholder section titled "Ranking" where Phase 5's
percentile data will go — just a collapsed/empty card for now.
```

### Definition of Done
- [ ] Navigating from a character card opens the correct character's detail page
- [ ] All stats and artifacts render correctly for a real test UID
- [ ] Substat roll-quality bars render sensibly (not just always full or empty)
- [ ] Placeholder "Ranking" section exists but is empty/hidden

---

## Phase 5 — Akasha Percentile Rankings

### Context for the agent
Give the agent this warning verbatim, it matters:
```
Akasha System (akasha.cv) has NO official public API. It is unofficial and
reverse-engineered, and is known to change without notice. Every part of this
integration must fail safely: if anything about the Akasha call or response
shape is wrong, the rest of the site must keep working and just show
"ranking unavailable" for that character. Never let an Akasha failure throw
an unhandled error or crash a page.
```

### Prompt to give the agent
```
Implement Phase 5: Akasha percentile rankings, defensively.

1. In src/lib/akasha.ts, write `fetchRankings(uid: string)`:
   - Calls Akasha's endpoints (research the current request shape/endpoints
     used by the akasha-py or similar wrapper as a reference; replicate the
     HTTP calls directly in TypeScript — do not add a Python dependency).
   - Wrap the whole thing in try/catch with an explicit timeout (AbortController,
     4000ms). On any error or timeout, return null — never throw out of this function.
   - Validate the response with a Zod schema before returning it. Schema fields:
     characterName, weapon, topPercent (number), ranking (number), outOf (number),
     damage (number), leaderboardUrl (string url). On validation failure, log a
     console.warn with details and return null.

2. Create src/app/api/ranking/[uid]/route.ts that calls fetchRankings, caches the
   result in Redis for 20 minutes under key `akasha:{uid}`, and always returns 200
   with either { ranking: [...] } or { ranking: null } — never a 4xx/5xx for this
   route, since a missing ranking is not really an error state for the user.

3. Create src/app/api/combined/[uid]/route.ts that calls both the showcase logic
   and the ranking logic in parallel using Promise.allSettled, and returns:
   { uid, showcase, showcaseError, ranking }
   Update the frontend (Phase 3/4 pages) to fetch from this combined route instead
   of calling /api/showcase directly.

4. On CharacterCard, add a small percentile ribbon badge when ranking data exists
   for that character (gold for top 5%, purple top 20%, blue otherwise), and simply
   omit the badge entirely when ranking is null — no error message on the card itself.

5. On the character detail page, fill in the "Ranking" placeholder from Phase 4:
   - Big animated percentage + "Top X%" text with an animated fill bar.
   - "Ranked N / Total" supporting text.
   - Link to the Akasha leaderboard URL.
   - If ranking is null for this character, show a small muted
     "Ranking data unavailable for this character" note instead of hiding the
     section entirely (so the user knows it was attempted, not forgotten).
```

### Definition of Done
- [ ] A working Akasha lookup returns and displays correct percentile data end to end
- [ ] Manually breaking the Akasha fetch (e.g. pointing it at a bad URL) does NOT crash the showcase or detail page — it just shows "unavailable"
- [ ] `/api/combined/[uid]` never returns a 5xx solely because Akasha failed
- [ ] Percentile badges are color-coded correctly and absent when data is missing

---

## Phase 6 — Polish Pass

### Prompt to give the agent
```
Implement Phase 6: visual and UX polish across the whole app.

1. Add page transition animations (framer-motion) between landing -> showcase
   -> detail pages.
2. Add hover states to CharacterCard (slight scale + element-colored glow).
3. Add a copy-to-clipboard "Share" button on the showcase page that copies the
   current /u/[uid] URL, with a small toast/confirmation on click.
4. Persist the last-searched UID in localStorage; landing page should show a
   "Continue as [nickname]" quick link if one exists.
5. Do a full mobile responsiveness pass on every page built so far (test at
   375px and 768px widths).
6. Add basic accessibility: alt text on all character/weapon/artifact images,
   confirm text-over-colored-background contrast is readable, ensure the UID
   input and all buttons are keyboard-navigable.
7. Add a footer crediting Enka.Network and Akasha System with links to both.

Go through each existing page and component and apply these improvements —
do not build new features in this phase.
```

### Definition of Done
- [ ] Transitions feel smooth, not janky, on navigation between all pages
- [ ] Site is fully usable and legible at 375px width
- [ ] Share button copies correct URL and shows confirmation
- [ ] Footer credits both upstream services

---

## Phase 7 — History & Comparison (Optional v2)

### Context for the agent
This phase adds persistence, only build if you want the "compare over time" feature.

### Prompt to give the agent
```
Implement Phase 7: snapshot history and comparison (optional v2 feature).

1. Add Postgres via `@vercel/postgres` or `pg`. Add connection string to
   .env.local.example.
2. Create the snapshots table:
   CREATE TABLE snapshots (
     id SERIAL PRIMARY KEY,
     uid VARCHAR(10) NOT NULL,
     nickname TEXT,
     captured_at TIMESTAMPTZ DEFAULT now(),
     showcase JSONB NOT NULL,
     ranking JSONB
   );
3. Create POST /api/snapshot that stores the current combined showcase+ranking
   data for a UID (store the cleaned/normalized JSON, not raw upstream data).
4. Create GET /api/snapshot/[uid] returning snapshot history for a UID, newest first.
5. Add a "Save snapshot" button on the showcase page.
6. Build src/app/compare/page.tsx: pick two UIDs (or two snapshots of the same UID),
   show characters present in both side by side with stat/substat deltas highlighted
   (green if the left is higher, red if lower, for each stat).

This is the last phase — after this, the app matches the full v1+v2 spec.
```

### Definition of Done
- [ ] Snapshots save and list correctly per UID
- [ ] Compare page correctly diffs two builds of the same character and highlights differences
- [ ] No regressions in earlier phases' functionality

---

## Notes for whoever is driving the agent (you)

- **Test after every phase** against a real, known-public UID before telling the agent to proceed — don't chain phases blindly.
- If the agent gets stuck on Akasha's exact current endpoints/request shape in Phase 5, that's expected — its API isn't documented and shifts over time. Have the agent search for the current `akasha-py` or similar wrapper source on GitHub and mirror whatever HTTP calls it's making right now, rather than trusting any hardcoded example (including the one earlier in this doc).
- Keep each phase's diff small and reviewable — if the agent tries to do multiple phases' worth of work in one prompt, stop it and re-scope to just the current phase.
