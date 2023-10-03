import { DoctorRepository } from '../doctor-repository'
import { Doctor } from '@/models/Doctor'
import { randomUUID } from 'crypto'

export class InMemoryDoctorRepository implements DoctorRepository {
  public doctors: Doctor[] = []

  async create(data: Doctor) {
    const { activated, crm, email, name, specialty, tel, addressId } = data

    const doctor = {
      id: randomUUID(),
      activated,
      crm,
      email,
      name,
      specialty,
      tel,
      addressId,
    }
    this.doctors.push(doctor)

    return doctor
  }

  async findByCrm(crm: string) {
    const doctor = this.doctors.find((item) => item.crm === crm) || null
    if (!doctor) {
      return null
    }
    return doctor
  }

  async findByEmail(email: string) {
    const doctor = this.doctors.find((item) => item.email === email) || null
    if (!doctor) {
      return null
    }
    return doctor
  }
}
