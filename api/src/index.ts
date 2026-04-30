import { serve } from '@hono/node-server'
import { sql } from 'drizzle-orm'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'

import { API_CORS, API_PATHS, localApiOrigin } from './app-config.js'
import { auth } from './auth.js'
import { db } from './db/index.js'
import { env } from './env.js'
import type { AuthVariables } from './lib/auth-middleware.js'
import { createRateLimiter } from './lib/rate-limit.js'
import { users } from './routes/users.js'

/* Validate env immediately */
const config = env()

const app = new Hono<{ Variables: AuthVariables }>()

const ALLOWED_ORIGINS = new Set([
  ...API_CORS.localWebOrigins,
  localApiOrigin(config.PORT),
  ...config.ALLOWED_ORIGINS,
])

app.use('*', logger())
app.use('*', secureHeaders())

app.use(
  '*',
  cors({
    origin: [...ALLOWED_ORIGINS],
    allowHeaders: API_CORS.allowHeaders,
    allowMethods: API_CORS.allowMethods,
    credentials: API_CORS.credentials,
  }),
)

app.use('*', async (c, next) => {
  const origin = c.req.header('Origin')
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return c.json(
      { error: 'Forbidden', message: 'Origin not allowed', status: 403 },
      403,
    )
  }
  return next()
})

/* Rate limiting — swappable store, disabled in dev via RATE_LIMIT_DISABLED */
app.use(API_PATHS.health, createRateLimiter('health'))

app.get(API_PATHS.health, async (c) => {
  try {
    await db.execute(sql`select 1`)
    return c.json({ status: 'ok', db: 'ok', timestamp: Date.now() })
  } catch {
    return c.json(
      { status: 'degraded', db: 'error', timestamp: Date.now() },
      503,
    )
  }
})

app.use(API_PATHS.authMiddleware, createRateLimiter('auth'))
app.on(['POST', 'GET'], API_PATHS.authWildcard, (c) => auth.handler(c.req.raw))

app.use('*', async (c, next) => {
  if (
    c.req.path === API_PATHS.health ||
    c.req.path.startsWith(API_PATHS.authPrefix)
  ) {
    return next()
  }

  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  c.set('user', session?.user ?? null)
  c.set('session', session?.session ?? null)
  return next()
})

app.use(
  API_PATHS.apiWildcard,
  createRateLimiter('api', undefined, (c) =>
    c.req.path.startsWith(API_PATHS.authPrefix),
  ),
)

app.route(API_PATHS.root, users)

app.notFound((c) =>
  c.json(
    {
      error: 'NotFound',
      message: 'Route not found',
      status: 404,
    },
    404,
  ),
)

/* Consistent JSON error responses */
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json(
      {
        error: err.name || 'HTTPException',
        message: err.message,
        status: err.status,
      },
      err.status,
    )
  }

  console.error('Unhandled error:', err)
  return c.json(
    {
      error: 'InternalServerError',
      message: 'An unexpected error occurred.',
      status: 500,
    },
    500,
  )
})

const port = config.PORT
serve({ fetch: app.fetch, port }, () => {
  // eslint-disable-next-line no-console
  console.log(`API running on http://localhost:${port}`)
})
