import { AppointmentCancellationUseCase } from '../ appointment-cancellation'
import { PrismaQueryRepository } from '@/repositories/prisma/prisma-query-respository'

export function makeAppointmentCancellationUseCase() {
  const querysMedRepository = new PrismaQueryRepository()
  const useCase = new AppointmentCancellationUseCase(querysMedRepository)

  return useCase
}
