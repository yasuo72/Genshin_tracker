# Genshin Impact Stats Website — Implementation Plan

## Overview

Building a **premium, dark-themed Next.js web app** that fetches Genshin Impact player character showcases from Enka.Network, displays them with element-themed UI, and layers Akasha.cv percentile rankings on top — all with Redis caching, defensive error handling, and buttery-smooth animations.

Your spec has **8 phases** (0–7). I'll execute them sequentially, testing each before moving on.

---

## 🚩 Flags & Improvements I'm Adding

> [!IMPORTANT]
> **Things I want to add from my side to make this production-grade:**

### Visual & UX Enhancements
1. **Premium glassmorphism dark theme** — not just "dark bg + light text" but layered glass cards with backdrop-blur, subtle gradients, and element-colored accents. Your spec says Tailwind, and I'll use it to build a truly stunning design system.
2. **Custom loading skeletons** with element-colored shimmer effects, not plain gray pulses.
3. **Open Graph / SEO meta tags** — dynamically generated `<title>` and OG image for each UID page so shared links look good on Discord/Twitter.
4. **Toast notification system** — built-in for the share button and future actions (Phase 6).
5. **404 page** — custom styled, not the Next.js default.

### Technical Improvements
6. **Rate limiting on our API routes** — your spec caches Enka calls, but doesn't protect against someone hammering `/api/showcase/` with random UIDs. I'll add a simple IP-based rate limiter (~30 req/min).
7. **Enka TTL from response** — the `enka-network-api` package exposes a `ttl` field. I'll use Enka's own recommended TTL instead of hardcoding 300s.
8. **Graceful cache fallback** — if Redis is down, the app should still work (just slower). I'll add a try/catch around all Redis calls so a Redis outage doesn't take down the site.
9. **SWR `revalidateOnFocus: false`** — prevent re-fetching when the user tabs back to the page (important since Enka has rate limits).
10. **Type-safe environment variables** — validate with Zod at startup, not at first request.

### Architecture
11. **Server Components where possible** — the landing page can be a server component for SEO; only the showcase/detail pages need client-side SWR.
12. **Image optimization** — use `next/image` for character/weapon icons served from Enka CDN, with blur placeholders.

> [!TIP]
> If you want me to skip any of these additions, just say so. Otherwise I'll include them all.

---

## Phase-by-Phase Execution Plan

### Phase 0 — Project Setup

#### What I'll Do
- Run `npx -y create-next-app@latest ./ --yes --ts --tailwind --app --src-dir` (non-interactive, in the Genshin workspace)
- Install deps: `swr`, `zod`, `framer-motion`
- Create the exact folder structure from your spec
- Set up a premium dark theme in `globals.css` with CSS custom properties for element colors
- Create `.env.local.example` with `ENKA_USER_AGENT`
- Verify `npm run dev` runs clean

#### Files
| Action | Path |
|--------|------|
| NEW | `src/app/page.tsx` |
| NEW | `src/app/u/[uid]/page.tsx` |
| NEW | `src/app/api/showcase/[uid]/route.ts` |
| NEW | `src/lib/enka.ts` |
| NEW | `src/lib/types.ts` |
| NEW | `src/components/` (empty) |
| NEW | `.env.local.example` |
| MODIFY | `src/app/globals.css` |

---

### Phase 1 — Enka Showcase Data (MVP)

#### What I'll Do
- Install `enka-network-api@latest` (v5.x)
- Implement `fetchShowcase(uid)` in `src/lib/enka.ts` using `EnkaClient.fetchUser()`
- Normalize the response into the clean shape from your spec (no raw Enka field names)
- Handle all 4 error cases with typed error codes
- Build the API route with UID validation (9-10 digit regex)
- Map error codes → HTTP status codes exactly as specified
- Include curl test instructions

#### Key Technical Decision
The `enka-network-api` v5 requires a cache directory setup for resolving character names/icons. I'll initialize this in a singleton pattern so it only runs once per server lifecycle, not per request.

#### Files
| Action | Path |
|--------|------|
| MODIFY | `src/lib/enka.ts` |
| MODIFY | `src/lib/types.ts` |
| MODIFY | `src/app/api/showcase/[uid]/route.ts` |

