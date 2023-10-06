import { AddressRepository } from '@/repositories/address-repository'
import { ResouceNotFoundError } from './errors/resource-not-found-error'
import { Patient } from '@/models/Patient'
import { PatientRepository } from '@/repositories/patient-repository'

interface PatientUpdateUseCaseRequest {
  id: string
  name: string
  tel: string
  address: {
    road: string
    district: string
    zip_code: string
    complement?: string
    number?: string
    uf: string
    city: string
  }
}

interface PatientUpdateUseCaseResponse {
  patient: Patient
}

export class PatientUpdateUseCase {
  constructor(
    private patientRepository: PatientRepository,
    private addressRepository: AddressRepository,
  ) {}

  async execute(
    data: PatientUpdateUseCaseRequest,
  ): Promise<PatientUpdateUseCaseResponse> {
    const patientToBeUpdated = await this.patientRepository.findById(data.id)

    // Verificando se medico existe
    if (!patientToBeUpdated) {
      throw new ResouceNotFoundError()
    }

    // atualizando o endereço
    let addressPatient = await this.addressRepository.getAddressById(
      patientToBeUpdated.addressId,
    )

    addressPatient = {
      id: patientToBeUpdated.addressId,
      ...data.address,
    }

    const { id: addressId } =
      await this.addressRepository.update(addressPatient)

    // atualizando o medico

    const patientUpdated: Patient = {
      id: data.id,
      email: patientToBeUpdated.email,
      cpf: patientToBeUpdated.cpf,
      name: data.name,
      tel: data.tel,
      addressId,
    }

    const patient = await this.patientRepository.update(patientUpdated)

    return { patient }
  }
}
