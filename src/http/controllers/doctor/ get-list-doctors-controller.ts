import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeGetListDoctorsUseCase } from '@/use-cases/factories/make- get-list-doctors'

export async function getListDoctors(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getListDoctorsBodySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  })
  const { page } = getListDoctorsBodySchema.parse(request.body)

  const getListDoctorsUseCase = makeGetListDoctorsUseCase()
  const { doctorsOrder } = await getListDoctorsUseCase.execute({
    page,
  })

  return reply.status(201).send({
    doctorsOrder,
  })
}
