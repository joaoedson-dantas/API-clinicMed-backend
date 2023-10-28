import { PrismaDoctorRepository } from '@/repositories/prisma/prisma-doctors-repository'
import { DoctorUpdateUseCase } from '../doctor-update'
import { PrismaAddressRepository } from '@/repositories/prisma/prisma-address-repository'
import { Prisma } from '@/lib/prisma'

export function makeDoctorUpdateUseCase() {
  const prisma = new Prisma()
  const doctorRepository = new PrismaDoctorRepository(prisma)
  const addressRepository = new PrismaAddressRepository(prisma)

  const useCase = new DoctorUpdateUseCase(doctorRepository, addressRepository)

  return useCase
}
