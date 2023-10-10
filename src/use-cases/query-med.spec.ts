import { expect, describe, it, beforeEach, afterEach } from 'vitest'
import { InMemoryQuerysMedRepository } from '@/repositories/in-memory/in-memory-querys-repository'
import { QueryMedUseCase } from './query-med'
import { InMemoryPatientRepository } from '@/repositories/in-memory/in-memory-patient-repository'
import { RegisterPatientUseCase } from './register-patient'
import { InMemoryAddressRepository } from '@/repositories/in-memory/in-memory-address-repository'
import { InMemoryDoctorRepository } from '@/repositories/in-memory/in-memory-doctors-repository'
import { PatientInactiveError } from './errors/ patient-inactive-error'

let querysMedRepository: InMemoryQuerysMedRepository
let patientRepository: InMemoryPatientRepository
let addressRepository: InMemoryAddressRepository
let doctorsRepository: InMemoryDoctorRepository
let patientCreated: RegisterPatientUseCase

let sut: QueryMedUseCase

describe('query med Use Case', () => {
  beforeEach(async () => {
    querysMedRepository = new InMemoryQuerysMedRepository()
    patientRepository = new InMemoryPatientRepository()
    addressRepository = new InMemoryAddressRepository()
    doctorsRepository = new InMemoryDoctorRepository()
    sut = new QueryMedUseCase(
      querysMedRepository,
      patientRepository,
      doctorsRepository,
    )
    patientCreated = new RegisterPatientUseCase(
      patientRepository,
      addressRepository,
    )

    for (let i = 0; i < 5; i++) {
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

    for (let i = 0; i < 5; i++) {
      await doctorsRepository.create({
        name: `${i}+${i}`,
        email: `leialb2${i}${i}${i}@gmail.com`,
        activated: false,
        crm: `4362${i}${i}${i}`,
        specialty: 'ortopedia',
        tel: '85992002329',
        addressId: '123',
      })
    }

    await patientCreated.execute({
      name: 'Leia Bernarndo Viana',
      email: 'leialb28@gmail.com',
      cpf: '04005103324',
      tel: '85992002328',
      activated: true,
      address: {
        road: 'Rua São João',
        district: 'Parque Dois Irmãos',
        zip_code: '321412',
        complement: 'apt.04',
        number: '755',
        uf: 'ce',
        city: 'Fortaleza',
      },
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })
  it('should be able to query', async () => {
    vi.setSystemTime(new Date(2023, 12, 20, 8, 0, 0))
    const { query } = await sut.execute({
      patientCPF: '04005103324',
      specialty: 'ortopedia',
      start_time: new Date(),
    })

    expect(query.id).toEqual(expect.any(String))
  })

  it('should be possible to schedule an appointment outside opening hours. from 7am to 7pm ', async () => {
    vi.setSystemTime(new Date(2023, 11, 7, 18, 0, 0))

    const { query } = await sut.execute({
      patientCPF: '04005103324',
      specialty: 'ortopedia',
      start_time: new Date(),
    })

    expect(query.id).toEqual(expect.any(String))
  })

  it('Not should be possible to schedule an appointment outside opening hours. from 7am to 7pm', async () => {
    vi.setSystemTime(new Date(2023, 11, 7, 23, 0, 0))

    await expect(() =>
      sut.execute({
        patientCPF: '04005103324',
        specialty: 'ortopedia',
        start_time: new Date(),
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be possible to schedule appointments with inactive patients in the system', async () => {
    vi.setSystemTime(new Date(2023, 10, 20, 8, 0, 0))
    const { patient } = await patientCreated.execute({
      name: 'Malu Bernardo Dantas',
      email: 'malu@gmail.com',
      cpf: '12345678',
      tel: '85992002328',
      activated: false,
      address: {
        road: 'Rua São João',
        district: 'Parque Dois Irmãos',
        zip_code: '321412',
        complement: 'apt.04',
        number: '755',
        uf: 'ce',
        city: 'Fortaleza',
      },
    })

    expect(patient.id).toEqual(expect.any(String)) // ok - paciente criado

    await expect(() =>
      sut.execute({
        patientCPF: patient.cpf,
        specialty: 'ortopedia',
        start_time: new Date(),
      }),
    ).rejects.toBeInstanceOf(PatientInactiveError)
  })

  it('should not be able to querys in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 12, 20, 8, 0, 0))

    await sut.execute({
      patientCPF: '04005103324',
      specialty: 'ortopedia',
      start_time: new Date(),
    })

    await expect(() =>
      sut.execute({
        patientCPF: '04005103324',
        specialty: 'ortopedia',
        start_time: new Date(),
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('must be possible to select an active doctor available for consultation', async () => {
    vi.setSystemTime(new Date(2023, 10, 20, 8, 0, 0))
    const { query } = await sut.execute({
      patientCPF: '04005103324',
      specialty: 'ortopedia',
      start_time: new Date(),
    })

    expect(query.doctorId).toEqual(expect.any(String))
  })

  it('should not be possible to schedule an appointment when there are no available doctors', async () => {
    vi.setSystemTime(new Date(2023, 10, 20, 8, 0, 0))

    for (let i = 0; i <= 5; i++) {
      await patientRepository.create({
        name: `Leia Bernardo Viana ${i}`,
        email: `leialb${i}@gmail.com`,
        tel: `8592002329`,
        activated: true,
        addressId: '1231231',
        cpf: `040051033${i}${i}`,
      })

      await sut.execute({
        patientCPF: `040051033${i}${i}`,
        specialty: 'ortopedia',
        start_time: new Date(),
      })
    }

    await sut.execute({
      patientCPF: `04005103324`,
      specialty: 'ortopedia',
      start_time: new Date(),
    })
  })
})

/* vi.setSystemTime(new Date(2023, 10, 20, 8, 0, 0)) */

/* { 
ano: 2023,
mês: 09 Setembro, pois p indice é na base 0,
dia: 20,
hora: 8,
minutos: 0,
sec: 0,
} */
