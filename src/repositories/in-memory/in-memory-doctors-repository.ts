import { DoctorRepository } from '../doctor-repository'
import { Doctor } from '@/models/Doctor'
import { $Enums } from '@prisma/client'
import { randomUUID } from 'crypto'

export class InMemoryDoctorRepository implements DoctorRepository {
  public doctors: Doctor[] = []

  async findAllActiveDoctorsBySpecialty(specialty: $Enums.Specialty) {
    return this.doctors
      .filter((doctor) => doctor.activated && doctor.specialty === specialty)
      .map((doctor) => ({
        name: doctor.name,
        email: doctor.email,
        crm: doctor.crm,
        specialty: doctor.specialty,
        activated: doctor.activated,
        id: doctor.id,
      }))
  }

  async updateDoctorWithQuery(doctorId: string, queryId: string) {
    const doctor = await this.findById(doctorId)

    if (!doctor) {
      throw new Error('medico não encontrado')
    }
    doctor.querys = doctor.querys || []
    doctor.querys.push(queryId)

    await this.update(doctor)
    return doctor
  }

  async findManyAllDoctorsActived() {
    return this.doctors
      .filter((doctor) => doctor.activated)
      .map((doctor) => ({
        name: doctor.name,
        email: doctor.email,
        crm: doctor.crm,
        specialty: doctor.specialty,
        activated: doctor.activated,
        id: doctor.id,
      }))
  }

  async inactivate(idDoctor: string) {
    const doctor = (await this.findById(idDoctor)) as Doctor

    const updatedDoctor = { ...doctor, activated: false }

    await this.update(updatedDoctor)

    return updatedDoctor
  }

  async update(
    data: Omit<Doctor, 'email' | 'crm' | 'specialty' | 'activated'>,
  ) {
    const { id, ...dataUpdated } = data

    this.doctors.forEach((doctor, index) => {
      if (doctor.id === id) {
        this.doctors[index] = { ...doctor, ...dataUpdated }
      }
      return doctor
    })

    // as -> Forçando o TS que não vai retornar Underfinid
    const doctor = this.doctors.find((doctor) => doctor.id === id) as Doctor

    return doctor
  }

  async findById(id: string) {
    const doctor = this.doctors.find((item) => item.id === id)

    if (!doctor) {
      return null
    }
    return doctor
  }

  async findManyDoctorsActived(page: number) {
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
      .filter((doctor) => doctor.activated)
      .map((doctor) => ({
        name: doctor.name,
        email: doctor.email,
        crm: doctor.crm,
        specialty: doctor.specialty,
        activated: doctor.activated,
      }))
  }

  async activeDoctor(doctorId: string) {
    const doctor = await this.findById(doctorId)

    if (!doctor) {
      throw new Error()
    }

    if (!doctor.activated) {
      return false
    }
    return true
  }

  async create(data: Omit<Doctor, 'id'>) {
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
