export const API_PATHS = {
  root: '/api',
  apiWildcard: '/api/*',
  authPrefix: '/api/auth',
  authMiddleware: '/api/auth/*',
  authWildcard: '/api/auth/**',
  health: '/health',
} as const

export type RateLimitPreset = 'auth' | 'api' | 'health'

export const API_CORS = {
  localWebOrigins: ['http://localhost:5173'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'PATCH'],
  credentials: true,
}

export const RATE_LIMIT_PRESETS: Record<
  RateLimitPreset,
  { windowMs: number; limit: number }
> = {
  auth: { windowMs: 60_000, limit: 100 },
  api: { windowMs: 60_000, limit: 1000 },
  health: { windowMs: 60_000, limit: 2000 },
}

export function localApiOrigin(port: number): string {
  return port === 3001 ? 'http://localhost:3001' : `http://localhost:${port}`
}
