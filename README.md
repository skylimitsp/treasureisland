# Treasure Island — Web

The web experience for **Treasure Island**, an intimate **luxury beach resort**:
browse **beachfront villas and suites**, explore resort amenities, and **book a
stay**. Contributor conventions are in [`CLAUDE.md`](./CLAUDE.md).

## Tech stack

- **TanStack Start** (SSR) on **Vite 8**, **React 19**
- **TanStack Router** (file-based routing) · **TanStack Query** · **TanStack Table** · **TanStack Store**
- **Tailwind CSS v4** + **shadcn/ui** (new-york, `zinc` base) · **lucide-react**
- **Fraunces** (display) + **Manrope** (body) type; beach-themed design tokens
- **@faker-js/faker** for mock seed data
- **Cloudflare Workers** deploy via `@cloudflare/vite-plugin` + `wrangler`
- **Yarn 1** (`yarn@1.22.22`, required package manager; npm and pnpm installs are refused)

## Getting started

```bash
yarn install
yarn dev        # http://localhost:3000
```

`yarn dev` runs the app in the Cloudflare Workers runtime (via
`@cloudflare/vite-plugin`), so local behaviour matches production.

Yarn is locked via `packageManager` and `engines` in `package.json` plus
`engine-strict` in `.npmrc`. Commit `yarn.lock`; never add a `package-lock.json`
or `pnpm-lock.yaml`.

## Scripts

```bash
yarn dev               # start dev server (port 3000, Workers runtime)
yarn build             # production build (client + Workers bundle → dist/)
yarn preview           # preview the build in the Workers runtime
yarn deploy            # build + wrangler deploy to Cloudflare
yarn generate-routes   # regenerate routeTree.gen.ts
yarn lint              # eslint
yarn format            # prettier --write + eslint --fix
yarn cf-typegen        # regenerate Cloudflare binding types
yarn tsc --noEmit     # typecheck
npx shadcn@latest add <component>   # add a UI primitive (installs deps with yarn)
```

## Deploying to Cloudflare

The app builds to a Cloudflare Worker. Deployment config lives in
[`wrangler.jsonc`](./wrangler.jsonc) (`main` → `@tanstack/react-start/server-entry`,
`nodejs_compat` enabled). Cloudflare / CI runs `yarn install --frozen-lockfile && yarn build`; the
Worker bundle and client assets land in `dist/`.

```bash
yarn wrangler login       # once, to authenticate
yarn deploy               # vite build && wrangler deploy
```

Yarn runs the native build scripts (`esbuild`, `lightningcss`, `unrs-resolver`,
`workerd`) automatically, so no approval config is needed. Update `SITE.url` / `SITE.ogImage` in
`src/constants/site.ts` to the production domain before launch.

## Project structure

```
src/
├── routes/          # file-based routes (index landing, generated routeTree.gen.ts)
├── components/
│   └── shared/      # design-system pieces (stat-tile, …)
├── data/            # mock data accessors — the API swap seam (rooms.ts)
├── hooks/           # queries/ and mutations/ (one hook per file)
├── lib/             # utils, errors, http-client, format, auth, seo, theme
├── stores/          # TanStack Store slices (auth, …)
├── constants/       # query times (index.ts), site config (site.ts)
├── integrations/    # tanstack-query provider/context wiring
└── types/           # domain models (Room, Booking, User — single source of truth)
```

## Conventions (see [CLAUDE.md](./CLAUDE.md))

- File names are **kebab-case, lowercase** (`rooms.query.ts`, `stat-tile.tsx`).
- **One component per file**; hooks one per file.
- Comments are **at most 2 lines**.
- Imports use the **`#/*` alias** → `src/*` (no deep relative paths).
- Data flows through a **hook → `src/data` accessor**; going live swaps the
  accessor body for an `httpClient` call with no component changes.

## Design system

Beach tokens (sea-ink / lagoon / palm / sand / foam, with full light **and** dark
blocks) and shared components live in `src/styles.css` and
`src/components/shared/`. The signature motifs are the frosted `.island-shell`
and `.feature-card` surfaces, the **Fraunces** `.display-title`, and the
uppercase `.island-kicker` label.

## SEO

Every route sets full metadata via the `seo()` helper (`src/lib/seo.ts`): title,
description, Open Graph, Twitter card, canonical, and robots. Site config lives in
`src/constants/site.ts`. The root shell provides the site defaults; each route
sets its own `title`, `description`, and canonical `path`. List/detail pages
server-render their content via route loaders so it is crawlable.

## Status

- ✅ Architecture & routing skeleton (TanStack Start + Query, SSR)
- ✅ Beach design system, tokens, shared components
- ✅ Home / landing with rooms + resort stats, site-wide SEO
- ✅ Cloudflare Workers build + deploy wiring
- ⏳ Room detail, booking flow, amenities, dining, account
