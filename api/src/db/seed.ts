import { sql } from 'drizzle-orm'

import { db } from './index.js'
import { users } from './schema.js'

const seedUsers = [
  {
    id: 'usr_demo_alpha',
    name: 'Alice Chen',
    email: 'alice@example.com',
    emailVerified: true,
    image: null,
    nickname: 'Alpha',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    updatedAt: new Date(),
  },
  {
    id: 'usr_demo_beta',
    name: 'Ben Carter',
    email: 'ben@example.com',
    emailVerified: true,
    image: null,
    nickname: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    updatedAt: new Date(),
  },
  {
    id: 'usr_demo_gamma',
    name: 'Celine Dubois',
    email: 'celine@example.com',
    emailVerified: true,
    image: null,
    nickname: 'Gamma',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    updatedAt: new Date(),
  },
]

async function seed() {
  // eslint-disable-next-line no-console
  console.log('🌱 Seeding database...')

  const existing = await db.select({ count: sql<number>`count(*)` }).from(users)

  const count = existing[0]?.count ?? 0

  if (count > 0) {
    // eslint-disable-next-line no-console
    console.log(`  ${count} user(s) already exist. Skipping seed.`)
    process.exit(0)
  }

  await db.insert(users).values(seedUsers)

  // eslint-disable-next-line no-console
  console.log(`  Inserted ${seedUsers.length} demo users.`)
  // eslint-disable-next-line no-console
  console.log('✅ Seed complete.')
  process.exit(0)
}

seed().catch((error: unknown) => {
  console.error('❌ Seed failed:', error)
  process.exit(1)
})
