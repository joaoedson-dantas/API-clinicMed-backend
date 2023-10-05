import { Doctor } from '@/models/Doctor'
import { AddressRepository } from '@/repositories/address-repository'
import { DoctorRepository } from '@/repositories/doctor-repository'
import { ResouceNotFoundError } from './errors/resource-not-found-error'

interface DoctorUpdateUseCaseRequest {
  id: string
  name: string
  tel?: string
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

interface DoctorUpdateUseCaseResponse {
  doctor: Doctor
}

export class DoctorUpdateUseCase {
  constructor(
    private doctorsRepository: DoctorRepository,
    private addressRepository: AddressRepository,
  ) {}

  async execute(
    data: DoctorUpdateUseCaseRequest,
  ): Promise<DoctorUpdateUseCaseResponse> {
    const doctorToBeUpdated = await this.doctorsRepository.findById(data.id)

    // Verificando se medico existe
    if (!doctorToBeUpdated) {
      throw new ResouceNotFoundError()
    }

    // atualizando o endereço
    let addressDoctor = await this.addressRepository.getAddressById(
      doctorToBeUpdated.addressId,
    )

    addressDoctor = {
      id: doctorToBeUpdated.addressId,
      ...data.address,
    }

    const { id: addressId } = await this.addressRepository.update(addressDoctor)

    // atualizando o medico

    const doctorUpdated: Doctor = {
      id: doctorToBeUpdated.id,
      name: data.name,
      tel: doctorToBeUpdated.tel,
      crm: doctorToBeUpdated.crm,
      activated: doctorToBeUpdated.activated,
      email: doctorToBeUpdated.email,
      specialty: doctorToBeUpdated.specialty,
      addressId,
    }
    const doctor = await this.doctorsRepository.update(doctorUpdated)

    return { doctor }
  }
}
