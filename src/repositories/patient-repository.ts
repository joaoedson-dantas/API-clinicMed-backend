import { Patient } from '@/models/Patient'

export interface PatientRepository {
  create(data: Omit<Patient, 'id'>): Promise<Patient>
  findByEmail(email: string): Promise<Patient | null>
  findById(id: string): Promise<Patient | null>
  findByCPF(cpf: string): Promise<Patient | null>
  findManyActivePatients(
    page: number,
  ): Promise<Array<Pick<Patient, 'name' | 'email' | 'cpf' | 'activated'>>>

  update(data: Omit<Patient, 'email' | 'cpf' | 'activated'>): Promise<Patient>

  inactivate(id: string): Promise<Patient>
}
