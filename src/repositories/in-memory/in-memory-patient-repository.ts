import { Patient } from '@/models/Patient'
import { PatientRepository } from '../patient-repository'
import { randomUUID } from 'crypto'

export class InMemoryPatientRepository implements PatientRepository {
  public patients: Patient[] = []

  async create(data: Patient): Promise<Patient> {
    const { name, cpf, email, tel, activated, addressId, created_at } = data

    const patient = {
      id: randomUUID(),
      cpf,
      activated,
      email,
      name,
      tel,
      created_at,
      addressId,
    }

    this.patients.push(patient)

    return patient
  }

  async findByEmail(email: string): Promise<Patient | null> {
    const patient = this.patients.find((item) => item.email === email) || null
    if (!patient) {
      return null
    }
    return patient
  }

  async findByCPF(cpf: string): Promise<Patient | null> {
    const patient = this.patients.find((item) => item.cpf === cpf) || null
    if (!patient) {
      return null
    }
    return patient
  }
}
