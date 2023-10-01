import { DoctorRepository } from '../doctor-repository'
import { prisma } from '@/lib/prisma'
import { Doctor } from '@/models/Doctor'

export class PrismaDoctorRepository implements DoctorRepository {
  async create(data: Doctor) {
    const { addressId, ...rest } = data

    const doctor = await prisma.doctor.create({
      data: {
        ...rest,
        address: {
          connect: { id: addressId },
        },
      },
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
