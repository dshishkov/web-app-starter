import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { db, sqlClient } from './index.js'

const currentDir = dirname(fileURLToPath(import.meta.url))
const migrationsFolder = resolve(currentDir, '../../drizzle')

try {
  console.warn(`Running database migrations from ${migrationsFolder}`)
  await migrate(db, { migrationsFolder })
  console.warn('Database migrations complete')
} catch (error) {
  console.error('Database migration failed')
  console.error(error)
  process.exitCode = 1
} finally {
  await sqlClient.end()
}
