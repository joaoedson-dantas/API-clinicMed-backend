import { Patient } from '@/models/Patient'
import { PatientRepository } from '../patient-repository'
import { prisma } from '@/lib/prisma'

export class PrismaPatientrepository implements PatientRepository {
  async create(data: Omit<Patient, 'id'>): Promise<Patient> {
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
