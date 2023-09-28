import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class InMemoryUserRepository implements UsersRepository {
  public items: User[] = []

  async findByLogin(login: string) {
    const user = this.items.find((item) => item.login === login)

    if (!user) {
      return null
    }
    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: 'user-1',
      login: 'leia',
      name: data.name,
      password_hash: data.password_hash,
      created_at: new Date(),
    }
    this.items.push(user)
    return user
  }
}
