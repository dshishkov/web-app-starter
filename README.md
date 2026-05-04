# Starter

Full-stack monorepo starter with Hono API, Drizzle ORM, Better Auth (Google OAuth), React 19, Vite 6, and Tailwind CSS v4.

## Stack

| Layer    | Tech                                                              |
| -------- | ----------------------------------------------------------------- |
| API      | Hono, Drizzle ORM, Better Auth, Zod                               |
| Database | PostgreSQL 16 (Docker)                                            |
| Web      | React 19, React Router 7, TanStack Query, Tailwind CSS v4, Vite 6 |
| Auth     | Better Auth + Google OAuth                                        |
| Tooling  | pnpm workspaces, TypeScript strict, ESLint, Prettier              |

## Prerequisites

- [Node.js](https://nodejs.org/) >= 22
- [pnpm](https://pnpm.io/) >= 8
- [Docker](https://www.docker.com/)

## Quick Start

```bash
# 1. Create your API env file and fill in the required values
cp api/.env.example api/.env

# 2. Install dependencies and start database
pnpm setup

# 3. Start dev servers (API on :3001, Web on :5173)
pnpm dev

# 4. Open http://localhost:5173
```

The web app proxies `/api` to the API server automatically via Vite.

## Scripts

| Command            | Description                                  |
| ------------------ | -------------------------------------------- |
| `pnpm dev`         | Start both API + Web dev servers             |
| `pnpm build`       | Type-check and build both workspaces         |
| `pnpm lint`        | Run ESLint across all files                  |
| `pnpm lint:fix`    | Auto-fix lint issues                         |
| `pnpm format`      | Format with Prettier                         |
| `pnpm setup`       | Install deps + start DB + run migrations     |
| `pnpm db:setup`    | Start DB container + run migrations          |
| `pnpm db:reset`    | Destroy DB volume + recreate + migrate fresh |
| `pnpm db:up`       | Start DB container                           |
| `pnpm db:down`     | Stop DB container                            |
| `pnpm db:migrate`  | Run Drizzle migrations                       |
| `pnpm db:generate` | Create a new migration from schema changes   |
| `pnpm db:seed`     | Insert demo users into the database          |

## Architecture

```
web-app-starter/
├── api/                        # Hono API server
│   ├── src/
│   │   ├── index.ts            # Server entry, middleware, routes, error handler
│   │   ├── auth.ts             # Better Auth config (Google OAuth)
│   │   ├── env.ts              # Zod env validation (fail-fast on startup)
│   │   ├── db/
│   │   │   ├── schema.ts       # Drizzle schema (users, sessions, etc.)
│   │   │   ├── index.ts        # DB connection
│   │   │   ├── migrate.ts      # Runtime migration entrypoint
│   │   │   └── seed.ts         # Demo data seed script
│   │   ├── lib/
│   │   │   └── auth-middleware.ts  # Auth guard + typed helpers
│   │   └── routes/
│   │       └── users.ts        # /api/users, /api/me, /api/me/nickname
│   └── drizzle.config.ts
├── web/                        # React frontend
│   ├── src/
│   │   ├── main.tsx            # App entry + routes + QueryClientProvider
│   │   ├── index.css           # Design system (dark + light themes)
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Shell.tsx       # Layout wrapper + context provider
│   │   │   ├── Sidebar.tsx     # Nav + user menu (portal)
│   │   │   ├── Topbar.tsx      # Search bar + action buttons
│   │   │   ├── Avatar.tsx      # Color-coded initials
│   │   │   ├── BarChart.tsx    # Vertical bar chart
│   │   │   ├── ProgressBar.tsx # Horizontal progress bar
│   │   │   ├── Sparkline.tsx   # SVG sparkline chart
│   │   │   ├── StatusPill.tsx  # Status badge with dot
│   │   │   ├── PriorityCell.tsx # Priority bars
│   │   │   ├── Kbd.tsx         # Keyboard shortcut badge
│   │   │   ├── RequireAuth.tsx # Auth gate + loading spinner
│   │   │   └── icons.tsx       # 20+ SVG icons
│   │   ├── overlays/
│   │   │   ├── CommandPalette.tsx  # ⌘K command palette
│   │   │   ├── TaskDrawer.tsx      # Right slide-out edit form
│   │   │   ├── TaskModal.tsx       # Centered create form
│   │   │   └── TweaksPanel.tsx     # Design settings panel
│   │   ├── pages/
│   │   │   ├── Home.tsx        # Component catalog (public)
│   │   │   ├── Profile.tsx     # Nickname form (auth-gated)
│   │   │   ├── Team.tsx        # User roster (auth-gated)
│   │   │   └── NotFound.tsx    # 404 catch-all
│   │   └── lib/
│   │       ├── app-context.tsx # App-wide state (config, user, overlays)
│   │       ├── auth-client.ts  # Better Auth client
│   │       ├── types.ts        # Frontend-only TypeScript types
│   │       ├── data.ts         # Design system constants + demo data
│   │       ├── utils.ts        # hueFor, initialsFor, gradientFor
│   │       ├── query-client.ts # TanStack Query client instance
│   │       └── hooks.ts        # Typed data-fetching hooks
│   └── vite.config.ts
├── packages/
│   └── types/                  # Shared types (API + Web)
│       └── src/
│           └── index.ts        # PublicUser, ApiError, etc.
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions (lint + build)
├── compose.yaml                # PostgreSQL 16 container
├── eslint.config.mjs           # Shared ESLint flat config
├── pnpm-workspace.yaml
└── package.json
```

## Component Catalog

Open the app to see every component rendered in a live catalog:

- **Typography** — headings, body, mono, section labels
- **Buttons & Chips** — signal, ghost, icon buttons; chip variants
- **Form Inputs** — terminal-input, terminal-select, terminal-textarea, checkbox, with react-hook-form + Zod validation
- **Key Components** — Avatar, Kbd, Sparkline, StatusPill, PriorityCell, BarChart, ProgressBar
- **Cards & Panels** — stat cards, progress panels, activity rows
- **Overlay Triggers** — ⌘K palette, drawer, modal, tweaks panel
- **Loading & Empty States** — spinner, empty state panel

## Frontend Design System

The frontend is organized around a small token-driven design system rather than a component library dependency.

| Layer            | File                        | Purpose                                                                                   |
| ---------------- | --------------------------- | ----------------------------------------------------------------------------------------- |
| App config       | `web/src/lib/app-config.ts` | App metadata, routes, nav, page chrome, auth UI copy, defaults, and API paths             |
| Theme tokens     | `web/src/index.css`         | Light/dark semantic tokens, Tailwind `@theme` fonts, focus styles, motion handling        |
| Design constants | `web/src/lib/data.ts`       | Font stack options, status/priority demo values, catalog demo data                        |
| Primitives       | `web/src/components/`       | Reusable UI pieces such as `Avatar`, `Kbd`, charts, pills, progress, layout, and icons    |
| Overlays         | `web/src/overlays/`         | Command palette, task drawer/modal, and design tweaks panel                               |
| Catalog page     | `web/src/pages/Home.tsx`    | Live inventory of typography, controls, cards, charts, overlays, and empty/loading states |

### Tokens and utility classes

`web/src/index.css` is the source of truth for reusable visual language:

- `:root` defines the light theme.
- `.dark` overrides the same semantic tokens for dark mode.
- `--accent-h` controls the accent hue used by accent tokens.
- `--bg-*`, `--text-*`, `--border-*`, and `--color-*` tokens should be used instead of hardcoded JSX colors.
- Shared utility classes include `panel-terminal`, `panel-terminal-muted`, `terminal-chip`, `terminal-chip-strong`, `signal-button`, `ghost-button`, `icon-button`, `terminal-input`, `terminal-select`, `terminal-textarea`, `terminal-table`, `terminal-empty`, `terminal-overlay`, and `app-scrollbar`.

Components are mostly Tailwind utilities plus these semantic CSS variables. If you add a reusable visual pattern, put it in `index.css`; if it is page-specific spacing/layout, keep it inline as Tailwind classes in that page/component.

### Runtime customization

`Shell.tsx` stores UI preferences under `APP_META.storageKey` from `web/src/lib/app-config.ts` and applies them to the document root:

- `data-theme` and `.dark` control light/dark mode.
- `data-density` controls density-specific CSS hooks.
- `--accent-h` updates the accent hue.
- `--font-body` updates the active body font from `FONT_STACKS`.

The `TweaksPanel` is a useful development affordance for previewing accent color, font, density, sidebar layout, and theme combinations. You can remove it for production if your app should not expose runtime design controls.

### Customizing the look for your project

1. Update `APP_META` in `web/src/lib/app-config.ts` for name, mark, tagline, and storage key.
2. Update `DEFAULT_APP_CONFIG` in `web/src/lib/app-config.ts` for default theme, accent hue, font, density, and sidebar layout.
3. Edit matching semantic tokens in both `:root` and `.dark` inside `web/src/index.css` for brand colors, surfaces, text, borders, shadows, and shell chrome.
4. Add or remove font options in `FONT_STACKS` (`web/src/lib/data.ts`) and update the font import / `@theme` block in `index.css`.
5. Replace `STATUSES`, `PRIORITIES`, and `DEMO_*` constants with your product/domain values, or delete them with the demo task overlays.
6. Update `APP_ROUTES`, `PAGE_META`, and `APP_NAV_ITEMS` in `web/src/lib/app-config.ts` when adding real pages.
7. Keep `Home.tsx` as a component catalog during customization; replace it when you are ready for a real landing page or dashboard.

## Environment Variables

Copy `api/.env.example` to `api/.env` and fill in:

| Variable               | Required | Default | Description                                               |
| ---------------------- | -------- | ------- | --------------------------------------------------------- |
| `DATABASE_URL`         | Yes      | —       | Postgres connection string                                |
| `BETTER_AUTH_SECRET`   | Yes      | —       | Random 32+ char string for session encryption             |
| `BETTER_AUTH_URL`      | Yes      | —       | Your frontend URL (e.g. `http://localhost:5173`)          |
| `GOOGLE_CLIENT_ID`     | Yes      | —       | Google OAuth client ID                                    |
| `GOOGLE_CLIENT_SECRET` | Yes      | —       | Google OAuth client secret                                |
| `PORT`                 | No       | `3001`  | API server port                                           |
| `ALLOWED_ORIGINS`      | No       | —       | Comma-separated production origins for CORS checks        |
| `TRUST_PROXY_HEADERS`  | No       | `false` | Trust `x-forwarded-for` / `x-real-ip` for rate-limit keys |
| `RATE_LIMIT_DISABLED`  | No       | `false` | Disable rate limiting locally                             |

`ALLOWED_ORIGIN` is still accepted as a backwards-compatible alias, but new projects should use `ALLOWED_ORIGINS`.

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create an OAuth 2.0 Client ID (Web application)
3. Add `http://localhost:5173/api/auth/callback/google` as an authorized redirect URI
4. Copy the Client ID and Client Secret into your `.env`

## Customizing After Cloning

### 1. Branding

| What         | Where                                             |
| ------------ | ------------------------------------------------- |
| App name     | `web/src/lib/app-config.ts` — `APP_META.name`     |
| Logo mark    | `web/src/lib/app-config.ts` — `APP_META.logoMark` |
| Tagline      | `web/src/lib/app-config.ts` — `APP_META.tagline`  |
| Accent color | `web/src/index.css` — `--accent-h` hue token      |
| Font         | `web/src/lib/data.ts` — `FONT_STACKS`             |
| Page titles  | `web/src/lib/app-config.ts` — `PAGE_META` object  |

### 2. Landing Page

`web/src/pages/Home.tsx` is a component catalog meant for demonstration. Replace it with your real landing page, dashboard, or marketing site. The route is public (no `RequireAuth` wrapper).

### 3. Auth Provider

The starter uses Google OAuth out of the box. To switch or add providers:

**Switch to GitHub:**

```ts
// api/src/auth.ts
socialProviders: {
  github: {
    clientId: env().GITHUB_CLIENT_ID,
    clientSecret: env().GITHUB_CLIENT_SECRET,
  },
},
```

Add the env vars to `api/src/env.ts` and `api/.env`, then update the sign-in button in `web/src/components/Sidebar.tsx`:

```ts
authClient.signIn.social({ provider: 'github', callbackURL: '/' })
```

### 4. Adding a Feature End-to-End

Here is the complete flow for adding, say, a "Projects" feature:

**Step 1 — Database table:**

```ts
// api/src/db/schema.ts
export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

**Step 2 — Generate and run migration:**

```bash
pnpm db:generate
pnpm db:migrate
```

**Step 3 — API route:**

```ts
// api/src/routes/projects.ts
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'

import { db } from '../db/index.js'
import { projects } from '../db/schema.js'
import { getAuthenticatedUser, requireAuth } from '../lib/auth-middleware.js'

const app = new Hono()
app.get('/projects', requireAuth, async (c) => {
  const user = getAuthenticatedUser(c)
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, user.id))
  return c.json({ projects: rows })
})
export { app as projects }
```

Mount it in `api/src/index.ts`:

```ts
import { projects } from './routes/projects.js'

app.route('/api', projects)
```

**Step 4 — Shared type:**

```ts
// packages/types/src/index.ts
export interface Project {
  id: string
  name: string
  userId: string
  createdAt: string
}
export interface ProjectsResponse {
  projects: Project[]
}
```

**Step 5 — TanStack Query hook:**

```ts
// web/src/lib/hooks.ts
import type { Project, ProjectsResponse } from '@repo/types'

async function fetchProjects(): Promise<Project[]> {
  const response = await fetch('/api/projects', { credentials: 'include' })
  if (!response.ok) throw await parseApiError(response)
  const data = (await response.json()) as ProjectsResponse
  return data.projects
}

export function useProjects() {
  return useQuery({ queryKey: ['projects'], queryFn: fetchProjects })
}
```

**Step 6 — Page:**

```tsx
// web/src/pages/Projects.tsx
import { useProjects } from '../lib/hooks'

export default function Projects() {
  const { data, isLoading } = useProjects()
  // render...
}
```

**Step 7 — Route + nav:**
Add the route in `web/src/main.tsx` and the nav item in `web/src/components/Sidebar.tsx`.

### 5. Removing Demo Overlays

If you don't need the task-management demo overlays, remove them:

1. Delete `web/src/overlays/TaskDrawer.tsx` and `TaskModal.tsx`
2. Remove their imports, `drawerOpen` / `modalOpen` state, trigger buttons, and render calls from `web/src/pages/Home.tsx`
3. Remove unused demo task constants from `web/src/lib/data.ts` if your real app does not need them

Keep `TweaksPanel` and `CommandPalette` if you want the design settings and ⌘K search.

### 6. Error Handling

The API returns consistent JSON errors:

```json
{ "error": "Unauthorized", "message": "Authentication required", "status": 401 }
```

Hooks in `web/src/lib/hooks.ts` parse these automatically via `parseApiError()`. Access the message via `useMutation().error?.message` or `useQuery().error?.message`.

## Development Tips

- **React Query Devtools** — Press `Shift + Alt + T` in the browser to inspect cache, mutations, and background refetches.
- **Vite proxy** — `/api/*` requests from the dev server are proxied to `http://localhost:3001` automatically.
- **Type safety** — Shared types live in `packages/types/` and are imported via `@repo/types` in both API and Web.

## Docker and Deployment Notes

- The API image is built from the repository root so workspace packages are available:

```bash
docker build -f api/Dockerfile -t web-app-starter-api .
```

- `compose.yaml` is for local PostgreSQL only. Run production Postgres separately and set `DATABASE_URL`.
- Set `BETTER_AUTH_URL` to your public web origin.
- Set `ALLOWED_ORIGINS` to every trusted web origin, separated by commas.
- Only enable `TRUST_PROXY_HEADERS=true` when the API is behind a trusted reverse proxy.
- Start the deployed API with `pnpm --filter api start:prod` so the runtime uses platform-provided environment variables instead of a local `.env` file.
- The production image includes the compiled runtime migrator and committed SQL migrations. The migrator only requires `DATABASE_URL`; run it as a one-off release/predeploy job before starting or promoting the API:

```bash
docker run --rm \
  -e DATABASE_URL="$DATABASE_URL" \
  web-app-starter-api \
  pnpm --filter api db:migrate:prod
```

- Keep API startup separate from migration execution. The image default command only starts the server.

## Template Readiness Checklist

- Replace `APP_META` branding values in `web/src/lib/app-config.ts`.
- Replace or remove the component catalog demo data.
- Configure OAuth credentials and authorized redirect URIs.
- Run `pnpm db:generate` after schema changes and commit generated migrations.
- Run `pnpm lint`, `pnpm format:check`, and `pnpm build` before shipping.
- Keep secrets in `.env` or your deployment platform secret store; never commit `api/.env`.

## License

MIT — see [`LICENSE`](./LICENSE).
