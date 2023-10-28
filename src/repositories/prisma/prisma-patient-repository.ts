import { Patient, PrismaClient } from '@prisma/client'
import { PatientRepository } from '../patient-repository'

export class PrismaPatientrepository implements PatientRepository {
  constructor(private prisma: PrismaClient) {}

  async inactivate(idPatient: string): Promise<Patient> {
    const updatedPatient = await this.prisma.patient.update({
      where: { id: idPatient },
      data: { activated: false },
    })

    return updatedPatient
  }

  async update(data: Omit<Patient, 'email' | 'cpf' | 'activated'>) {
    const { id, ...dataUpdated } = data

    const patientUpdated = await this.prisma.patient.update({
      where: { id },
      data: dataUpdated,
    })
    return patientUpdated
  }

  async findById(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: {
        id,
      },
    })
    return patient
  }

  async findByEmail(email: string) {
    const patient = this.prisma.patient.findUnique({
      where: {
        email,
      },
    })
    return patient
  }

  async findByCPF(cpf: string) {
    const patient = await this.prisma.patient.findUnique({
      where: {
        cpf,
      },
    })
    return patient
  }

  async findManyActivePatients(page: number) {
    const patients = await this.prisma.patient.findMany({
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
        cpf: true,
        activated: true,
      },
    })
    return patients
  }

  async create(data: Omit<Patient, 'id'>) {
    const { addressId, ...rest } = data

    const patient = await this.prisma.patient.create({
      data: {
        ...rest,
        address: {
          connect: { id: addressId },
        },
      },
    })
    return patient
  }
}
