import { defineConfig } from 'drizzle-kit'
import { loadEnvFile } from 'node:process'

import { databaseUrl } from './src/env.js'

try {
  loadEnvFile('.env')
} catch {
  // CI and production can provide DATABASE_URL directly.
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl(),
  },
})
