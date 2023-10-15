import { PrismaPatientrepository } from '@/repositories/prisma/prisma-patient-repository'
import { ExclusionOfPatientUseCase } from '../patient-exclusion'

export function makePatientExclusionUseCase() {
  const patientsRepository = new PrismaPatientrepository()
  const useCase = new ExclusionOfPatientUseCase(patientsRepository)

  return useCase
}
