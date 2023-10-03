import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryDoctorRepository } from '@/repositories/in-memory/in-memory-doctors-repository'
import { RegisterDoctorUseCase } from './register-doctor'
import { InMemoryAddressRepository } from '@/repositories/in-memory/in-memory-address-repository'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let doctorsRepository: InMemoryDoctorRepository
let addressRepository: InMemoryAddressRepository
let sut: RegisterDoctorUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    doctorsRepository = new InMemoryDoctorRepository()
    addressRepository = new InMemoryAddressRepository()
    sut = new RegisterDoctorUseCase(doctorsRepository, addressRepository)
  })

  it('should possible to register a doctor with an address', async () => {
    const { doctor } = await sut.execute({
      name: 'Leia',
      email: 'leialb28@gmail.com',
      activated: 1,
      crm: '5432',
      specialty: 'ortopedia',
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

  it('should not be possible to register a doctor with a CRM already registered', async () => {
    const crm = '12345'

    await sut.execute({
      name: 'Leia',
      email: 'leialb28@gmail.com',
      activated: 1,
      crm,
      specialty: 'ortopedia',
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

    await expect(() =>
      sut.execute({
        name: 'Leia',
        email: 'leialb28@gmail.com',
        activated: 1,
        crm,
        specialty: 'ortopedia',
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
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should not be possible to register a doctor with a E-mail already registered', async () => {
    const email = 'joaoedson.dantas@outlook.com'

    await sut.execute({
      name: 'Leia',
      email,
      activated: 1,
      crm: '1234',
      specialty: 'ortopedia',
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

    await expect(() =>
      sut.execute({
        name: 'Leia',
        email,
        activated: 1,
        crm: '3232',
        specialty: 'ortopedia',
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
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
