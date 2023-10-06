import { QueryMedRepository } from '@/repositories/query-med-repository'
import { Query } from '@prisma/client'

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
  constructor(private querysMedRepository: QueryMedRepository) {}

  async execute({
    doctorId,
    patientId,
    specialty,
    start_time,
  }: QueryMedUseCaseRequest): Promise<QueryMedUseCaseResponse> {
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
