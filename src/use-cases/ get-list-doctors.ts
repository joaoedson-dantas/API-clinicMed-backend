import { Doctor } from '@/models/Doctor'
import { DoctorRepository } from '@/repositories/doctor-repository'

interface GetListDoctorsUseCaseRequest {
  page: number
}

interface GetListDoctorsUseCaseResponse {
  doctorsOrder: Doctor[]
}

export class GetListDoctorsUseCase {
  constructor(private doctorsRepository: DoctorRepository) {}

  async execute({
    page,
  }: GetListDoctorsUseCaseRequest): Promise<GetListDoctorsUseCaseResponse> {
    const doctorsOrder = await this.doctorsRepository.findManyDoctors(page)
    return { doctorsOrder }
  }
}
