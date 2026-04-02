// Config Prisma 7 — TypeScript requis uniquement pour ce fichier
import path from 'node:path'
import { defineConfig } from 'prisma/config'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

export default defineConfig({
  schema: path.join(__dirname, 'prisma/schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
  migrate: {
    adapter: async (env: NodeJS.ProcessEnv) => {
      const { Pool } = await import('pg')
      const pool = new Pool({ connectionString: env['DATABASE_URL'] })
      return new PrismaPg(pool)
    },
  },
})
