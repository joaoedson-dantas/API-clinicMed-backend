import { DoctorRepository } from '../doctor-repository'
import { Doctor } from '@/models/Doctor'
import { randomUUID } from 'crypto'

export class InMemoryDoctorRepository implements DoctorRepository {
  public doctors: Doctor[] = []

  async findManyDoctors(page: number) {
    return this.doctors
      .sort((a, b) => {
        const nameA = a.name.toUpperCase() // Converta para maiúsculas para garantir a ordenação correta
        const nameB = b.name.toUpperCase()

        if (nameA < nameB) {
          return -1
        }

        if (nameA > nameB) {
          return 1
        }

        return 0
      })
      .slice((page - 1) * 10, page * 10)
  }

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
