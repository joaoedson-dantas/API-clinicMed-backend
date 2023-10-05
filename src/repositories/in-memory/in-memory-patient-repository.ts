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

  async findById(id: string): Promise<Patient | null> {
    const patient = this.patients.find((patient) => patient.id === id)
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

  async findManyActivePatients(page: number) {
    const patientsOrder = this.patients.sort((a, b) => {
      const nameA = a.name.toUpperCase() // Converta para maiúsculas para garantir a ordenação correta
      const nameB = b.name.toUpperCase()

      if (nameA < nameB) {
        return -1
      }

      if (nameA > nameB) {
        return 1
      }

      return 0
    })
    const patientsOrderAndSlice = patientsOrder.slice(
      (page - 1) * 10,
      page * 10,
    )
    const patientsOrderAndSliceActivated = patientsOrderAndSlice.filter(
      (patient) => patient.activated,
    )

    return patientsOrderAndSliceActivated.map((patient) => ({
      name: patient.name,
      email: patient.email,
      cpf: patient.cpf,
      activated: patient.activated,
    }))
  }
}