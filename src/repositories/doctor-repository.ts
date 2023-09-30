import { Doctor, Prisma } from '@prisma/client'

export interface DoctorRepository {
  create(data: Prisma.DoctorCreateInput): Promise<Doctor>
  findByCrm(crm: string): Promise<Doctor | null>
}
