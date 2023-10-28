import { Prisma, PrismaClient } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })
    return user
  }

  async findByLogin(login: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        login,
      },
    })
    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await this.prisma.user.create({
      data,
    })
    return user
  }
}
