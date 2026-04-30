import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { databaseUrl } from '../env.js'
import * as schema from './schema.js'

const connectionString = databaseUrl()

export const sqlClient = postgres(connectionString)
export const db = drizzle(sqlClient, { schema })
