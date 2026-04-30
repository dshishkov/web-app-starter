import { z } from 'zod'

function normalizeOrigin(rawOrigin: string): string {
  const withProtocol =
    rawOrigin.startsWith('http://') || rawOrigin.startsWith('https://')
      ? rawOrigin
      : `https://${rawOrigin}`
  return new URL(withProtocol).origin
}

const originListSchema = z
  .string()
  .default('')
  .transform((value, ctx) => {
    const origins = value
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)

    const normalized: string[] = []

    for (const origin of origins) {
      try {
        normalized.push(normalizeOrigin(origin))
      } catch {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Invalid origin: ${origin}`,
        })
        return z.NEVER
      }
    }

    return [...new Set(normalized)]
  })

const databaseUrlSchema = z.string().url('DATABASE_URL must be a valid URL')

const envSchema = z.object({
  DATABASE_URL: databaseUrlSchema,
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, 'BETTER_AUTH_SECRET must be at least 32 characters')
    .refine((val) => !val.startsWith('change-me'), {
      message: 'BETTER_AUTH_SECRET must be changed from the placeholder value.',
    }),
  BETTER_AUTH_URL: z
    .string()
    .url('BETTER_AUTH_URL must be a valid URL')
    .transform((value) => value.replace(/\/$/, '')),
  GOOGLE_CLIENT_ID: z
    .string()
    .min(1, 'GOOGLE_CLIENT_ID is required')
    .refine((val) => val !== 'your-google-client-id', {
      message:
        'GOOGLE_CLIENT_ID has not been configured. Replace the placeholder in your .env file.',
    }),
  GOOGLE_CLIENT_SECRET: z
    .string()
    .min(1, 'GOOGLE_CLIENT_SECRET is required')
    .refine((val) => val !== 'your-google-client-secret', {
      message:
        'GOOGLE_CLIENT_SECRET has not been configured. Replace the placeholder in your .env file.',
    }),
  PORT: z
    .string()
    .default('3001')
    .transform((value, ctx) => {
      const port = Number(value)
      if (!Number.isInteger(port) || port < 1 || port > 65535) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'PORT must be an integer between 1 and 65535',
        })
        return z.NEVER
      }
      return port
    }),
  ALLOWED_ORIGIN: originListSchema,
  ALLOWED_ORIGINS: originListSchema,
  RATE_LIMIT_DISABLED: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
  TRUST_PROXY_HEADERS: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
})

type ParsedEnv = Omit<z.infer<typeof envSchema>, 'ALLOWED_ORIGIN'>

let parsedEnv: ParsedEnv | null = null
let parsedDatabaseUrl: string | null = null

export function databaseUrl() {
  if (parsedEnv) return parsedEnv.DATABASE_URL
  if (parsedDatabaseUrl) return parsedDatabaseUrl

  const result = databaseUrlSchema.safeParse(process.env.DATABASE_URL)
  if (!result.success) {
    throw new Error(
      `Environment validation failed:\n  - DATABASE_URL: ${result.error.issues[0]?.message ?? 'Invalid database URL'}`,
    )
  }

  parsedDatabaseUrl = result.data
  return parsedDatabaseUrl
}

export function env() {
  if (parsedEnv) return parsedEnv
  const result = envSchema.safeParse(process.env)
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
      .join('\n')
    throw new Error(`Environment validation failed:\n${issues}`)
  }
  parsedEnv = {
    ...result.data,
    ALLOWED_ORIGINS: [
      ...new Set([
        ...result.data.ALLOWED_ORIGIN,
        ...result.data.ALLOWED_ORIGINS,
      ]),
    ],
  }
  return parsedEnv
}
