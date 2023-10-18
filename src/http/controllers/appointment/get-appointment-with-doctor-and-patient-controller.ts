import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeAppointmentWithDoctorAndPatientUseCase } from '@/use-cases/factories/make-get-appointment-with-doctor-and-patient'

export async function getAppointment(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getAppointmentBodySchema = z.object({
    appointment_id: z.string(),
  })
  const { appointment_id } = getAppointmentBodySchema.parse(request.body)
  try {
    const getAppointmentUseCase = makeAppointmentWithDoctorAndPatientUseCase()
    const { appointment } = await getAppointmentUseCase.execute({
      appointment_id,
    })
    return reply.status(201).send({
      appointment,
    })
  } catch (err) {
    if (err instanceof Error) {
      return reply.status(409).send({ message: err.message })
    }
  }
}
