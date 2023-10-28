import { Prisma } from '@/lib/prisma'
import { AppointmentCancellationUseCase } from '../ appointment-cancellation'
import { PrismaQueryRepository } from '@/repositories/prisma/prisma-query-respository'

export function makeAppointmentCancellationUseCase() {
  const prisma = new Prisma()
  const querysMedRepository = new PrismaQueryRepository(prisma)
  const useCase = new AppointmentCancellationUseCase(querysMedRepository)

  return useCase
}
