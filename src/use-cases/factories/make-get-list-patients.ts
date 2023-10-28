import { PrismaPatientrepository } from '@/repositories/prisma/prisma-patient-repository'
import { GetListPatientsActiveUseCase } from '../get-list-patients'
import { Prisma } from '@/lib/prisma'

export function makeGetListPatientsUseCase() {
  const prisma = new Prisma()
  const patientsRepository = new PrismaPatientrepository(prisma)
  const useCase = new GetListPatientsActiveUseCase(patientsRepository)

  return useCase
}
