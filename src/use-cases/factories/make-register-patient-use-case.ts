import { PrismaAddressRepository } from '@/repositories/prisma/prisma-address-repository'
import { PrismaPatientrepository } from '@/repositories/prisma/prisma-patient-repository'
import { RegisterPatientUseCase } from '../register-patient'
import { Prisma } from '@/lib/prisma'

export function makeRegisterPatientUseCase() {
  const prisma = new Prisma()
  const patientsRepository = new PrismaPatientrepository(prisma)
  const addressRepository = new PrismaAddressRepository(prisma)
  const useCase = new RegisterPatientUseCase(
    patientsRepository,
    addressRepository,
  )

  return useCase
}
