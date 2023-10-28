import { FastifyRequest, FastifyReply } from 'fastify'
import { makeDoctorExclusionUseCase } from '@/use-cases/factories/make-doctor-exclusion'
import { z } from 'zod'

export async function exclusionOfDoctor(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = z
    .object({
      id: z.string(),
    })
    .parse(request.params)

  const exclusionOfDoctorBodySchema = z.object({
    activated: z.boolean(),
  })

  const { activated } = exclusionOfDoctorBodySchema.parse(request.body)

  const getListDoctorsUseCase = makeDoctorExclusionUseCase()
  await getListDoctorsUseCase.execute({
    id,
    activated,
  })

  return reply.status(204).send()
}
