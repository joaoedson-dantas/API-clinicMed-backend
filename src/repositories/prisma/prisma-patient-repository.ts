import { Patient } from '@/models/Patient'
import { PatientRepository } from '../patient-repository'
import { prisma } from '@/lib/prisma'

export class PrismaPatientrepository implements PatientRepository {
  async update(data: Omit<Patient, 'email' | 'cpf' | 'activated'>) {
    const { id, ...dataUpdated } = data

    const patientUpdated = await prisma.patient.update({
      where: { id },
      data: dataUpdated,
    })
    return patientUpdated
  }

  async findById(id: string) {
    const patient = await prisma.patient.findUnique({
      where: {
        id,
      },
    })
    return patient
  }

  async findByEmail(email: string) {
    const patient = prisma.patient.findUnique({
      where: {
        email,
      },
    })
    return patient
  }

  async findByCPF(cpf: string) {
    const patient = await prisma.patient.findUnique({
      where: {
        cpf,
      },
    })
    return patient
  }

  async findManyActivePatients(page: number) {
    const patients = await prisma.patient.findMany({
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

    const patient = await prisma.patient.create({
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
