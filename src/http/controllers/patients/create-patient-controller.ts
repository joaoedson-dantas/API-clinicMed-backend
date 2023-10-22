import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeRegisterPatientUseCase } from '@/use-cases/factories/make-register-patient-use-case'

export async function createPatient(
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

  const createPatientBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
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
    cpf: z.string().min(11).max(11),
    activated: z.boolean(),
    address: addressSchema,
  })

  const { name, email, tel, cpf, address, activated } =
    createPatientBodySchema.parse(request.body)

  try {
    const RegisterPatientUseCase = makeRegisterPatientUseCase()
    const { patient } = await RegisterPatientUseCase.execute({
      name,
      email,
      cpf,
      tel,
      activated,
      address,
    })
    return reply
      .status(201)
      .send({ id: patient.id, activated: patient.activated })
  } catch (err) {
    if (err instanceof Error) {
      return reply.status(409).send({ message: err.message })
    }
  }
}
