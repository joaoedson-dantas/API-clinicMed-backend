import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterUsersUseCaseRequest {
  name: string
  login: string
  password: string
}

export class RegisterUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, login, password }: RegisterUsersUseCaseRequest) {
    const password_hash = await hash(password, 6)

    const userWithSameLogin = await this.usersRepository.findByLogin(login)

    if (userWithSameLogin) {
      throw new UserAlreadyExistsError()
    }

    await this.usersRepository.create({
      login,
      name,
      password_hash,
    })
  }
}

// controller vai chamar o caso de uso
