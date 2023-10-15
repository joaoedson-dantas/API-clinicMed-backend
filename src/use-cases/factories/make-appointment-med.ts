import { PrismaPatientrepository } from '@/repositories/prisma/prisma-patient-repository'
import { PrismaQueryRepository } from '@/repositories/prisma/prisma-query-respository'
import { PrismaDoctorRepository } from '@/repositories/prisma/prisma-doctors-repository'
import { AppointmentMedUseCase } from '../appointment-med'

export function makeAppointmentMedUseCase() {
  const patientsRepository = new PrismaPatientrepository()
  const doctorRepository = new PrismaDoctorRepository()
  const querysMedRepository = new PrismaQueryRepository()
  const useCase = new AppointmentMedUseCase(
    querysMedRepository,
    patientsRepository,
    doctorRepository,
  )

  return useCase
}
