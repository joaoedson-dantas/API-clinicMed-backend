import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserProfileUseCase } from '../get-user-profile'
import { Prisma } from '@/lib/prisma'

export function makeGetUserProfileUseCase() {
  const prisma = new Prisma()
  const usersRepository = new PrismaUsersRepository(prisma)
  const useCase = new GetUserProfileUseCase(usersRepository)

  return useCase
}
