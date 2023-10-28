import { PrismaDoctorRepository } from '@/repositories/prisma/prisma-doctors-repository'
import { GetListDoctorsUseCase } from '../ get-list-doctors'
import { Prisma } from '@/lib/prisma'

export function makeGetListDoctorsUseCase() {
  const prisma = new Prisma()

  const doctorRepository = new PrismaDoctorRepository(prisma)
  const useCase = new GetListDoctorsUseCase(doctorRepository)

  return useCase
}
