import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'

import { db } from './db/index.js'
import { env } from './env.js'

const {
  BETTER_AUTH_SECRET,
  BETTER_AUTH_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
} = env()

export const auth = betterAuth({
  baseURL: BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
  }),
  secret: BETTER_AUTH_SECRET,
  socialProviders: {
    google: {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
      nickname: {
        type: 'string',
        required: false,
        defaultValue: null,
        input: true,
      },
    },
  },
  trustedOrigins: [BETTER_AUTH_URL],
})
