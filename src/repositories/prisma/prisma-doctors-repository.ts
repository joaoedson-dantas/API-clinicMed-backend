import { Doctor } from '@prisma/client'
import { DoctorRepository } from '../doctor-repository'
import { prisma } from '@/lib/prisma'

export class PrismaDoctorRepository implements DoctorRepository {
  async findManyAllDoctorsActived() {
    throw new Error('Method not implemented.')
  }

  async updateDoctorWithQuery(doctorId: string, queryId: string) {
    throw new Error('Method not implemented.')
  }

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

    const updatedDoctor = await prisma.doctor.update({
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

  async findManyDoctorsActived(page: number) {
    const doctors = await prisma.doctor.findMany({
      where: {
        activated: true,
      },
      orderBy: {
        name: 'asc',
      },
      take: 10,
      skip: (page - 1) * 10,
      select: {
        name: true,
        email: true,
        crm: true,
        specialty: true,
        activated: true,
      },
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
