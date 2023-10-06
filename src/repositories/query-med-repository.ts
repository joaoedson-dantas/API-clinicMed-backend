import { Prisma, Query } from '@prisma/client'

export interface QueryMedRepository {
  create(data: Prisma.QueryUncheckedCreateInput): Promise<Query>
}
