import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryQuerysMedRepository } from '@/repositories/in-memory/in-memory-querys-repository'
import { QueryMedUseCase } from './query-med'

let querysMedRepository: InMemoryQuerysMedRepository
let sut: QueryMedUseCase

describe('query med Use Case', () => {
  beforeEach(() => {
    querysMedRepository = new InMemoryQuerysMedRepository()
    sut = new QueryMedUseCase(querysMedRepository)
  })

  it('should be able to query', async () => {
    const { query } = await sut.execute({
      doctorId: 'doctor-01',
      patientId: 'patient-01',
      specialty: 'ortopedia',
      start_time: new Date(),
    })

    expect(query.id).toEqual(expect.any(String))
  })

  it('should not be able to querys in twice in the same day', async () => {
    await sut.execute({
      doctorId: 'doctor-01',
      patientId: 'patient-01',
      specialty: 'ortopedia',
      start_time: new Date(),
    })

    await expect(() =>
      sut.execute({
        doctorId: 'doctor-01',
        patientId: 'patient-01',
        specialty: 'ortopedia',
        start_time: new Date(),
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
