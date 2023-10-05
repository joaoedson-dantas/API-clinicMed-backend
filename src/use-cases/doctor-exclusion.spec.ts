import { expect, describe, it, beforeEach } from 'vitest'

import { InMemoryDoctorRepository } from '@/repositories/in-memory/in-memory-doctors-repository'
import { InMemoryAddressRepository } from '@/repositories/in-memory/in-memory-address-repository'

import { ExclusionOfDoctorsUseCase } from './doctor-exclusion'

let doctorsRepository: InMemoryDoctorRepository
let addressRepository: InMemoryAddressRepository
let sut: ExclusionOfDoctorsUseCase
let doctorId: string
let activated: boolean

describe('Register Use Case', () => {
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

    console.log(doctor.activated)

    expect(doctor.activated).toBe(false)
    /*     expect(doctor).toEqual(
      expect.objectContaining({ name: 'Leia Bernarndo Dantas' }),
    ) */
  })

  /* it('it should not be possible to edit a doctor with a non-existent id', async () => {
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
  }) */
})
