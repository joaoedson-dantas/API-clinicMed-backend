import { Doctor } from '@/models/Doctor'
import { DoctorRepository } from '@/repositories/doctor-repository'
import { ResouceNotFoundError } from './errors/resource-not-found-error'

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

    const inactiveDoctor = { ...doctorExists, activated: false }

    const doctor = await this.doctorsRepository.update(inactiveDoctor)

    return { doctor }
  }
}
