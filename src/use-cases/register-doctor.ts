import { DoctorRepository } from '@/repositories/doctor-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { AddressRepository } from '@/repositories/address-repository'
import { Doctor } from '@/models/Doctor'

interface RegisterDoctorUseCaseResqust {
  name: string
  email: string
  tel: string
  crm: string
  specialty: string
  address: {
    road: string
    district: string
    zip_code: string
    complement: string
    number: string
    uf: string
    city: string
  }
  activated: number
}

interface RegisterDoctorUseCaseResponse {
  doctor: Doctor
}

export class RegisterDoctorUseCase {
  constructor(
    private doctorsRepository: DoctorRepository,
    private addressRepository: AddressRepository,
  ) {}

  async execute({
    name,
    email,
    tel,
    crm,
    specialty,
    address,
    activated,
  }: RegisterDoctorUseCaseResqust): Promise<RegisterDoctorUseCaseResponse> {
    const doctorWithSameCrm = await this.doctorsRepository.findByCrm(crm)
    const doctorWithSameEmail = await this.doctorsRepository.findByEmail(email)

    if (doctorWithSameCrm) {
      throw new UserAlreadyExistsError()
    }

    if (doctorWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const createdAdrress = await this.addressRepository.create(address)

    const doctor = await this.doctorsRepository.create({
      name,
      email,
      tel,
      crm,
      specialty,
      activated,
      addressId: createdAdrress.id,
    })

    return { doctor }
  }
}
