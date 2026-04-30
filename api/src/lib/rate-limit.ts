import { getConnInfo } from '@hono/node-server/conninfo'
import { rateLimiter } from 'hono-rate-limiter'
import type { Store } from 'hono-rate-limiter'

import { RATE_LIMIT_PRESETS } from '../app-config.js'
import type { RateLimitPreset } from '../app-config.js'
import { env } from '../env.js'

export type { RateLimitPreset } from '../app-config.js'

function getClientKey(c: {
  get: (key: 'user') => { id?: string } | null
  req: { header: (name: string) => string | undefined; path: string }
}): string {
  const user = c.get('user')
  if (user?.id) return `user:${user.id}`

  if (env().TRUST_PROXY_HEADERS) {
    // Only trust these headers behind a trusted reverse proxy.
    // x-forwarded-for may be a chain: client, proxy1, proxy2.
    const forwarded = c.req.header('x-forwarded-for')
    if (forwarded) {
      const clientIp = forwarded.split(',')[0]?.trim()
      if (clientIp) return `ip:${clientIp}`
    }

    const realIp = c.req.header('x-real-ip')
    if (realIp) return `ip:${realIp}`
  }

  // Direct connection fallback
  try {
    const conn = getConnInfo(c as unknown as Parameters<typeof getConnInfo>[0])
    const directIp = conn.remote.address
    if (directIp) return `ip:${directIp}`
  } catch {
    // getConnInfo may throw outside Node.js runtime
  }

  return 'ip:unknown'
}

export function createRateLimiter(
  preset: RateLimitPreset,
  store?: Store,
  skip?: (c: { req: { path: string } }) => boolean,
) {
  const config = RATE_LIMIT_PRESETS[preset]

  return rateLimiter({
    windowMs: config.windowMs,
    limit: config.limit,
    store,
    keyGenerator: getClientKey as unknown as Parameters<
      typeof rateLimiter
    >[0]['keyGenerator'],
    handler: (c) =>
      c.json(
        {
          error: 'TooManyRequests',
          message: 'Rate limit exceeded. Please try again later.',
          status: 429,
        },
        429,
      ),
    skip: (c) => {
      if (env().RATE_LIMIT_DISABLED) return true
      if (skip?.(c)) return true
      return false
    },
  })
}
