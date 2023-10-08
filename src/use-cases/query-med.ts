import { QueryMedRepository } from '@/repositories/query-med-repository'
import { isConsultationWithinSchedule } from '@/utils/check-clinic-opening-hours'
import { Doctor, Query } from '@prisma/client'

import { PatientRepository } from '@/repositories/patient-repository'
import { DoctorRepository } from '@/repositories/doctor-repository'
import { PatientInactiveError } from './errors/ patient-inactive-error'
import { ClinicOutsideOpeningHoursError } from './errors/clinic-outside-opening-hours-error'

interface QueryMedUseCaseRequest {
  patientCPF: string
  start_time: Date
  specialty: string
}

interface QueryMedUseCaseResponse {
  query: Query
}

export class QueryMedUseCase {
  constructor(
    private querysMedRepository: QueryMedRepository,
    private patientsRepository: PatientRepository,
    private doctorRepository: DoctorRepository,
  ) {}

  async execute({
    patientCPF,
    specialty,
    start_time,
  }: QueryMedUseCaseRequest): Promise<QueryMedUseCaseResponse> {
    // verificando se a clica está aberta para o horario de consulta solicitado
    const clinicOpen = isConsultationWithinSchedule(start_time)

    if (!clinicOpen) {
      throw new Error()
    }

    // verificando se o paciente está inativo no sistema
    const patient = await this.patientsRepository.findByCPF(patientCPF)

    if (!patient) {
      throw new Error()
    }

    if (patient.activated === false) {
      throw new PatientInactiveError()
    }

    // verificando se o paciente já tem alguma consulta marcado no dia
    const queryOnSameDate =
      await this.querysMedRepository.findByPatientIdOnDate(
        patient.id!,
        new Date(),
      )

    console.log(queryOnSameDate)

    if (queryOnSameDate) {
      throw new ClinicOutsideOpeningHoursError()
    }

    // selecionando um medico
    const doctors = await this.doctorRepository.findManyAllDoctorsActived()
    const doctorRadom = Math.floor(Math.random() * doctors.length)

    const { crm } = doctors[doctorRadom]

    const doctor = (await this.doctorRepository.findByCrm(crm)) as Doctor

    const query = await this.querysMedRepository.create({
      patientId: patient.id!,
      doctorId: doctor.id,
      specialty,
      start_time,
    })

    return { query }
  }
}

/*  id: string;
created_at: Date
start_time: Date
end_time: Date | null
specialty: string
reason_cancellation: string | null
patientId: string
doctorId: string */

/* id: 'a4f1f76f-9250-4373-b008-5e894af1f20e',
  cpf: '12345678',
  activated: false,
  email: 'malu@gmail.com',
  name: 'Malu Bernardo Dantas',
  tel: '85992002328',
  created_at: 2023-11-20T11:00:00.000Z,
  addressId: 'bb291605-2645-470b-9eb0-a0a77d21b588' */
