import { DoctorRepository } from '../doctor-repository'
import { prisma } from '@/lib/prisma'
import { Doctor } from '@/models/Doctor'

export class PrismaDoctorRepository implements DoctorRepository {
  async create(data: Doctor) {
    const address = await prisma.address.findUnique({
      where: {
        id: data.addressId,
      },
    })
    const doctor = await prisma.doctor.create({
      data: {
        address: {
          connect: {
            id: data.addressId,
          },
        },
        ...data,
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