---

### Phase 2 — Caching Layer

#### What I'll Do
- Install `@upstash/redis`
- Build `src/lib/cache.ts` with `getCached<T>` / `setCached<T>`
- Add in-memory request deduplication (Promise coalescing via a `Map<string, Promise>`)
- Use Enka's own TTL from the response (with 300s fallback)
- Add `X-Cache: HIT/MISS` response header
- **My addition**: graceful Redis fallback — if Redis is unreachable, skip cache and call Enka directly

#### Files
| Action | Path |
|--------|------|
| NEW | `src/lib/cache.ts` |
| MODIFY | `src/app/api/showcase/[uid]/route.ts` |
| MODIFY | `.env.local.example` |

---

### Phase 3 — Landing Page & Showcase UI

#### What I'll Do
- **Landing page**: Hero section with animated gradient background, glass-morphism search card, UID input with inline validation, example UID chips, explainer text
- **Showcase page**: SWR-powered data fetching, skeleton loaders (element-colored shimmer), 5 distinct error states with custom icons/illustrations
- **PlayerHeaderCard**: Glass card with player info, AR level badge, Spiral Abyss icon
- **CharacterGrid + CharacterCard**: Element-colored border/glow, character art, crit stats prominent, constellation badge, weapon info
- **Mobile-first**: 1-column on mobile, 2-column on tablet, 3-column on desktop
- **SWR fetcher** in `src/lib/fetcher.ts`

#### Files
| Action | Path |
|--------|------|
| MODIFY | `src/app/page.tsx` |
| MODIFY | `src/app/u/[uid]/page.tsx` |
| NEW | `src/lib/fetcher.ts` |
| NEW | `src/components/PlayerHeaderCard.tsx` |
| NEW | `src/components/CharacterGrid.tsx` |
| NEW | `src/components/CharacterCard.tsx` |
| NEW | `src/components/SkeletonCard.tsx` |
| NEW | `src/components/ErrorState.tsx` |
| NEW | `src/components/UidInput.tsx` |

---

### Phase 4 — Character Detail Page

#### What I'll Do
- Build the character detail page reusing SWR-cached data (no new API call)
- Large character art + full stat panel layout (side-by-side desktop, stacked mobile)
- **StatPanel**: Animated number counters via framer-motion
- **ArtifactList**: 5 artifact cards with main stat, substats, and roll-quality bars
- Substat roll-quality bars based on reasonable max-roll constants (documented in comments)
- Link CharacterCards → detail page
- Empty "Ranking" placeholder section

#### Substat Max Roll Constants (for quality bars)
| Stat | Max Roll (5★) |
|------|---------------|
| Crit Rate | 3.9% |
| Crit DMG | 7.8% |
| ATK% | 5.8% |
| HP% | 5.8% |
| DEF% | 7.3% |
| ATK | 19.45 |
| HP | 298.75 |
| DEF | 23.15 |
| EM | 23.31 |
| ER% | 6.5% |

#### Files
| Action | Path |
|--------|------|
| NEW | `src/app/u/[uid]/[characterId]/page.tsx` |
| NEW | `src/components/StatPanel.tsx` |
| NEW | `src/components/ArtifactList.tsx` |
| NEW | `src/components/ArtifactCard.tsx` |
| NEW | `src/components/RankingPlaceholder.tsx` |
| MODIFY | `src/components/CharacterCard.tsx` |

---

### Phase 5 — Akasha Percentile Rankings

