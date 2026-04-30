import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { z } from 'zod'

import { db } from '../db/index.js'
import { users } from '../db/schema.js'
import type { AuthVariables } from '../lib/auth-middleware.js'
import { getAuthenticatedUser, requireAuth } from '../lib/auth-middleware.js'

export const nicknameSchema = z.object({
  nickname: z.preprocess((value) => {
    if (typeof value !== 'string') return value
    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : null
  }, z.string().min(1).max(100).nullable()),
})

const app = new Hono<{ Variables: AuthVariables }>()

app.get('/users', requireAuth, async (c) => {
  const allUsers = await db
    .select({
      id: users.id,
      name: users.name,
      image: users.image,
      nickname: users.nickname,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
  return c.json({ users: allUsers })
})

app.get('/me', requireAuth, async (c) => {
  const user = getAuthenticatedUser(c)

  const fullUsers = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      nickname: users.nickname,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, user.id))
  const fullUser = fullUsers.at(0)

  if (!fullUser) {
    throw new HTTPException(404, { message: 'Authenticated user not found' })
  }

  return c.json({ user: fullUser })
})

app.patch(
  '/me/nickname',
  requireAuth,
  zValidator('json', nicknameSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          error: 'BadRequest',
          message: result.error.issues[0]?.message ?? 'Invalid request body',
          status: 400,
        },
        400,
      )
    }
  }),
  async (c) => {
    const user = getAuthenticatedUser(c)
    const { nickname } = c.req.valid('json')

    const updatedUsers = await db
      .update(users)
      .set({ nickname, updatedAt: new Date() })
      .where(eq(users.id, user.id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        nickname: users.nickname,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
    const updated = updatedUsers.at(0)

    if (!updated) {
      throw new HTTPException(404, { message: 'Authenticated user not found' })
    }

    return c.json({ user: updated })
  },
)

export { app as users }
