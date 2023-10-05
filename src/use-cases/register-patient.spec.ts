import { expect, describe, it, beforeEach } from 'vitest'

import { RegisterDoctorUseCase } from './register-doctor'
import { InMemoryAddressRepository } from '@/repositories/in-memory/in-memory-address-repository'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { InMemoryPatientRepository } from '@/repositories/in-memory/in-memory-patient-repository'
import { RegisterPatientUseCase } from './register-patient'

let patientRepository: InMemoryPatientRepository
let addressRepository: InMemoryAddressRepository
let sut: RegisterPatientUseCase

describe('Register Patient Use Case', () => {
  beforeEach(() => {
    patientRepository = new InMemoryPatientRepository()
    addressRepository = new InMemoryAddressRepository()
    sut = new RegisterPatientUseCase(patientRepository, addressRepository)
  })

  it('should be possible to register a patient with an address', async () => {
    const { patient } = await sut.execute({
      name: 'João Edson Dantas',
      email: 'joaoedson.dantas@outlook.com',
      cpf: '0504040404',
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

    expect(patient.id).toEqual(expect.any(String))
    expect(addressRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: patient.addressId,
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

  it('should not be possible to register a patient with a Email already registered', async () => {
    const email = 'leialb28@gmail.com'

    await sut.execute({
      name: 'Leia Bernarndo Viana',
      email,
      cpf: '123123123',
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

    await expect(() =>
      sut.execute({
        name: 'Leia Bernarndo Viana',
        email,
        cpf: '2423432432',
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
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should not be possible to register a patient with a CPF already registered', async () => {
    const cpf = '02694414257'

    await sut.execute({
      name: 'Leia Bernarndo Viana',
      email: 'leia3233@333.com',
      cpf,
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

    await expect(() =>
      sut.execute({
        name: 'Leia Bernarndo Viana',
        email: 'leia@leia.com',
        cpf,
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
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
