# AGENTS.md

## Stack

| Layer           | Technology                                                        |
| --------------- | ----------------------------------------------------------------- |
| API             | Hono, Drizzle ORM (PostgreSQL), Better Auth (Google OAuth), Zod   |
| Web             | React 19, React Router 7, TanStack Query, Tailwind CSS v4, Vite 6 |
| DB              | PostgreSQL 16 (Docker Compose)                                    |
| Package manager | pnpm 8+ (workspaces)                                              |
| Tooling         | TypeScript strict, ESLint flat config, Prettier                   |

## Project layout

```
api/src/
  index.ts          # Server entry, middleware stack, routes, error handler
  auth.ts           # Better Auth config
  env.ts            # Zod schema for env validation (fail-fast on startup)
  db/schema.ts      # Drizzle schema (users, sessions, accounts, verifications)
  db/index.ts       # DB connection
  db/seed.ts        # Demo data seed script
  lib/auth-middleware.ts  # requireAuth guard, getAuthenticatedUser helper
  lib/form-helpers.ts      # validatedForm() — auth + Zod validation middleware tuple
  lib/rate-limit.ts       # Rate limiter factory with swappable store (Memory -> Redis)
  routes/users.ts   # /api/users, /api/me, /api/me/nickname

web/src/
  main.tsx          # App entry, BrowserRouter, QueryClientProvider, routes
  index.css         # Design system (dark + light themes, CSS custom properties)
  components/       # Reusable UI (Shell, Sidebar, Topbar, Avatar, BarChart, Form system, etc.)
  overlays/         # Modals & overlays (CommandPalette, TaskDrawer, TaskModal, TweaksPanel)
  pages/            # Route components (Home, Profile, Team, NotFound)
  lib/
    app-context.tsx # React context for config, user, overlay state
    auth-client.ts  # Better Auth client setup
    types.ts        # Frontend-only TypeScript types
    data.ts         # Design constants (STATUSES, PRIORITIES, FONT_STACKS, demo data)
    utils.ts        # hueFor, initialsFor, gradientFor
    query-client.ts # TanStack Query client instance
    hooks.ts        # Typed data-fetching hooks (useMe, useUsers, useFormMutation)

packages/
  types/            # Shared types consumed by both API and Web
    src/index.ts    # PublicUser, CurrentUser, ApiError, UsersResponse, UserResponse
    src/schemas.ts  # Shared Zod schemas (nicknameSchema, etc.)
```

## Conventions

### TypeScript

- ESM everywhere (`"type": "module"`, `.js` extensions in imports)
- `strict: true`, no `any` unless essential
- Type-check with `pnpm build` (both workspaces run `tsc`)

### API patterns

- **Routes**: Hono sub-apps exported and mounted in `index.ts` via `app.route()`
- **Auth**: `requireAuth` middleware on protected routes, `getAuthenticatedUser(c)` to extract user
- **Schema**: Drizzle with `pgTable`, `text()`, `timestamp()`, `boolean()`. Indexes on FK columns
- **Migrations**: `pnpm db:generate` to create, `pnpm db:migrate` to apply
- **Validation**: Use Zod via `@hono/zod-validator`. For form endpoints, use `validatedForm(schema)` from `lib/form-helpers.ts` which combines `requireAuth` + `zValidator` + standard error handler into a spreadable middleware tuple. For non-form routes, use `zValidator('json', schema)` directly.
- **Env**: Validate all env vars in `env.ts` with Zod. Call `env()` at startup for fail-fast behavior
- **Errors**: Global `app.onError()` in `index.ts` returns consistent `{ error, message, status }` JSON
- **Naming**: Routes live in `routes/<resource>.ts`, exported as `{ <resource> }`
- **Shared types**: API response types live in `packages/types/src/index.ts` and are imported via `@repo/types`

### Frontend patterns

