import { DoctorNotFound } from '@/use-cases/errors/doctor-not-found-error'
import { makeDoctorUpdateUseCase } from '@/use-cases/factories/make-doctor-update'
import { Specialty } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function updateDoctor(
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

  const updateDoctorBodySchema = z.object({
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
    specialty: z.nativeEnum(Specialty),
  })

  const { id } = z
    .object({
      id: z.string(),
    })
    .parse(request.params)

  const { name, tel, address, specialty } = updateDoctorBodySchema.parse(
    request.body,
  )

  try {
    const updateDoctorUseCase = makeDoctorUpdateUseCase()
    await updateDoctorUseCase.execute({
      id,
      name,
      tel,
      address,
      specialty,
    })
    return reply.status(204).send()
  } catch (err) {
    if (err instanceof DoctorNotFound) {
      return reply.status(400).send({ message: err.message })
    }
  }
}
