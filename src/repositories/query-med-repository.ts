import { Cancellation, Prisma, Query } from '@prisma/client'

export interface QueryMedRepository {
  create(data: Prisma.QueryUncheckedCreateInput): Promise<Query>

  findByPatientIdOnDate(patientId: string, date: Date): Promise<Query | null>
  hasDoctorConflict(
    doctorId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<boolean>
  findAllQuers(): Promise<Query[]>

  findById(appointment_id: string): Promise<Query | null>
  appointmentCancellation(
    appointment_id: string,
    reason_cancellation: Cancellation,
  ): Promise<Query | null>
}