- **Components**: One default export per file, PascalCase filenames
- **Design system**: Uses CSS custom properties defined in `index.css` (`--color-accent`, `--text-primary`, `--bg-base`, etc.) and utility classes (`terminal-chip`, `panel-terminal`, `signal-button`, etc.)
- **Context**: `useApp()` hook provides config, currentUser, userLoading, overlay state. Wraps everything inside `<Shell>`
- **Auth client**: `useSession()` from `lib/auth-client.ts` for session state
- **Data fetching**: Always use typed hooks from `lib/hooks.ts` (TanStack Query). Never raw `fetch` + `useEffect` in pages
- **Hooks convention**: Each query hook has a fetch function + `useQuery`. Mutations use `useFormMutation()` inline (no custom mutation hooks needed). Use `parseApiError()` to surface server messages. Invalidate related queries on mutation success
- **Forms**: Use `react-hook-form` + `zodResolver` with Zod schemas from `@repo/types`. Wrap forms in `<Form>`, group fields with `<FormField name="..." label="...">`, render inputs as children (`<FormInput>`, `<FormSelect>`, `<FormTextarea>`, `<FormCheckbox>`). Validation runs on submit by default; errors appear automatically via `FormError`. Schemas live in `packages/types/src/schemas.ts` (shared between API and Web). See `Profile.tsx` for the canonical example.
- **Overlays**: CommandPalette (⌘K), TaskDrawer (slide-in), TaskModal (centered), TweaksPanel (floating) — all managed via context booleans
- **Styling**: Tailwind utility classes only. No inline styles except dynamic values (gradients, sizes). No CSS modules, no styled-components

### Frontend design system organization

- `web/src/index.css` is the design-system source of truth:
  - `@theme` defines Tailwind-facing font tokens (`--font-body`, `--font-display`, `--font-mono`).
  - `:root` defines the light theme; `.dark` overrides the same semantic tokens for dark mode.
  - Shared component utility classes live below the global styles (`panel-terminal`, `panel-terminal-muted`, `terminal-chip`, `terminal-chip-strong`, `signal-button`, `ghost-button`, `icon-button`, `terminal-input`, `terminal-select`, `terminal-textarea`, `terminal-table`, `terminal-empty`, `terminal-overlay`, `app-scrollbar`).
- `web/src/lib/app-config.ts` owns starter-level app configuration:
  - `APP_META` sets app branding (`name`, `logoMark`, `tagline`, `storageKey`). Change `storageKey` when turning the starter into a real app to avoid reusing local demo preferences.
  - `DEFAULT_APP_CONFIG` sets the default accent hue, theme, font, density, and sidebar layout.
  - `APP_ROUTES`, `APP_NAV_ITEMS`, and `PAGE_META` keep route paths, navigation, and page chrome together.
  - `AUTH_UI`, `API_ENDPOINTS`, and `QUERY_DEFAULTS` collect auth UI copy, client API paths, and query defaults.
- `web/src/components/Shell.tsx` owns runtime root synchronization:
  - The `config` effect writes `data-theme`, `data-density`, `--accent-h`, and `--font-body` to the root element.
- `web/src/lib/data.ts` owns design/demo constants:
  - `FONT_STACKS` contains selectable runtime font stacks.
  - `STATUSES` and `PRIORITIES` drive demo/status components and should be replaced with real domain values when needed.
- `web/src/components/` contains reusable primitives and layout pieces. Prefer composing these with Tailwind utilities and existing CSS variables rather than creating one-off visual styles.
- `web/src/pages/Home.tsx` is intentionally a component catalog. Keep it while developing a product theme, or replace it with a real landing/dashboard page once the UI direction is set.

### Customizing the frontend look

