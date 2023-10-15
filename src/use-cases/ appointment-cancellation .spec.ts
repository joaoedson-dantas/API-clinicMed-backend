import { expect, describe, it, beforeEach, afterEach } from 'vitest'
import { InMemoryQuerysMedRepository } from '@/repositories/in-memory/in-memory-querys-repository'
import { QueryMedUseCase } from './query-med'
import { InMemoryPatientRepository } from '@/repositories/in-memory/in-memory-patient-repository'
import { RegisterPatientUseCase } from './register-patient'
import { InMemoryAddressRepository } from '@/repositories/in-memory/in-memory-address-repository'

import dayjs from 'dayjs'
import { Specialty } from '@/models/Doctor'

import { InMemoryDoctorRepository } from '@/repositories/in-memory/in-memory-doctors-repository'
import { AppointmentCancellationUseCase } from './ appointment-cancellation'
import { Cancellation } from '@prisma/client'

let querysMedRepository: InMemoryQuerysMedRepository
let patientRepository: InMemoryPatientRepository
let addressRepository: InMemoryAddressRepository
let doctorsRepository: InMemoryDoctorRepository
let patientCreated: RegisterPatientUseCase

let sut: AppointmentCancellationUseCase
let queryCreated: QueryMedUseCase

describe('Appointment Cancellation Use Case', () => {
  beforeEach(async () => {
    querysMedRepository = new InMemoryQuerysMedRepository()
    patientRepository = new InMemoryPatientRepository()
    addressRepository = new InMemoryAddressRepository()
    doctorsRepository = new InMemoryDoctorRepository()
    sut = new AppointmentCancellationUseCase(querysMedRepository)
    patientCreated = new RegisterPatientUseCase(
      patientRepository,
      addressRepository,
    )

    queryCreated = new QueryMedUseCase(
      querysMedRepository,
      patientRepository,
      doctorsRepository,
    )

    for (let i = 0; i < 5; i++) {
      await doctorsRepository.create({
        name: `${i}`,
        email: `leialb2${i}@gmail.com`,
        activated: true,
        crm: `4362${i}`,
        specialty: Specialty.CARDIOLOGIA,
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
        specialty: Specialty.CARDIOLOGIA,
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
    await patientCreated.execute({
      name: 'Leia Bernarndo Viana',
      email: 'leialb29@gmail.com',
      cpf: '04005103325',
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

  it('should be possible to cancel an appointment', async () => {
    vi.setSystemTime(new Date(2023, 9, 10, 13, 0, 0))

    const appointmentTime = dayjs(new Date()).add(31, 'minutes')

    const { query } = await queryCreated.execute({
      patientCPF: '04005103324',
      specialty: 'CARDIOLOGIA',
      start_time: appointmentTime.toDate(),
    })

    expect(query.start_time).toEqual(expect.any(Date))

    const appointmentCancellationTime = dayjs(new Date()).subtract(24, 'hour')
    const { appointmentCancellation } = await sut.execute({
      appointment_id: query.id,
      reason_cancellation: 'MEDICO_CANCELOU',
      cancellation_date: appointmentCancellationTime.toDate(),
    })

    expect(appointmentCancellation.reason_cancellation).toEqual(
      Cancellation.MEDICO_CANCELOU,
    )
  })

  it('should not be possible to cancel a medical appointment', async () => {
    vi.setSystemTime(new Date(2023, 9, 10, 13, 0, 0))

    const appointmentTime = dayjs(new Date()).add(31, 'minute')

    const { query } = await queryCreated.execute({
      patientCPF: '04005103324',
      specialty: 'CARDIOLOGIA',
      start_time: appointmentTime.toDate(),
    })

    // cancelamento com menos de 24 de antecedencia
    const appointmentCancellationTime = dayjs(new Date()).subtract(23, 'hour')
    await expect(() =>
      sut.execute({
        appointment_id: query.id,
        cancellation_date: appointmentCancellationTime.toDate(),
      }),
    ).rejects.toBeInstanceOf(Error)

    // cancelamento com id inexistente
    const appointmentCancellationTime2 = dayjs(new Date()).subtract(25, 'hour')
    await expect(() =>
      sut.execute({
        appointment_id: '24234234234',
        cancellation_date: appointmentCancellationTime2.toDate(),
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
