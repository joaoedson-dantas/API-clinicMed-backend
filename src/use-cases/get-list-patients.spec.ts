import { describe, it, beforeEach, expect } from 'vitest'

import { GetListPatientsActiveUseCase } from './get-list-patients'
import { InMemoryPatientRepository } from '@/repositories/in-memory/in-memory-patient-repository'

let patientsRepository: InMemoryPatientRepository

let sut: GetListPatientsActiveUseCase

describe('Get list patients use case', () => {
  beforeEach(async () => {
    patientsRepository = new InMemoryPatientRepository()
    sut = new GetListPatientsActiveUseCase(patientsRepository)

    for (let i = 0; i < 27; i++) {
      await patientsRepository.create({
        name: `${i}`,
        email: `leialb2${i}@gmail.com`,
        activated: true,
        cpf: '04005103324',
        tel: '85992002329',
        addressId: '123',
      })
    }

    await patientsRepository.create({
      name: 'xavier',
      email: `xavier$@gmail.com`,
      activated: true,
      cpf: '040051003325',
      tel: '85992002329',
      addressId: '123',
    })

    await patientsRepository.create({
      name: 'zelia',
      email: `zelia$@gmail.com`,
      activated: true,
      cpf: '04040404',
      tel: '85992002329',
      addressId: '123',
    })

    await patientsRepository.create({
      name: 'ana clara',
      email: `zelia$@gmail.com`,
      activated: true,
      cpf: 'e53950345',
      tel: '85992002329',
      addressId: '123',
    })
  })

  it('should be able to get 10 patients per page', async () => {
    const { patientsOrder } = await sut.execute({ page: 3 })

    expect(patientsOrder).toHaveLength(10)
    expect(patientsOrder[patientsOrder.length - 1]).toEqual(
      expect.objectContaining({
        name: 'zelia',
      }),
    )
  })

  it('should be able to get list order asc', async () => {
    const { patientsOrder } = await sut.execute({ page: 3 })

    expect(patientsOrder[patientsOrder.length - 1]).toEqual(
      expect.objectContaining({
        name: 'zelia',
      }),
    )
  })
})
