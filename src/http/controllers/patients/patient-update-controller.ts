import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makePatientUpdateUseCase } from '@/use-cases/factories/make-patient-update-use-case'
import { PatientNotFound } from '@/use-cases/errors/patient-not-found-error'

export async function updatePatient(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const addressSchema = z.object({
    road: z.string(),
    district: z.string(),
    zip_code: z.string().max(8).min(8),
    complement: z.string(),
    number: z.string(),
    uf: z.string(),
    city: z.string(),
  })

  const updatePatientBodySchema = z.object({
    name: z.string(),
    tel: z.string().refine(
      (phoneNumber) => {
        const regex = /^(\d{2})\d{8}$|^\d{2}\d{9}$/ // Formato: DDXXXXXXXX ou DDXXXXXXXXX (8 ou 9 dígitos)
        return regex.test(phoneNumber)
      },
      {
        message:
          'O número de celular brasileiro deve ter o formato DDXXXXXXXX ou DDXXXXXXXXX, onde D é um dígito e X é um dígito.',
      },
    ),
    address: addressSchema,
  })

  const { id } = z
    .object({
      id: z.string(),
    })
    .parse(request.params)

  const { name, tel, address } = updatePatientBodySchema.parse(request.body)

  try {
    const updatePatientUseCase = makePatientUpdateUseCase()
    await updatePatientUseCase.execute({
      id,
      name,
      tel,
      address,
    })
    return reply.status(204).send()
  } catch (err) {
    if (err instanceof PatientNotFound) {
      return reply.status(400).send({ message: err.message })
    }
  }
}
