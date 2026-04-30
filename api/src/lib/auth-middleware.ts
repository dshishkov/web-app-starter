import type { Context } from 'hono'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

import type { auth } from '../auth.js'

export type AuthVariables = {
  user: typeof auth.$Infer.Session.user | null
  session: typeof auth.$Infer.Session.session | null
}

export const requireAuth = createMiddleware<{ Variables: AuthVariables }>(
  async (c, next) => {
    const user = c.get('user')

    if (!user) {
      throw new HTTPException(401, { message: 'Authentication required' })
    }

    return next()
  },
)

export function getAuthenticatedUser(c: Context<{ Variables: AuthVariables }>) {
  const user = c.get('user')

  if (!user) {
    throw new HTTPException(500, {
      message: 'Authenticated user missing after requireAuth middleware',
    })
  }

  return user
}
