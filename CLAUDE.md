# CLAUDE.md — treasureisland-web

Guidance for working in this repository. Read this before making changes.

Treasure Island is the web experience for a **luxury beach resort**: guests
browse beachfront villas and suites, explore amenities, and book a stay. Content
starts as mock data and swaps to a live API through a single seam (see §6).

## 1. Stack

- **TanStack Start** (SSR) on **Vite 8**, **React 19**.
- **TanStack Router** — file-based routing (`src/routes/`, generated
  `src/routeTree.gen.ts`).
- **TanStack Query** — server state (SSR-integrated).
- **TanStack Table** — data grids · **TanStack Store** — light client state.
- **Tailwind CSS v4** + **shadcn/ui** (new-york style, `zinc` base, CSS variables).
- **lucide-react** icons · **@faker-js/faker** for mock seeds.
- **Cloudflare Workers** target via `@cloudflare/vite-plugin` + `wrangler`.
- **pnpm** is the required package manager.

## 2. Commands

```bash
pnpm dev              # dev server on http://localhost:3000 (Workers runtime)
pnpm build            # production build (client + Worker bundle → dist/)
pnpm preview          # preview the build in the Workers runtime
pnpm deploy           # vite build && wrangler deploy
pnpm generate-routes  # regenerate routeTree.gen.ts (tsr generate)
pnpm lint             # eslint
pnpm format           # prettier --write + eslint --fix
pnpm cf-typegen       # regenerate Cloudflare binding types (wrangler types)
pnpm exec tsc --noEmit # typecheck
pnpm dlx shadcn@latest add <component>  # add a shadcn primitive
```

Native build scripts (`esbuild`, `lightningcss`, `unrs-resolver`, `workerd`) are
approved in `pnpm-workspace.yaml` under `allowBuilds`. If `pnpm install` reports
`ERR_PNPM_IGNORED_BUILDS`, set the named dependency to `true` there and re-run
install — do not delete that config, or Cloudflare CI builds will stall.

## 3. File & code conventions (required)

These are non-negotiable house rules for this project:

- **File names are kebab-case, all lowercase** — every word separated by `-`.
  - Components: `room-card.tsx`, `rooms-list.tsx`, `booking-panel.tsx`.
  - Hooks keep the domain suffix: `rooms.query.ts`, `bookings.mutation.ts`.
  - Utilities/data/types: `http-client.ts`, `rooms.ts`, `format.ts`.
- **One component per file**, always. A file must not declare a second React
  component — extract sub-components into their own kebab-case files and import
  them (e.g. `components/shared/stat-tile.tsx`). Behavioural/UI hooks are one per
  file too.
- **Domain data hooks group by domain.** All room read hooks live in
  `hooks/queries/rooms.query.ts`, all room/booking writes in the matching
  `.mutation.ts`. Data-accessor modules may group cohesive functions for one
  domain (`getRooms` + `getRoomBySlug` in `data/rooms.ts`) — but never mix a
  component with unrelated functions.
- **Comments are at most 2 lines.** Explain _why_, not _what_. No large comment
  blocks. (The short `@author` doc headers on hook/service files are the one
  allowed exception.)
- **Imports use the `#/*` alias** → `src/*`. Never deep relative paths
  (`../../..`). Example: `import { cn } from '#/lib/utils'`.
- Prettier + eslint (`@tanstack/eslint-config`) enforce formatting; run
  `pnpm format` before committing. `noUnusedLocals`/`noUnusedParameters` are on —
  keep imports clean.

## 4. Folder structure

```
src/
├── routes/          # file-based routes (index landing; generated routeTree.gen.ts)
├── components/      # ui/ (shadcn), shared/ (design-system pieces)
├── data/            # mock data accessors — the API swap seam (rooms.ts)
├── hooks/           # queries/ and mutations/ (one hook per file)
├── lib/             # utils, errors, http-client, format, auth, seo, theme
├── stores/          # TanStack Store slices (auth, …)
├── constants/       # query times (index.ts), site config (site.ts)
├── integrations/    # tanstack-query provider/context wiring
└── types/           # domain models (Room, Booking, User — single source of truth)
```

## 5. Providers & app wiring

- Router context is built in
  `src/integrations/tanstack-query/root-provider.tsx` via `getContext()`, which
  creates the `QueryClient`.
- `src/router.tsx` calls `setupRouterSsrQueryIntegration({ router, queryClient })`.
  **This automatically wraps the app in `QueryClientProvider`** (through
  `router.options.Wrap`) — do **not** add a second `QueryClientProvider`.
- `src/routes/__root.tsx` is the shell (`<html>`, `<head>`, devtools, `Scripts`)
  and sets the site's default `seo()` meta. Global providers that must live in
  the React tree go here, inside the shell.
- Devtools (Router + Query) are mounted in `__root.tsx`.

## 6. Data access — the mock → API seam

All content starts as **mock data in `src/data/`**. Components never call
`fetch` or import mock arrays directly — they go through hooks:

