import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResouceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUserRepository
let sut: GetUserProfileUseCase

describe('Get yser profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })
  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'leia',
      login: 'leia',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('leia')
  })

  it('should not be able to get use profile with wrong id', async () => {
    expect(() =>
      sut.execute({
        userId: 'no-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResouceNotFoundError)
  })
})
