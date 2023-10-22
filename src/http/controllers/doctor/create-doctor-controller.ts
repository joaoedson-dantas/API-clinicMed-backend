import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { Specialty } from '@prisma/client'
import { makeRegisterDoctorUseCase } from '@/use-cases/factories/make-register-doctor-use-case'

export async function createDoctor(
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

  const createDoctorBodySchema = z.object({
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
    crm: z.string().refine(
      (crm) => {
        const regex = /^\d{5}-[A-Z]{2}$/ // Formato: 12345-SP (5 dígitos seguidos de hífen e 2 letras maiúsculas)
        return regex.test(crm)
      },
      {
        message:
          'O CRM deve ter o formato 12345-SP, onde 12345 é o número e SP é a sigla do estado (duas letras maiúsculas).',
      },
    ),
    address: addressSchema,
    specialty: z.nativeEnum(Specialty),
    activated: z.boolean(),
  })
  const { name, email, tel, crm, address, specialty, activated } =
    createDoctorBodySchema.parse(request.body)
  try {
    const DoctorMedUseCase = makeRegisterDoctorUseCase()
    await DoctorMedUseCase.execute({
      name,
      email,
      tel,
      crm,
      address,
      specialty,
      activated,
    })
  } catch (err) {
    if (err instanceof Error) {
      return reply.status(409).send({ message: err.message })
    }
  }
  return reply.status(201).send()
}
