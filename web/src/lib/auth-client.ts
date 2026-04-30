import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

import { API_ENDPOINTS } from './app-config'

export const authClient = createAuthClient({
  basePath: API_ENDPOINTS.auth,
  plugins: [
    inferAdditionalFields({
      user: {
        nickname: {
          type: 'string',
          required: false,
          defaultValue: null,
          input: true,
        },
      },
    }),
  ],
})

export const { signIn, signOut, useSession } = authClient
