import { Doctor } from '@/models/Doctor'

export interface DoctorRepository {
  create(data: Doctor): Promise<Doctor>
  findByCrm(crm: string): Promise<Doctor | null>
}
