import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  findByLogin(login: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
}
