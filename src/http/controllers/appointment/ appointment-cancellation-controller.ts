import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { Cancellation } from '@prisma/client'
import { makeAppointmentCancellationUseCase } from '@/use-cases/factories/make- appointment-cancellation'

export async function AppointmentCancellation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const appointmentCancellationBodySchema = z.object({
    appointment_id: z.string(),
    reason_cancellation: z.nativeEnum(Cancellation),
    cancellation_date: z.date(),
  })

  const { appointment_id, reason_cancellation, cancellation_date } =
    appointmentCancellationBodySchema.parse(request.body)

  try {
    const getListDoctorsUseCase = makeAppointmentCancellationUseCase()
    await getListDoctorsUseCase.execute({
      appointment_id,
      reason_cancellation,
      cancellation_date,
    })
  } catch (err) {
    if (err instanceof Error) {
      return reply.status(409).send({ message: err.message })
    }
  }

  return reply.status(204).send()
}
