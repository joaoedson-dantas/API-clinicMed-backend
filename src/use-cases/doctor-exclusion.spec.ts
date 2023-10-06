import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryDoctorRepository } from '@/repositories/in-memory/in-memory-doctors-repository'
import { InMemoryAddressRepository } from '@/repositories/in-memory/in-memory-address-repository'

import { ExclusionOfDoctorsUseCase } from './doctor-exclusion'
import { ResouceNotFoundError } from './errors/resource-not-found-error'

let doctorsRepository: InMemoryDoctorRepository
let addressRepository: InMemoryAddressRepository
let sut: ExclusionOfDoctorsUseCase
let doctorId: string
let activated: boolean

describe('Doctor exlusion use case', () => {
  beforeEach(async () => {
    doctorsRepository = new InMemoryDoctorRepository()
    addressRepository = new InMemoryAddressRepository()
    sut = new ExclusionOfDoctorsUseCase(doctorsRepository)

    const address = await addressRepository.create({
      city: 'Fortaleza',
      district: 'Granja Portugal',
      road: 'Teodoro de castro',
      uf: 'CE',
      zip_code: '60541195',
    })

    const doctor = await doctorsRepository.create({
      name: 'ana clara',
      email: `zelia$@gmail.com`,
      activated: true,
      crm: `4362$`,
      specialty: 'ortopedia',
      tel: '85992002329',
      addressId: address.id,
    })

    doctorId = doctor.id
    activated = doctor.activated
  })

  it('should be possible to leave a doctor inactive', async () => {
    const { doctor } = await sut.execute({
      id: doctorId,
      activated,
    })

    expect(doctor.activated).toBe(false)
  })

  it('should not be possible to inactivate a doctor without an ID', async () => {
    await expect(
      sut.execute({
        id: 'no-exist-id',
        activated,
      }),
    ).rejects.toBeInstanceOf(ResouceNotFoundError)
  })

  it('should not be possible to inactivate a doctor who is already inactive', async () => {
    await expect(
      sut.execute({
        id: 'no-exist-id',
        activated: false,
      }),
    ).rejects.toBeInstanceOf(ResouceNotFoundError)
  })
})
