import { zValidator } from '@hono/zod-validator'
import type { z } from 'zod'

import { requireAuth } from './auth-middleware.js'

/**
 * Middleware tuple combining requireAuth + Zod validation for form endpoints.
 *
 * Spread into any Hono method chain before the route handler:
 *
 * @example
 * app.patch('/me/nickname', ...validatedForm(nicknameSchema), async (c) => {
 *   const user = getAuthenticatedUser(c)
 *   const input = c.req.valid('json')
 *   // … DB operation …
 *   return c.json({ user: result })
 * })
 */
export function validatedForm<T extends z.ZodType>(schema: T) {
  return [
    requireAuth,
    zValidator('json', schema, (result, c) => {
      if (!result.success) {
        return c.json(
          {
            error: 'BadRequest',
            message:
              result.error.issues[0]?.message ?? 'Invalid request body',
            status: 400,
          },
          400,
        )
      }
    }),
  ] as const
}
