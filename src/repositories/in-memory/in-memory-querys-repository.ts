import { $Enums, Prisma, Query } from '@prisma/client'
import { QueryMedRepository } from '../query-med-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

export class InMemoryQuerysMedRepository implements QueryMedRepository {
  public querys: Query[] = []

  async findById(appointment_id: string) {
    const appointment = this.querys.find((query) => query.id === appointment_id)

    if (!appointment) {
      return null
    }

    return appointment
  }

  async appointmentCancellation(
    appointment_id: string,
    reason_cancellation: $Enums.Cancellation,
  ) {
    const appointment = await this.findById(appointment_id)

    if (!appointment) {
      return null
    }
    appointment.reason_cancellation = reason_cancellation

    this.querys.forEach((query, index) => {
      if (query.id === appointment_id) {
        this.querys[index] = { ...query, ...appointment }
      }
    })
    return appointment
  }

  async findAllQuers() {
    const querys = this.querys
    return querys
  }

  async hasDoctorConflict(
    doctorId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<boolean> {
    // Verifica se algum médico tem uma consulta no mesmo horário

    const hasConflict = this.querys.some((query) => {
      if (query.doctorId === doctorId) {
        if (startTime >= query.end_time) {
          return false
        }

        if (endTime <= query.start_time) {
          return false
        }
        return true
      }
      return false
    })

    return hasConflict
  }

  async findByPatientIdOnDate(patientId: string, date: Date) {
    const startOftheDay = dayjs(date).startOf('date')
    const endOftheDay = dayjs(date).endOf('date')

    const queryOnSameDate = this.querys.find((query) => {
      const queryDate = dayjs(query.start_time)
      // forma de validar que data está no intervalo de duas outras datas.
      const isOnSameDate =
        queryDate.isAfter(startOftheDay) && queryDate.isBefore(endOftheDay)
      return query.patientId === patientId && isOnSameDate
    })

    if (!queryOnSameDate) {
      return null
    }
    return queryOnSameDate
  }

  async create(data: Prisma.QueryUncheckedCreateInput) {
    const queryMed = {
      id: randomUUID(),
      patientId: data.patientId,
      doctorId: data.doctorId,
      start_time: data.start_time as Date,
      end_time: data.end_time as Date,
      reason_cancellation: data.reason_cancellation
        ? data.reason_cancellation
        : null,
      specialty: data.specialty,
      created_at: new Date(),
    }
    this.querys.push(queryMed)

    return queryMed
  }
}
