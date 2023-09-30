import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUsersUseCase } from './register-user'
import { compare } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { InMemoryDoctorRepository } from '@/repositories/in-memory/in-memory-doctors-repository'
import { RegisterDoctorUseCase } from './register-doctor'

let doctorsRepository: InMemoryDoctorRepository
let sut: RegisterUsersUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    doctorsRepository = new InMemoryUserRepository()
    sut = new RegisterDoctorUseCase(doctorsRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      login: 'leia',
      name: 'leia',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      login: 'leia',
      name: 'leia',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same login twice', async () => {
    const login = 'leia'

    await sut.execute({
      login,
      name: 'leia',
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        login,
        name: 'leia',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
