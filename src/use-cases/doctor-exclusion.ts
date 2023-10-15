import { DoctorRepository } from '@/repositories/doctor-repository'
import { ResouceNotFoundError } from './errors/resource-not-found-error'
import { Doctor } from '@prisma/client'

interface exclusionOfDoctorsUseCaseRequest {
  id: string
  activated: boolean
}

interface exclusionOfDoctorsUseCaseRsponse {
  doctor: Doctor
}

export class ExclusionOfDoctorsUseCase {
  constructor(private doctorsRepository: DoctorRepository) {}

  async execute({
    id,
    activated,
  }: exclusionOfDoctorsUseCaseRequest): Promise<exclusionOfDoctorsUseCaseRsponse> {
    const doctorExists = await this.doctorsRepository.findById(id)

    // verificando se o medico existe na base de dados
    if (!doctorExists) {
      throw new ResouceNotFoundError()
    }
    // verificando se o médico está ativo
    if (!doctorExists.activated === activated) {
      throw new ResouceNotFoundError()
    }

    const doctor = await this.doctorsRepository.inactivate(id)

    return { doctor }
  }
}
