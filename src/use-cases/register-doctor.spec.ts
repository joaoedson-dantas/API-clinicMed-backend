import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryDoctorRepository } from '@/repositories/in-memory/in-memory-doctors-repository'
import { RegisterDoctorUseCase } from './register-doctor'
import { InMemoryAddressRepository } from '@/repositories/in-memory/in-memory-address-repository'

let doctorsRepository: InMemoryDoctorRepository
let addressRepository: InMemoryAddressRepository
let sut: RegisterDoctorUseCase

describe('Register Doctor Use Case', () => {
  beforeEach(() => {
    doctorsRepository = new InMemoryDoctorRepository()
    addressRepository = new InMemoryAddressRepository()
    sut = new RegisterDoctorUseCase(doctorsRepository, addressRepository)
  })

  it('should possible to register a doctor with an address', async () => {
    const { doctor } = await sut.execute({
      name: 'Leia',
      email: 'leialb28@gmail.com',
      activated: true,
      crm: '1235-ce',
      specialty: 'CARDIOLOGIA',
      tel: '85992002329',
      address: {
        city: 'Fortaleza',
        district: 'Granja Portugal',
        road: 'teododro',
        uf: 'ce',
        zip_code: '60541195',
        complement: 'ap5',
        number: '766',
      },
    })

    expect(doctor.id).toEqual(expect.any(String))
    expect(addressRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: doctor.addressId,
        }),
      ]),
    )
    expect(addressRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          city: 'Fortaleza',
        }),
      ]),
    )
  })
})