1. **Branding**: edit `APP_META` in `web/src/lib/app-config.ts`.
2. **Accent color**: change `DEFAULT_APP_CONFIG.accent` in `web/src/lib/app-config.ts` or the `--accent-h` fallback in `index.css`.
3. **Light/dark palette**: edit matching semantic tokens in `:root` and `.dark`; keep token names stable so components continue to work.
4. **Fonts**: add/remove entries in `FONT_STACKS`, update `@import` / `@theme` in `index.css`, and set `DEFAULT_APP_CONFIG.font`.
5. **Density/sidebar defaults**: update `DEFAULT_APP_CONFIG.density` and `DEFAULT_APP_CONFIG.sidebar`.
6. **Page chrome**: update `APP_ROUTES`, `APP_NAV_ITEMS`, and `PAGE_META` together in `web/src/lib/app-config.ts`.
7. **Reusable styles**: extend `index.css` utility classes only for patterns used across multiple components; use inline Tailwind utilities for page-specific layout.

When adding UI, prefer semantic tokens (`var(--text-secondary)`, `var(--bg-panel)`, `var(--border-subtle)`, `var(--color-accent)`) over hardcoded colors. If a new color is needed, add it as a token in both light and dark themes first.

### Files to NEVER touch without asking

- `api/.env` — local secrets, gitignored
- `pnpm-lock.yaml` — managed by pnpm
- `api/drizzle/` — auto-generated migration files

## How to add things

### New API route

1. Create `api/src/routes/<name>.ts` with a Hono sub-app
2. Export as `{ <name> }`, import and `app.route()` in `index.ts`
3. Use `requireAuth` middleware if protected
4. Validate bodies with Zod: `zValidator('json', schema)`

### New DB table

1. Add to `api/src/db/schema.ts` with relations
2. Run `pnpm db:generate` → `pnpm db:migrate`

### New frontend page

1. Create `web/src/pages/<Name>.tsx` (default export, PascalCase)
2. Add a `<Route>` in `web/src/main.tsx` inside the `<Route element={<Shell />}>` layout
3. Wrap in `<RequireAuth>` if protected
4. Add nav item in `web/src/components/Sidebar.tsx`

### New form

End-to-end form flow: schema → API route → page component. No custom mutation hooks needed.

**Step 1 — Shared Zod schema** (`packages/types/src/schemas.ts`):
```ts
export const thingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string(),
  notes: z.string().optional(),
})
export type ThingForm = z.infer<typeof thingSchema>
```

**Step 2 — Re-export** from `packages/types/src/index.ts` (add to existing exports).

**Step 3 — API route** (`api/src/routes/things.ts`):
```ts
import { thingSchema } from '@repo/types'
import { validatedForm } from '../lib/form-helpers.js'

const app = new Hono<{ Variables: AuthVariables }>()

app.post('/things', ...validatedForm(thingSchema), async (c) => {
  const user = getAuthenticatedUser(c)
  const input = c.req.valid('json')
  const [created] = await db.insert(things).values({ ...input, userId: user.id }).returning()
  return c.json({ thing: created })
})
```
`validatedForm(schema)` spreads `requireAuth` + `zValidator` + standard error handler. Mount in `api/src/index.ts`: `app.route(API_PATHS.root, things)`.

**Step 4 — Page component** — one hook, one form. No per-resource mutation hook:
```tsx
import Form from '../components/Form'
import FormField from '../components/FormField'
import FormInput from '../components/FormInput'
import { useFormMutation, queryKeys } from '../lib/hooks'
import { thingSchema, type ThingForm } from '@repo/types'

const createThing = useFormMutation<ThingForm>({
  endpoint: '/api/things',
  method: 'POST',
  invalidateKeys: [queryKeys.things],
})

<Form schema={thingSchema} defaultValues={{ name: '', category: '', notes: '' }}
  onSubmit={(values) => createThing.mutate(values)}>
  <FormField name="name" label="Name" helper="Required">
    <FormInput placeholder="Thing name" />
  </FormField>
  <button type="submit" className="signal-button" disabled={createThing.isPending}>
    Create
  </button>
  <FormError message={createThing.error?.message} />
</Form>
```

`useFormMutation<TInput, TOutput>(opts)` options:

| Option | Purpose |
|---|---|
| `endpoint` | API path to POST/PATCH/PUT to |
| `method` | HTTP method (default `'POST'`) |
| `transformResponse` | Unwrap API wrapper — e.g. `(data) => (data as { user: CurrentUser }).user`. When set, the unwrapped value is used for `setQueryData`. |
| `invalidateKeys` | TanStack Query keys to invalidate on success |
| `setQueryData` | Query key to directly set with the returned data (optimistic update) |

