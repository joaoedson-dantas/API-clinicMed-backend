import { Doctor } from '@/models/Doctor'

export interface DoctorRepository {
  create(data: Omit<Doctor, 'id'>): Promise<Doctor>
  findByCrm(crm: string): Promise<Doctor | null>
  findByEmail(email: string): Promise<Doctor | null>
}
