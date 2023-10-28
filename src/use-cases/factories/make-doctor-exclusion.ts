import { PrismaDoctorRepository } from '@/repositories/prisma/prisma-doctors-repository'
import { ExclusionOfDoctorsUseCase } from '../doctor-exclusion'
import { Prisma } from '@/lib/prisma'

export function makeDoctorExclusionUseCase() {
  const prisma = new Prisma()
  const doctorRepository = new PrismaDoctorRepository(prisma)
  const useCase = new ExclusionOfDoctorsUseCase(doctorRepository)
  return useCase
}
