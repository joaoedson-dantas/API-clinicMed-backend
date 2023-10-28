import { $Enums, Doctor, PrismaClient } from '@prisma/client'
import { DoctorRepository } from '../doctor-repository'

export class PrismaDoctorRepository implements DoctorRepository {
  constructor(private prisma: PrismaClient) {}
  async activeDoctor(doctorId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: {
        id: doctorId,
      },
    })

    if (!doctor) {
      throw new Error('Médico não encontrado')
    }

    return doctor.activated
  }

  async findAllActiveDoctorsBySpecialty(specialty: $Enums.Specialty) {
    const activeDoctorsBySpecialty = await this.prisma.doctor.findMany({
      where: { activated: true, specialty },
      select: {
        name: true,
        email: true,
        crm: true,
        specialty: true,
        activated: true,
        id: true,
      },
    })
    return activeDoctorsBySpecialty
  }

  async findManyAllDoctorsActived() {
    const doctorsActived = await this.prisma.doctor.findMany({
      where: {
        activated: true,
      },
      select: {
        name: true,
        email: true,
        crm: true,
        specialty: true,
        activated: true,
        id: true,
      },
    })

    return doctorsActived
  }

  async updateDoctorWithQuery(doctorId: string, queryId: string) {
    const updateDoctor = await this.prisma.doctor.update({
      where: {
        id: doctorId,
      },
      data: {
        querys: {
          connect: [{ id: queryId }],
        },
      },
    })

    if (!updateDoctor) {
      throw new Error('medico não encontrado')
    }
    return updateDoctor
  }

  async inactivate(idDoctor: string) {
    const updatedDoctor = await this.prisma.doctor.update({
      where: { id: idDoctor },
      data: { activated: false },
    })

    return updatedDoctor
  }

  async update(
    data: Omit<Doctor, 'email' | 'crm' | 'specialty' | 'activated'>,
  ) {
    const { id, ...dataUpdated } = data

    const updatedDoctor = await this.prisma.doctor.update({
      where: { id },
      data: dataUpdated,
    })
    return updatedDoctor
  }

  async findById(id: string): Promise<Doctor | null> {
    const doctor = await this.prisma.doctor.findUnique({
      where: {
        id,
      },
    })
    return doctor
  }

  async findManyDoctorsActived(page: number) {
    const doctors = await this.prisma.doctor.findMany({
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

    const doctor = await this.prisma.doctor.create({
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
    const doctor = await this.prisma.doctor.findUnique({
      where: {
        crm,
      },
    })
    return doctor
  }

  async findByEmail(email: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: {
        email,
      },
    })
    return doctor
  }
}
