import { z } from 'zod'
import { makeGetListDoctorsUseCase } from '@/use-cases/factories/make- get-list-doctors'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function getListDoctors(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getListDoctorsQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  })
  console.log(getListDoctorsQuerySchema.parse(request.query))

  const { page } = getListDoctorsQuerySchema.parse(request.query)

  const getListDoctorsUseCase = makeGetListDoctorsUseCase()
  const { doctorsOrder } = await getListDoctorsUseCase.execute({
    page,
  })

  return reply.status(200).send({
    doctorsOrder,
  })
}
