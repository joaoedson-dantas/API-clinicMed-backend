import { Doctor } from '@/models/Doctor'
import { DoctorRepository } from '@/repositories/doctor-repository'

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
