import { PrismaPatientrepository } from '@/repositories/prisma/prisma-patient-repository'
import { ExclusionOfPatientUseCase } from '../patient-exclusion'
import { Prisma } from '@/lib/prisma'

export function makePatientExclusionUseCase() {
  const prisma = new Prisma()
  const patientsRepository = new PrismaPatientrepository(prisma)
  const useCase = new ExclusionOfPatientUseCase(patientsRepository)

  return useCase
}
