import { Patient } from '@/models/Patient'

export interface PatientRepository {
  create(data: Omit<Patient, 'id'>): Promise<Patient>
  findByEmail(email: string): Promise<Patient | null>
  findByCPF(cpf: string): Promise<Patient | null>
  /*   update(
    data: Omit<Patient, 'email' | 'crm' | 'specialty' | 'activated'>,
  ): Promise<Doctor>
  inactivate(id: string): Promise<Doctor>
  findByCrm(crm: string): Promise<Doctor | null>
  findByEmail(email: string): Promise<Doctor | null>
  findById(id: string): Promise<Doctor | null>
  findManyDoctors(page: number): Promise<Doctor[]> */
}
