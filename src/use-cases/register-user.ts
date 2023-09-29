import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { User } from '@prisma/client'

interface RegisterUsersUseCaseRequest {
  name: string
  login: string
  password: string
}

interface RegisterUsersUseCaseReponse {
  user: User
}

export class RegisterUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    login,
    password,
  }: RegisterUsersUseCaseRequest): Promise<RegisterUsersUseCaseReponse> {
    const password_hash = await hash(password, 6)

    const userWithSameLogin = await this.usersRepository.findByLogin(login)

    if (userWithSameLogin) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      login,
      name,
      password_hash,
    })

    return { user }
  }
}
