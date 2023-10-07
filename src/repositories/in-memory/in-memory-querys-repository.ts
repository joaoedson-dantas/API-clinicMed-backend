import { Prisma, Query } from '@prisma/client'
import { QueryMedRepository } from '../query-med-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

export class InMemoryQuerysMedRepository implements QueryMedRepository {
  public querys: Query[] = []
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

/*     const start_time =
      typeof data.start_time === 'string'
        ? new Date(data.start_time)
        : data.start_time

        dayjs(date).startOf('date') -> date no js quer dizer o dia 
 */
