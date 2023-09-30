import { DoctorRepository } from '@/repositories/doctor-repository'
import { Doctor } from '@prisma/client'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterDoctorUseCaseResqust {
  name: string
  email: string
  tel: string
  crm: string
  specialty: string
  address: {
    road: string
    district: string
    cep: string
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
  constructor(private doctorsRepository: DoctorRepository) {}

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

    if (doctorWithSameCrm) {
      throw new UserAlreadyExistsError()
    }
    const doctor = await this.doctorsRepository.create({
      name,
      email,
      tel,
      crm,
      specialty,
      activated,
      address: {
        create: {
          ...address,
        },
      },
    })

    return { doctor }
  }
}
