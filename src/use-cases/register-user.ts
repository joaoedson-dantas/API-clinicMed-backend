import { prisma } from '@/lib/prisma'
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

  await prisma.user.create({
    data: {
      name,
      login,
      password_hash,
    },
  })
}

// controller vai chamar o caso de uso
