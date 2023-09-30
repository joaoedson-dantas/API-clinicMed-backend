import { Doctor, Prisma } from '@prisma/client'
import { DoctorRepository } from '../doctor-repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

export class InMemoryDoctorRepository implements DoctorRepository {
  public doctors: Doctor[] = []

  async create(data: Prisma.DoctorCreateInput) {
    const doctor = {
      ...data,
    }

    this.doctors.push(doctor)
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
