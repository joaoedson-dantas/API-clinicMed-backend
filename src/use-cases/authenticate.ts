import { UsersRepository } from '@/repositories/users-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { compare } from 'bcryptjs'
import { User } from '@prisma/client'

interface AuthenticateUseCaseRequest {
  login: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    login,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.userRepository.findByLogin(login)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return {
      user,
    }
  }
}

// Toda função assincrona devolve uma promesse
// Processo de autenticação:

// 1 -> Buscar o usuário no banco pelo login,  2 -> comparar se a senha salva no banco bate com a senha enviada pelo request, no caso, com a senha do parametro

// Criar nomes de variáveis como se fose uma pergunta - As senhas se correspodem? Boolean Leitura semantica - Sempre começar com: "is", "has", "does"
