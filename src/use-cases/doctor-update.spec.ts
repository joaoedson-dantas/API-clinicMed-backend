import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryDoctorRepository } from '@/repositories/in-memory/in-memory-doctors-repository'
import { InMemoryAddressRepository } from '@/repositories/in-memory/in-memory-address-repository'
import { DoctorUpdateUseCase } from './doctor-update'

let doctorsRepository: InMemoryDoctorRepository
let addressRepository: InMemoryAddressRepository
let sut: DoctorUpdateUseCase

describe('Register Use Case', () => {
  beforeEach(async () => {
    doctorsRepository = new InMemoryDoctorRepository()
    addressRepository = new InMemoryAddressRepository()
    sut = new DoctorUpdateUseCase(doctorsRepository, addressRepository)

    await addressRepository.create({
      id: '454343',
      city: 'Fortaleza',
      district: 'Granja Portugal',
      road: 'Teodoro de castro',
      uf: 'CE',
      zip_code: '60541195',
    })

    await doctorsRepository.create({
      id: '12345678',
      name: 'ana clara',
      email: `zelia$@gmail.com`,
      activated: 1,
      crm: `4362$`,
      specialty: 'ortopedia',
      tel: '85992002329',
      addressId: '454343',
    })
  })

  it('should be possible to edit a doctor already registered', async () => {
    const { doctor } = await sut.execute({
      id: '12345678',
      name: 'Leia Bernarndo Dantas',
      address: {
        city: 'Enrunepé',
        district: 'Sção José',
        road: 'Rua da leia',
        uf: 'AM',
        zip_code: '504393',
      },
    })

    expect(doctor.id).toEqual(expect.any(String))
    expect(doctor).toEqual([
      expect.objectContaining({ name: 'Leia Bernarndo Dantas' }),
    ])
  })
})
