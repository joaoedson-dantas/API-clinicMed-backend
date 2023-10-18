import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import { Specialty } from '@prisma/client'
import { makeAppointmentMedUseCase } from '@/use-cases/factories/make-appointment-med'

export async function createAppointment(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createAppointmentBodySchema = z.object({
    patientCPF: z.string().min(11).max(11),
    doctorId: z.string().optional(),
    start_time: z.date(),
    specialty: z.nativeEnum(Specialty),
  })
  const { patientCPF, doctorId, start_time, specialty } =
    createAppointmentBodySchema.parse(request.body)

  try {
    // instaciando o caso de uso e passando as dependencias por parametro

    const appointmentMedUseCase = makeAppointmentMedUseCase()
    await appointmentMedUseCase.execute({
      patientCPF,
      doctorId,
      start_time,
      specialty,
    })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }
  }

  return reply.status(201).send()
}
