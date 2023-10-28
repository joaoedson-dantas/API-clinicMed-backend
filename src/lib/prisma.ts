import { PrismaClient } from '@prisma/client'
import { env } from 'process'

export class Prisma extends PrismaClient {
  constructor() {
    super({ log: env.NODE_ENV === 'dev' ? ['query'] : [] })
  }
}
