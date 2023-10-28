import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '../authenticate'
import { Prisma } from '@/lib/prisma'

export function makeAuthenticateUseCase() {
  const prisma = new Prisma()
  const usersRepository = new PrismaUsersRepository(prisma)
  const authenticateUseCase = new AuthenticateUseCase(usersRepository)

  return authenticateUseCase
}
