import { DoctorRepository } from '../doctor-repository'
import { prisma } from '@/lib/prisma'
import { Doctor } from '@/models/Doctor'

export class PrismaDoctorRepository implements DoctorRepository {
  async inactivate(idDoctor: string) {
    const updatedDoctor = await prisma.doctor.update({
      where: { id: idDoctor },
      data: { activated: false },
    })

    return updatedDoctor
  }

  async update(
    data: Omit<Doctor, 'email' | 'crm' | 'specialty' | 'activated'>,
  ) {
    const { id, ...dataUpdated } = data

    const updatedDoctor = prisma.doctor.update({
      where: { id },
      data: dataUpdated,
    })
    return updatedDoctor
  }

  async findById(id: string): Promise<Doctor | null> {
    const doctor = await prisma.doctor.findUnique({
      where: {
        id,
      },
    })
    return doctor
  }

  async findManyDoctors(page: number): Promise<Doctor[]> {
    const doctors = await prisma.doctor.findMany({
      where: {
        activated: true,
      },
      orderBy: {
        name: 'asc',
      },
      take: 10,
      skip: (page - 1) * 10,
    })
    return doctors
  }

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

  async findByEmail(email: string) {
    const doctor = await prisma.doctor.findUnique({
      where: {
        email,
      },
    })
    return doctor
  }
}
