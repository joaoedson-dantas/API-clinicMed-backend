import { prisma } from '@/lib/prisma'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'
import { hash } from 'bcryptjs'

interface RegisterUseCaseRequest {
  name: string
  login: string
  password: string
}

export async function registerUserUseCase({
  name,
  login,
  password,
}: RegisterUseCaseRequest) {
  const password_hash = await hash(password, 6)
  const userWithSameLogin = await prisma.user.findUnique({
    where: {
      login,
    },
  })

  console.log(userWithSameLogin)

  if (userWithSameLogin) {
    throw new Error('Login already exists')
  }

  // Instaciando o repositorio
  const prismaUsersRepository = new PrismaUsersRepository()
  await prismaUsersRepository.create({
    login,
    name,
    password_hash,
  })
}

// controller vai chamar o caso de uso
