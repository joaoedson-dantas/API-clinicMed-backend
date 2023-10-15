import { PrismaDoctorRepository } from '@/repositories/prisma/prisma-doctors-repository'

import { GetListDoctorsUseCase } from '../ get-list-doctors'

export function makeGetListDoctorsUseCase() {
  const doctorRepository = new PrismaDoctorRepository()

  const useCase = new GetListDoctorsUseCase(doctorRepository)

  return useCase
}
