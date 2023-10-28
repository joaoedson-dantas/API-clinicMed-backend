import { PrismaPatientrepository } from '@/repositories/prisma/prisma-patient-repository'
import { PrismaQueryRepository } from '@/repositories/prisma/prisma-query-respository'
import { PrismaDoctorRepository } from '@/repositories/prisma/prisma-doctors-repository'
import { AppointmentMedUseCase } from '../appointment-med'
import { Prisma } from '@/lib/prisma'

export function makeAppointmentMedUseCase() {
  const prisma = new Prisma()
  const patientsRepository = new PrismaPatientrepository(prisma)
  const doctorRepository = new PrismaDoctorRepository(prisma)
  const querysMedRepository = new PrismaQueryRepository(prisma)
  const useCase = new AppointmentMedUseCase(
    querysMedRepository,
    patientsRepository,
    doctorRepository,
  )

  return useCase
}
