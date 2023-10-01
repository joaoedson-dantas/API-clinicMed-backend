import { DoctorRepository } from '../doctor-repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { Doctor } from '@/models/Doctor'
import { randomUUID } from 'crypto'

export class InMemoryDoctorRepository implements DoctorRepository {
  public doctors: Doctor[] = []

  async create(data: Doctor) {
    const { activated, crm, email, name, specialty, tel, addressId } = data

    const doctor: Doctor = {
      activated,
      crm,
      email,
      name,
      specialty,
      id: randomUUID(),
      tel,
      addressId,
    }

    this.doctors.push()
    return doctor
  }

  async findByCrm(crm: string) {
    const doctor = await this.doctors.find((item) => item.crm === crm)
    if (!doctor) {
      throw new UserAlreadyExistsError()
    }
    return doctor
  }
}
