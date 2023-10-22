import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makePatientExclusionUseCase } from '@/use-cases/factories/make-patient-exclusion-use-case'

export async function exclusionOfPatient(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = z
    .object({
      id: z.string(),
    })
    .parse(request.params)

  const exclusionOfPatientBodySchema = z.object({
    activated: z.boolean(),
  })

  const { activated } = exclusionOfPatientBodySchema.parse(request.body)

  const getListPatientsUseCase = makePatientExclusionUseCase()
  await getListPatientsUseCase.execute({
    id,
    activated,
  })

  return reply.status(204).send()
}
