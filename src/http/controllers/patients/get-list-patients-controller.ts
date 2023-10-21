import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetListPatientsUseCase } from '@/use-cases/factories/make-get-list-patients'

export async function getListPatients(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getListPatietsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = getListPatietsQuerySchema.parse(request.query)

  const getListDoctorsUseCase = makeGetListPatientsUseCase()
  const { patientsOrder } = await getListDoctorsUseCase.execute({
    page,
  })

  return reply.status(200).send({
    patientsOrder,
  })
}
