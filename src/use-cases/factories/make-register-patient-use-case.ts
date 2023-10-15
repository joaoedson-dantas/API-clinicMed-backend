import { PrismaAddressRepository } from '@/repositories/prisma/prisma-address-repository'
import { PrismaPatientrepository } from '@/repositories/prisma/prisma-patient-repository'
import { RegisterPatientUseCase } from '../register-patient'

export function makeRegisterPatientUseCase() {
  const patientsRepository = new PrismaPatientrepository()
  const addressRepository = new PrismaAddressRepository()
  const useCase = new RegisterPatientUseCase(
    patientsRepository,
    addressRepository,
  )

  return useCase
}
