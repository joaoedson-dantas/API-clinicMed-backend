import { PrismaPatientrepository } from '@/repositories/prisma/prisma-patient-repository'
import { AppointmentWithDoctorAndPatientUseCase } from '../get-appointment-with-doctor-and-patient'
import { PrismaQueryRepository } from '@/repositories/prisma/prisma-query-respository'
import { PrismaDoctorRepository } from '@/repositories/prisma/prisma-doctors-repository'

export function makeAppointmentWithDoctorAndPatientUseCase() {
  const patientsRepository = new PrismaPatientrepository()
  const doctorRepository = new PrismaDoctorRepository()
  const querysMedRepository = new PrismaQueryRepository()
  const useCase = new AppointmentWithDoctorAndPatientUseCase(
    querysMedRepository,
    patientsRepository,
    doctorRepository,
  )

  return useCase
}
