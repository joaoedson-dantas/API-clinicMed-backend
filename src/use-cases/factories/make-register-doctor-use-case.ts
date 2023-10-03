import { PrismaAddressRepository } from '@/repositories/prisma/prisma-address-repository'
import { PrismaDoctorRepository } from '@/repositories/prisma/prisma-doctors-repository'
import { RegisterDoctorUseCase } from '../register-doctor'

export function makeRegisterDoctorUseCase() {
  const doctorsRepository = new PrismaDoctorRepository()
  const addressRepository = new PrismaAddressRepository()
  const registerDoctorUseCase = new RegisterDoctorUseCase(
    doctorsRepository,
    addressRepository,
  )

  return registerDoctorUseCase
}
