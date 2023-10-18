import { FastifyRequest, FastifyReply } from 'fastify'
import { makeDoctorExclusionUseCase } from '@/use-cases/factories/make-doctor-exclusion'
import { z } from 'zod'

export async function exclusionOfDoctor(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const exclusionOfDoctorBodySchema = z.object({
    id: z.string(),
    activated: z.boolean(),
  })
  const { id, activated } = exclusionOfDoctorBodySchema.parse(request.body)

  const getListDoctorsUseCase = makeDoctorExclusionUseCase()
  const { doctor } = await getListDoctorsUseCase.execute({
    id,
    activated,
  })

  return reply.status(201).send({
    doctor,
  })
}
