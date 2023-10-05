import { Patient } from '@/models/Patient'
import { PatientRepository } from '@/repositories/patient-repository'

interface GetListPatientsActiveUseCaseRequest {
  page: number
}

interface GetListPatientsActiveUseCaseResponse {
  patientsOrder: Array<Pick<Patient, 'name' | 'email' | 'cpf' | 'activated'>>
}

export class GetListPatientsActiveUseCase {
  constructor(private patientsRepository: PatientRepository) {}

  async execute({
    page,
  }: GetListPatientsActiveUseCaseRequest): Promise<GetListPatientsActiveUseCaseResponse> {
    const patientsOrder =
      await this.patientsRepository.findManyActivePatients(page)

    return { patientsOrder }
  }
}
