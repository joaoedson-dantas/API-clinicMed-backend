import { PrismaPatientrepository } from '@/repositories/prisma/prisma-patient-repository'
import { GetListPatientsActiveUseCase } from '../get-list-patients'

export function makeGetListPatientsUseCase() {
  const patientsRepository = new PrismaPatientrepository()
  const useCase = new GetListPatientsActiveUseCase(patientsRepository)

  return useCase
}
