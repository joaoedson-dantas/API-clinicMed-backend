import { Prisma, Query } from '@prisma/client'
import { QueryMedRepository } from '../query-med-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

export class InMemoryQuerysMedRepository implements QueryMedRepository {
  public querys: Query[] = []

  async findAllQuers() {
    const querys = this.querys
    return querys
  }

  async hasDoctorConflict(doctorId: string, startTime: Date): Promise<boolean> {
    // Verifica se algum médico tem uma consulta no mesmo horário

    const hasConflict = !!this.querys.filter((query) => {
      return (
        query.doctorId === doctorId &&
        query.start_time.getTime() === startTime.getTime()
      )
    })
    console.log(hasConflict)

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
      end_time: null,
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
