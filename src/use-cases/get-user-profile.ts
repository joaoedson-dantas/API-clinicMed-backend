import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { ResouceNotFoundError } from './errors/resource-not-found-error'

// id vai ser a única informação que será possível ter acesso após o usuário logar, id nunca vai ser alterado
interface GetUserProfileUseCaseRequest {
  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new ResouceNotFoundError()
    }

    return {
      user,
    }
  }
}
