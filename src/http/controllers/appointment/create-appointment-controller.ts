import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { Specialty } from '@prisma/client'
import { makeAppointmentMedUseCase } from '@/use-cases/factories/make-appointment-med'

export async function createAppointment(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  console.log('Valor de start_time:', request.body)
  const createAppointmentBodySchema = z.object({
    patientCPF: z.string().min(11).max(11),
    doctorId: z.string().optional(),
    start_time: z.string(),
    specialty: z.nativeEnum(Specialty),
  })

  const { patientCPF, doctorId, start_time, specialty } =
    createAppointmentBodySchema.parse(request.body)

  try {
    const appointmentMedUseCase = makeAppointmentMedUseCase()
    const { query } = await appointmentMedUseCase.execute({
      patientCPF,
      doctorId,
      start_time: new Date(start_time),
      specialty,
    })
    return reply.status(201).send({
      query,
    })
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message)
      return reply.status(409).send({ message: err.message })
    }
  }
}
