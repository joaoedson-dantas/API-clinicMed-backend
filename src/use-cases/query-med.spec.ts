import { expect, describe, it, beforeEach, afterEach } from 'vitest'
import { InMemoryQuerysMedRepository } from '@/repositories/in-memory/in-memory-querys-repository'
import { QueryMedUseCase } from './query-med'

let querysMedRepository: InMemoryQuerysMedRepository
let sut: QueryMedUseCase

describe('query med Use Case', () => {
  beforeEach(() => {
    querysMedRepository = new InMemoryQuerysMedRepository()
    sut = new QueryMedUseCase(querysMedRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })
  it('should be able to query', async () => {
    vi.setSystemTime(new Date(2023, 12, 20, 8, 0, 0))
    const { query } = await sut.execute({
      doctorId: 'doctor-01',
      patientId: 'patient-01',
      specialty: 'ortopedia',
      start_time: new Date(),
    })

    expect(query.id).toEqual(expect.any(String))
  })

  it('should not be able to querys in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 12, 20, 8, 0, 0))

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

  it('should be possible to schedule an appointment outside opening hours. from 7am to 7pm ', async () => {
    vi.setSystemTime(new Date(2023, 11, 7, 18, 0, 0))

    const { query } = await sut.execute({
      doctorId: 'doctor-01',
      patientId: 'patient-01',
      specialty: 'ortopedia',
      start_time: new Date(),
    })

    expect(query.id).toEqual(expect.any(String))
  })

  it('It should not be possible to schedule an appointment outside opening hours. from 7am to 7pm ', async () => {
    vi.setSystemTime(new Date(2023, 11, 7, 20, 0, 0))

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

/* vi.setSystemTime(new Date(2023, 10, 20, 8, 0, 0))

ano: 2023
mês: 09 Setembro, pois p indice é na base 0
dia: 20
hora: 8,
minutos: 0,
sec: 0

l
*/
