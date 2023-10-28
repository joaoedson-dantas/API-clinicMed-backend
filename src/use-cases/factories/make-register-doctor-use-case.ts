import { PrismaAddressRepository } from '@/repositories/prisma/prisma-address-repository'
import { PrismaDoctorRepository } from '@/repositories/prisma/prisma-doctors-repository'
import { RegisterDoctorUseCase } from '../register-doctor'
import { Prisma } from '@/lib/prisma'

export function makeRegisterDoctorUseCase() {
  const prisma = new Prisma()
  const doctorsRepository = new PrismaDoctorRepository(prisma)
  const addressRepository = new PrismaAddressRepository(prisma)
  const registerDoctorUseCase = new RegisterDoctorUseCase(
    doctorsRepository,
    addressRepository,
  )

  return registerDoctorUseCase
}
