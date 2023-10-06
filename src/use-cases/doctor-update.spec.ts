import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryDoctorRepository } from '@/repositories/in-memory/in-memory-doctors-repository'
import { InMemoryAddressRepository } from '@/repositories/in-memory/in-memory-address-repository'
import { DoctorUpdateUseCase } from './doctor-update'
import { ResouceNotFoundError } from './errors/resource-not-found-error'

let doctorsRepository: InMemoryDoctorRepository
let addressRepository: InMemoryAddressRepository
let sut: DoctorUpdateUseCase
let doctorId: string
let addressId: string

describe('doctor update use case', () => {
  beforeEach(async () => {
    doctorsRepository = new InMemoryDoctorRepository()
    addressRepository = new InMemoryAddressRepository()
    sut = new DoctorUpdateUseCase(doctorsRepository, addressRepository)

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
    addressId = address.id
  })

  it('should be possible to edit a doctor already registered', async () => {
    const { doctor } = await sut.execute({
      id: doctorId,
      name: 'Leia Bernarndo Dantas',
      address: {
        city: 'Enrunepé',
        district: 'Sção José',
        road: 'Rua da leia',
        uf: 'AM',
        zip_code: '504393',
      },
    })

    expect(doctor.addressId).toEqual(addressId)
    expect(doctor).toEqual(
      expect.objectContaining({ name: 'Leia Bernarndo Dantas' }),
    )
  })

  it('it should not be possible to edit a doctor with a non-existent id', async () => {
    await expect(
      sut.execute({
        id: 'no-exist-id',
        name: 'Leia Bernarndo Dantas',
        address: {
          city: 'Enrunepé',
          district: 'Sção José',
          road: 'Rua da leia',
          uf: 'AM',
          zip_code: '504393',
        },
      }),
    ).rejects.toBeInstanceOf(ResouceNotFoundError)
  })
})
