import { PrismaPatientrepository } from '@/repositories/prisma/prisma-patient-repository'
import { AppointmentWithDoctorAndPatientUseCase } from '../get-appointment-with-doctor-and-patient'
import { PrismaQueryRepository } from '@/repositories/prisma/prisma-query-respository'
import { PrismaDoctorRepository } from '@/repositories/prisma/prisma-doctors-repository'
import { Prisma } from '@/lib/prisma'

export function makeAppointmentWithDoctorAndPatientUseCase() {
  const prisma = new Prisma()

  const patientsRepository = new PrismaPatientrepository(prisma)
  const doctorRepository = new PrismaDoctorRepository(prisma)
  const querysMedRepository = new PrismaQueryRepository(prisma)
  const useCase = new AppointmentWithDoctorAndPatientUseCase(
    querysMedRepository,
    patientsRepository,
    doctorRepository,
  )

  return useCase
}
