import { PrismaDoctorRepository } from '@/repositories/prisma/prisma-doctors-repository'
import { ExclusionOfDoctorsUseCase } from '../doctor-exclusion'

export function makeDoctorExclusionUseCase() {
  const doctorRepository = new PrismaDoctorRepository()

  const useCase = new ExclusionOfDoctorsUseCase(doctorRepository)

  return useCase
}