**Step 5 — Render-prop variant** (when you need `reset`, `isDirty`, etc.):
```tsx
<Form schema={s} defaultValues={...} onSubmit={handleSubmit}>
  {(methods) => (
    <>
      <FormField name="x" label="X"><FormInput /></FormField>
      {methods.formState.isDirty && <button type="button" onClick={() => methods.reset()}>Reset</button>}
      <button type="submit">Save</button>
    </>
  )}
</Form>
```

**Available inputs**: `FormInput`, `FormSelect`, `FormTextarea`, `FormCheckbox`. All must be placed inside `<FormField>`.
**Server errors**: `<FormError message={mutation.error?.message} />` outside `FormField`.
**Rich helpers**: wrap content in `<FormHelper>…</FormHelper>`.
**Custom onSuccess**: use TanStack Query's mutate callbacks — `mutation.mutate(values, { onSuccess: () => toast() })`.

### New component

1. Create `web/src/components/<Name>.tsx`
2. Use existing CSS utility classes (`panel-terminal`, `terminal-chip`, etc.)
3. Consume context via `useApp()` if needed
4. Export as default

### New overlay

1. Create `web/src/overlays/<Name>.tsx`
2. Accept `{ onClose: () => void }` props
3. Add boolean state to `app-context.tsx` + `Shell.tsx`
4. Wire in Shell's return: `{<name>Open && <Overlay onClose={...} />}`

## Commands

```bash
pnpm dev         # Start API + Web concurrently
pnpm build       # Type-check + build both
pnpm lint        # ESLint (0 errors required)
pnpm lint:fix    # Auto-fix
pnpm format      # Prettier
pnpm db:setup    # Start DB + migrate
pnpm db:reset    # Destroy DB volume + recreate + migrate
pnpm db:generate # Create migration from schema changes
pnpm db:migrate  # Apply pending migrations
pnpm db:seed     # Insert demo users into DB
```

## Rate limiting

Rate limiting is applied via `hono-rate-limiter` with a swappable store interface.

### Presets

| Route                 | Preset   | Window | Limit | Key           |
| --------------------- | -------- | ------ | ----- | ------------- |
| `/health`             | `health` | 1 min  | 2 000 | IP or user ID |
| `/api/auth/**`        | `auth`   | 1 min  | 100   | IP or user ID |
| `/api/*` (excl. auth) | `api`    | 1 min  | 1 000 | IP or user ID |

### Key generation priority

1. Authenticated user → `user:<id>`
2. `x-forwarded-for` header (first IP in chain)
3. `x-real-ip` header
4. Direct connection IP via `getConnInfo`
5. Fallback → `ip:unknown`

### Disabling in development

Set `RATE_LIMIT_DISABLED=true` in `api/.env` to bypass all limits.

### Swapping the store (Redis example)

The factory accepts an optional `Store` instance:

```ts
import { RedisStore } from 'hono-rate-limiter'

import { createRateLimiter } from './lib/rate-limit.js'

const redisStore = new RedisStore({ client: redis })

app.use('/api/*', createRateLimiter('api', redisStore))
```

Community-compatible stores (e.g. `rate-limit-redis`, `@acpr/rate-limit-postgresql`) work out of the box because `hono-rate-limiter` follows the same interface as `express-rate-limit`.

## Key invariants

- All state-changing API routes must use `requireAuth` middleware
- All request bodies must be validated (Zod preferred)
- No hardcoded deployment platform references (Vercel, Railway, etc.)
- No platform-specific config files
- `pnpm lint` must exit 0 before committing
- `.env` is never committed; `.env.example` has placeholder values with setup instructions
- Session secrets, OAuth keys, and tokens never touch `localStorage`
- Design tokens come from CSS custom properties, not hardcoded hex values in JSX
