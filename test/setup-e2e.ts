import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { execSync } from 'child_process'
import { app } from '@/app'

const prisma = new PrismaClient()

function generateDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Plese provide a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)
  return url.toString()
}

const schemaId = randomUUID()

beforeEach(async () => {
  const databaseURL = generateDatabaseURL(schemaId)
  process.env.DATABASE_URL = databaseURL

  execSync('npx prisma migrate deploy')
  await app.ready() // garantir que o app esteja pronto
})

afterEach(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
  await app.close()
})
