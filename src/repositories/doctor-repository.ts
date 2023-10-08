import { Doctor } from '@/models/Doctor'

export interface DoctorRepository {
  create(data: Omit<Doctor, 'id'>): Promise<Doctor>
  update(
    data: Omit<Doctor, 'email' | 'crm' | 'specialty' | 'activated'>,
  ): Promise<Doctor>
  inactivate(id: string): Promise<Doctor>
  findByCrm(crm: string): Promise<Doctor | null>
  findByEmail(email: string): Promise<Doctor | null>
  findById(id: string): Promise<Doctor | null>
  findManyDoctorsActived(
    page: number,
  ): Promise<
    Array<Pick<Doctor, 'name' | 'email' | 'crm' | 'activated' | 'specialty'>>
  >

  findManyAllDoctorsActived(): Promise<
    Array<Pick<Doctor, 'name' | 'email' | 'crm' | 'activated' | 'specialty'>>
  >
}