> [!WARNING]
> **Akasha has NO official API.** Based on my research of [seriaati/akasha-py](https://github.com/seriaati/akasha-py), the current endpoints are:
> - `GET https://akasha.cv/api/getCalculationsForUser/{uid}` — returns per-character ranking calculations
> - `GET https://akasha.cv/api/leaderboards` — leaderboard data with params
> - `GET https://akasha.cv/api/getCollectionSize` — total leaderboard size
> 
> These WILL break eventually. The entire integration is wrapped in try/catch with 4s timeout and Zod validation.

#### What I'll Do
- Build `src/lib/akasha.ts` with `fetchRankings(uid)` — full defensive wrapper
- AbortController with 4000ms timeout, try/catch everywhere, returns `null` on any failure
- Zod schema validation on response before returning
- API route: `GET /api/ranking/[uid]` — always 200, returns `{ ranking: [...] | null }`
- Combined route: `GET /api/combined/[uid]` — `Promise.allSettled` for showcase + ranking in parallel
- Update frontend to use combined route
- Percentile ribbon badges on CharacterCard (gold top 5%, purple top 20%, blue otherwise)
- Fill "Ranking" section on detail page with animated percentage bar + leaderboard link

#### Files
| Action | Path |
|--------|------|
| NEW | `src/lib/akasha.ts` |
| NEW | `src/app/api/ranking/[uid]/route.ts` |
| NEW | `src/app/api/combined/[uid]/route.ts` |
| NEW | `src/components/PercentileBadge.tsx` |
| NEW | `src/components/RankingSection.tsx` |
| MODIFY | `src/components/CharacterCard.tsx` |
| MODIFY | `src/app/u/[uid]/page.tsx` |
| MODIFY | `src/app/u/[uid]/[characterId]/page.tsx` |

---

### Phase 6 — Polish Pass

#### What I'll Do
- Framer-motion page transitions (fade + slide)
- CharacterCard hover: scale(1.03) + element-colored box-shadow glow
- Share button with clipboard copy + toast confirmation
- localStorage last-searched UID → "Continue as [nickname]" on landing
- Full mobile pass at 375px and 768px
- Accessibility: alt text, contrast check, keyboard navigation
- Footer crediting Enka.Network and Akasha System with links

#### Files
| Action | Path |
|--------|------|
| NEW | `src/components/Toast.tsx` |
| NEW | `src/components/ShareButton.tsx` |
| NEW | `src/components/Footer.tsx` |
| NEW | `src/app/template.tsx` (page transition wrapper) |
| MODIFY | Multiple existing components |

---

### Phase 7 — History & Comparison (Optional v2)

> [!IMPORTANT]
> This phase requires a **Postgres database**. Do you want me to:
> 1. Use `@vercel/postgres` (requires Vercel project setup)
> 2. Use a local Postgres via Docker
> 3. Skip this phase for now
> 
> Let me know before I reach this phase.

#### What I'll Do (if approved)
- Postgres setup with snapshots table
- `POST /api/snapshot` — save current combined data
- `GET /api/snapshot/[uid]` — list snapshots
- "Save Snapshot" button on showcase page
- Compare page: side-by-side character diff with green/red delta highlighting

---

## Open Questions

> [!IMPORTANT]
> 1. **Your UID for testing**: The spec suggests `618285856`. Is this your UID? Is your showcase currently public? I need a confirmed-public UID to verify each phase.
> 2. **Phase 7 database**: Vercel Postgres, local Docker Postgres, or skip for now?
> 3. **Deployment target**: Are you deploying to Vercel? This affects some architectural decisions (edge runtime, serverless function size limits, etc.)
> 4. **Upstash Redis**: Do you already have an Upstash account/credentials, or should I architect Phase 2 to work without Redis initially (in-memory cache as fallback)?

---

## Verification Plan

### Per-Phase Testing
Each phase will be verified before proceeding:
- **Phase 0**: `npm run dev` runs, folder structure matches, dark theme visible
- **Phase 1**: `curl localhost:3000/api/showcase/{UID}` returns clean JSON; test all error cases
- **Phase 2**: Two rapid requests → second returns `X-Cache: HIT`
- **Phase 3**: Visual check at 375px and 1440px viewports; all 5 error states tested
- **Phase 4**: Click character → correct detail page; stats and artifacts render correctly
- **Phase 5**: Ranking data displays when available; intentionally broken Akasha URL doesn't crash site
- **Phase 6**: Page transitions smooth; share copies URL; mobile fully usable
- **Phase 7**: Snapshot saves/lists; compare page highlights stat deltas

### Automated Checks
- `npm run build` succeeds with no TypeScript errors after each phase
- `npm run lint` passes after each phase
