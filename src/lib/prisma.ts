// Exportando a conexão com o banco
/* import { env } from '@/env'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})
 */
import { PrismaClient } from '@prisma/client'

export class Prisma extends PrismaClient {
  constructor() {
    super({ log: ['query'] })
  }
}
