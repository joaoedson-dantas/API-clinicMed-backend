import { Prisma } from '@prisma/client'
import { DoctorRepository } from '../doctor-repository'
import { prisma } from '@/lib/prisma'

export class PrismaDoctorRepository implements DoctorRepository {
  async create(data: Prisma.DoctorCreateInput) {
    const doctor = await prisma.doctor.create({
      data,
    })
    return doctor
  }

  async findByCrm(crm: string) {
    const doctor = await prisma.doctor.findUnique({
      where: {
        crm,
      },
    })
    return doctor
  }
}
