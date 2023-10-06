import { ResouceNotFoundError } from './errors/resource-not-found-error'
import { Patient } from '@/models/Patient'
import { PatientRepository } from '@/repositories/patient-repository'

interface exclusionOfPatientUseCaseRequest {
  id: string
  activated: boolean
}

interface exclusionOfPatientUseCaseRsponse {
  patient: Patient
}

export class ExclusionOfPatientUseCase {
  constructor(private patientRepository: PatientRepository) {}

  async execute({
    id,
    activated,
  }: exclusionOfPatientUseCaseRequest): Promise<exclusionOfPatientUseCaseRsponse> {
    const patientExists = await this.patientRepository.findById(id)

    // verificando se o medico existe na base de dados
    if (!patientExists) {
      throw new ResouceNotFoundError()
    }
    // verificando se o médico está ativo
    if (!patientExists.activated === activated) {
      throw new ResouceNotFoundError()
    }

    const patient = await this.patientRepository.inactivate(id)

    return { patient }
  }
}