- **Reads** → `useXQuery` in `hooks/queries/<domain>.query.ts`.
- **Writes** → `useXMutation` in `hooks/mutations/<domain>.mutation.ts`.
- Each query/mutation function is wrapped in `withErrorHandling` (`lib/errors.ts`)
  and calls a `src/data` accessor. Going live = change only that function body to
  hit `httpClient` (`lib/http-client.ts`). No component edits.
- Centralise query keys in an `xKeys` factory per domain (see `roomKeys` in
  `rooms.query.ts`).

Example seam:

```ts
const fetchRooms = withErrorHandling(async () => {
  await new Promise((r) => setTimeout(r, 250)) // simulate latency
  return getRooms() // ← swap for httpClient.get('/rooms')
}, 'Failed to load rooms')
```

## 7. Styling & design

- **Beach palette, frosted surfaces.** Tokens (`--sea-ink`, `--lagoon`, `--palm`,
  `--sand`, `--foam`, …) live in `src/styles.css` with full light **and** dark
  blocks; shadcn theme variables map through `@theme inline`.
- Two type families: **Playfair Display** for display (`.display-title`, via
  `--font-display`) and **Manrope** for body/UI (`--font-sans`). Signature motifs
  are the `.island-shell` and `.feature-card` glass surfaces, the uppercase
  `.island-kicker` label, the `.page-wrap` container, and the `.rise-in` entrance.
- **Border-radius rule (required):** any element with a **border** (or a
  card/control/input/image frame) uses **`rounded-md`** — never `rounded-lg/xl/
2xl/3xl`. The **only** exception is a **full circle** (avatars, dots, icon-only
  buttons), which uses `rounded-full`. Keep this consistent across the app; the
  `.btn`, `.chip`, `.price-badge`, and `.img-frame` helpers already follow it.
  (The decorative `.img-arch` image shape is an intentional motif, not a bordered
  control, so it is exempt.)
- Beach tokens are exposed as Tailwind utilities (`bg-lagoon`, `text-sea-ink-soft`,
  `border-line`, `text-sunset`, …) via `@theme inline` — prefer them over
  `[color:var(--…)]` arbitrary values.
- Motion via GSAP: `#/lib/gsap` (SSR-safe singleton) + `#/hooks/use-gsap`
  (scoped, auto-reverted) + `#/lib/animations` (named patterns:
  `revealStagger`/`[data-reveal]`, `parallaxLayers`/`[data-speed]`, `countUp`/
  `[data-count]`, `headerShrink`). All respect `prefers-reduced-motion`. See
  `../docs/animation-guide.md`.
- Keep contrast strong in both themes; mobile-first; 44px touch targets.
- Add UI primitives with `pnpm dlx shadcn@latest add <name>` (config in
  `components.json`).

## 8. SEO (required on every page)

Every route sets its own metadata via the **`seo()` helper** (`src/lib/seo.ts`),
which returns a full `head` payload: title (`<page> · Treasure Island`),
description, Open Graph, Twitter card, canonical, and robots tags.

```ts
export const Route = createFileRoute('/rooms/')({
  head: () => seo({ title: 'Rooms', description: '…', path: '/rooms' }),
  // …
})
```

- The root shell (`__root.tsx`) sets the site-wide default meta; **every route**
  adds a `head` with a specific `title`, `description`, and canonical `path`.
- Dynamic pages build SEO from loader data: pass the record's title,
  description, `image`, and `type: 'article'`.
- Private/utility pages pass `noindex: true`.
- Site-wide config lives in `src/constants/site.ts` — update `SITE.url` /
  `SITE.ogImage` for production before launch.
- Prefer a route `loader` + `ensureQueryData` so list/detail content is
  server-rendered (crawlable), not just fetched on the client.

## 9. Skills (use them for UI work)

Three agent skills are installed in `.agents/skills/` and linked from `.claude/skills/`:

- **frontend-engineer:** the end-to-end workflow (UX concept → UI → component
  architecture → implementation) and the review checklist. Start here for any
  page, component or flow.
- **frontend-design:** a distinctive, non-templated visual direction. Use it
  when designing new sections so they don't look generic.
- **ui-ux-pro-max:** searchable UX, typography, colour, chart and stack guidance
  (with scripts and data). Use it for UX/contrast checks and patterns — but the
  beach palette and type pairing in §7 always win over its suggestions.

`skills-lock.json` pins the versions of the two external skills.

## 10. Authorship

New hook/service files carry a short doc header:

```ts
/**
 * <one line on what this does>
 * @author Joseph Nartey
 * @github devjoemedia
 */
```

## 11. Definition of done

- [ ] `pnpm exec tsc --noEmit` and `pnpm lint` pass; `pnpm build` succeeds.
- [ ] `pnpm dev` boots and the page renders.
- [ ] File names kebab-case; one component per file; comments ≤ 2 lines.
- [ ] Data flows through a hook + `src/data` accessor (no direct mock imports in UI).
- [ ] The route sets `seo()` metadata (title + description; `noindex` if private).
- [ ] Loading, empty, and error states are handled for any new list/detail view.
- [ ] UI work follows the `frontend-engineer` skill's checklist (§9).
- [ ] New images are WebP (AVIF too for full-bleed heroes), ≤1600px wide
      (≤2000px for heroes), with `decoding="async"` and lazy-loading below the fold.
