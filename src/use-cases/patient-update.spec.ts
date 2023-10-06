import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryAddressRepository } from '@/repositories/in-memory/in-memory-address-repository'
import { ResouceNotFoundError } from './errors/resource-not-found-error'
import { InMemoryPatientRepository } from '@/repositories/in-memory/in-memory-patient-repository'
import { PatientUpdateUseCase } from './patient-update'

let patientsRepository: InMemoryPatientRepository
let addressRepository: InMemoryAddressRepository
let sut: PatientUpdateUseCase
let patientId: string
let addressId: string

describe('Register Use Case', () => {
  beforeEach(async () => {
    patientsRepository = new InMemoryPatientRepository()
    addressRepository = new InMemoryAddressRepository()
    sut = new PatientUpdateUseCase(patientsRepository, addressRepository)

    const address = await addressRepository.create({
      city: 'Fortaleza',
      district: 'Granja Portugal',
      road: 'Teodoro de castro',
      uf: 'CE',
      zip_code: '60541195',
    })

    const patient = await patientsRepository.create({
      name: 'ana clara',
      email: `zelia$@gmail.com`,
      cpf: '04005103324',
      activated: true,
      tel: '85992002329',
      addressId: address.id,
    })

    patientId = patient.id
    addressId = address.id
  })

  it('should be possible to edit a patient already registered', async () => {
    const { patient } = await sut.execute({
      id: patientId,
      name: 'Leia Bernarndo Dantas',
      tel: '85991711082',
      address: {
        city: 'Enrunepé',
        district: 'São José',
        road: 'Rua da leia',
        uf: 'AM',
        zip_code: '504393',
      },
    })

    console.log(patient)
    expect(patient.addressId).toEqual(addressId)
    expect(patient).toEqual(
      expect.objectContaining({ name: 'Leia Bernarndo Dantas' }),
    )
  })

  it('it should not be possible to edit a patient with a non-existent id', async () => {
    await expect(
      sut.execute({
        id: 'no-exist-id',
        name: 'Leia Bernarndo Dantas',
        tel: '8592002328',
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
