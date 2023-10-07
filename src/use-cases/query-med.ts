import { QueryMedRepository } from '@/repositories/query-med-repository'
import { isConsultationWithinSchedule } from '@/utils/check-clinic-opening-hours'
import { Query } from '@prisma/client'

import { PatientRepository } from '@/repositories/patient-repository'

interface QueryMedUseCaseRequest {
  patientId: string
  doctorId: string
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
  ) {}

  async execute({
    doctorId,
    patientId,
    specialty,
    start_time,
  }: QueryMedUseCaseRequest): Promise<QueryMedUseCaseResponse> {
    // verificando se a clica está aberta para o horario de consulta solicitado
    const clinicOpen = isConsultationWithinSchedule(start_time)

    if (!clinicOpen) {
      throw new Error()
    }

    // verificando se o paciente está inativo no sistema
    const patient = await this.patientsRepository.findById(patientId)

    if (patient!.activated === false) {
      throw new Error()
    }

    // verificando se o paciente já tem alguma consulta marcado no dia
    const queryOnSameDate =
      await this.querysMedRepository.findByPatientIdOnDate(
        patientId,
        new Date(),
      )

    if (queryOnSameDate) {
      throw new Error()
    }

    const query = await this.querysMedRepository.create({
      patientId,
      doctorId,
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
