import { PrismaDoctorRepository } from '@/repositories/prisma/prisma-doctors-repository'
import { DoctorUpdateUseCase } from '../doctor-update'
import { PrismaAddressRepository } from '@/repositories/prisma/prisma-address-repository'

export function makeDoctorUpdateUseCase() {
  const doctorRepository = new PrismaDoctorRepository()
  const addressRepository = new PrismaAddressRepository()

  const useCase = new DoctorUpdateUseCase(doctorRepository, addressRepository)

  return useCase
}
