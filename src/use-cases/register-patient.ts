import { Patient } from '@/models/Patient'
import { AddressRepository } from '@/repositories/address-repository'
import { PatientRepository } from '@/repositories/patient-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterPatientUseCaseRequest {
  name: string
  email: string
  tel: string
  cpf: string
  activated: boolean
  address: {
    road: string
    district: string
    zip_code: string
    complement: string
    number: string
    uf: string
    city: string
  }
}

interface RegisterPatientUseCaseResponse {
  patient: Patient
}

export class RegisterPatientUseCase {
  constructor(
    private patientsRepository: PatientRepository,
    private addressRepository: AddressRepository,
  ) {}

  async execute({
    name,
    cpf,
    email,
    tel,
    activated,
    address,
  }: RegisterPatientUseCaseRequest): Promise<RegisterPatientUseCaseResponse> {
    // verificando se já existe um paciente com cpf, e email já cadastrado no db
    const patientWithSameCpf = await this.patientsRepository.findByCPF(cpf)
    const patientWithSameEmail =
      await this.patientsRepository.findByEmail(email)

    if (patientWithSameCpf) {
      throw new UserAlreadyExistsError()
    }

    if (patientWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const { id } = await this.addressRepository.create(address)

    await this.patientsRepository.create({
      name,
      email,
      tel,
      activated,
      addressId: id,
      cpf,
      created_at: new Date(),
    })
    const patient = await this.patientsRepository.findByCPF(cpf)

    if (!patient) {
      throw new Error('Error ao criar o paciente')
    }

    return { patient }
  }
}
