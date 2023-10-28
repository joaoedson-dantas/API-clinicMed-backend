import { PrismaAddressRepository } from '@/repositories/prisma/prisma-address-repository'
import { PrismaPatientrepository } from '@/repositories/prisma/prisma-patient-repository'
import { PatientUpdateUseCase } from '../patient-update'
import { Prisma } from '@/lib/prisma'

export function makePatientUpdateUseCase() {
  const prisma = new Prisma()
  const patientsRepository = new PrismaPatientrepository(prisma)
  const addressRepository = new PrismaAddressRepository(prisma)
  const useCase = new PatientUpdateUseCase(
    patientsRepository,
    addressRepository,
  )

  return useCase
}
