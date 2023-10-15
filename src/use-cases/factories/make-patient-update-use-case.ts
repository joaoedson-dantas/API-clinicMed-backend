import { PrismaAddressRepository } from '@/repositories/prisma/prisma-address-repository'
import { PrismaPatientrepository } from '@/repositories/prisma/prisma-patient-repository'
import { PatientUpdateUseCase } from '../patient-update'

export function makePatientUpdateUseCase() {
  const patientsRepository = new PrismaPatientrepository()
  const addressRepository = new PrismaAddressRepository()
  const useCase = new PatientUpdateUseCase(
    patientsRepository,
    addressRepository,
  )

  return useCase
}
