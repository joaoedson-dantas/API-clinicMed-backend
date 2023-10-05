import { describe, it, beforeEach, expect } from 'vitest'
import { InMemoryDoctorRepository } from '@/repositories/in-memory/in-memory-doctors-repository'

import { GetListDoctorsUseCase } from './ get-list-doctors'
import { randomUUID } from 'crypto'

let doctorsRepository: InMemoryDoctorRepository

let sut: GetListDoctorsUseCase

describe('Get list doctors use case', () => {
  beforeEach(async () => {
    doctorsRepository = new InMemoryDoctorRepository()
    sut = new GetListDoctorsUseCase(doctorsRepository)

    for (let i = 0; i < 27; i++) {
      await doctorsRepository.create({
        name: `${i}`,
        email: `leialb2${i}@gmail.com`,
        activated: true,
        crm: `4362${i}`,
        specialty: 'ortopedia',
        tel: '85992002329',
        addressId: '123',
      })
    }

    await doctorsRepository.create({
      name: 'xavier',
      email: `xavier$@gmail.com`,
      activated: true,
      crm: `4362$`,
      specialty: 'ortopedia',
      tel: '85992002329',
      addressId: '123',
    })

    await doctorsRepository.create({
      name: 'zelia',
      email: `zelia$@gmail.com`,
      activated: true,
      crm: `4362$`,
      specialty: 'ortopedia',
      tel: '85992002329',
      addressId: '123',
    })

    await doctorsRepository.create({
      name: 'ana clara',
      email: `zelia$@gmail.com`,
      activated: true,
      crm: `4362$`,
      specialty: 'ortopedia',
      tel: '85992002329',
      addressId: '123',
    })
  })

  it('should be able to get 10 doctors per page', async () => {
    const { doctorsOrder } = await sut.execute({ page: 3 })

    expect(doctorsOrder).toHaveLength(10)
    expect(doctorsOrder[doctorsOrder.length - 1]).toEqual(
      expect.objectContaining({
        name: 'zelia',
      }),
    )
  })

  it('should be able to get list order asc', async () => {
    const { doctorsOrder } = await sut.execute({ page: 3 })

    expect(doctorsOrder[doctorsOrder.length - 1]).toEqual(
      expect.objectContaining({
        name: 'zelia',
      }),
    )
  })
})
