import { DoctorRepository } from '@/repositories/doctor-repository'
import { Doctor } from '@prisma/client'

interface GetListDoctorsUseCaseRequest {
  page: number
}

interface GetListDoctorsUseCaseResponse {
  doctorsOrder: Array<
    Pick<Doctor, 'name' | 'email' | 'specialty' | 'crm' | 'activated'>
  >
}

export class GetListDoctorsUseCase {
  constructor(private doctorsRepository: DoctorRepository) {}

  async execute({
    page,
  }: GetListDoctorsUseCaseRequest): Promise<GetListDoctorsUseCaseResponse> {
    const doctorsOrder =
      await this.doctorsRepository.findManyDoctorsActived(page)
    return { doctorsOrder }
  }
}
