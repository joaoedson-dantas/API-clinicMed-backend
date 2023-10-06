import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryAddressRepository } from '@/repositories/in-memory/in-memory-address-repository'
import { ResouceNotFoundError } from './errors/resource-not-found-error'
import { InMemoryPatientRepository } from '@/repositories/in-memory/in-memory-patient-repository'
import { ExclusionOfPatientUseCase } from './patient-exclusion'

let patientsRepository: InMemoryPatientRepository
let addressRepository: InMemoryAddressRepository
let sut: ExclusionOfPatientUseCase
let patientId: string
let activated: boolean

describe('patient exlusion use case', () => {
  beforeEach(async () => {
    patientsRepository = new InMemoryPatientRepository()
    addressRepository = new InMemoryAddressRepository()
    sut = new ExclusionOfPatientUseCase(patientsRepository)

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
    if (typeof patient.activated === 'boolean') {
      activated = patient.activated
    }
  })

  it('should be possible to leave a patient inactive', async () => {
    const { patient } = await sut.execute({
      id: patientId,
      activated,
    })

    expect(patient.activated).toBe(false)
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
