import { Prisma, Query } from '@prisma/client'
import { QueryMedRepository } from '../query-med-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryQuerysMedRepository implements QueryMedRepository {
  public querys: Query[] = []

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
 */
