import { QueryMedRepository } from '@/repositories/query-med-repository'
import { Cancellation, Query } from '@prisma/client'
import dayjs from 'dayjs'

interface AppointmentCancellationUseCaseRequest {
  appointment_id: string
  reason_cancellation?: Cancellation

  cancellation_date: Date
}

interface AppointmentCancellationUseCaseResponse {
  appointmentCancellation: Query
}

export class AppointmentCancellationUseCase {
  constructor(private querysMedRepository: QueryMedRepository) {}

  async execute({
    appointment_id,
    reason_cancellation,
    cancellation_date,
  }: AppointmentCancellationUseCaseRequest): Promise<AppointmentCancellationUseCaseResponse> {
    // verificando se a consuta existe no sistema.

    if (!reason_cancellation) {
      throw new Error(
        'Para cancelar uma consulta é necessário informar o motivo do cancelamento',
      )
    }

    // verifincado se a consulta está sendo cancelada com no mínimo 24h de antecedência mínima

    const now = dayjs()

    const distanceInHourFromAppointmentCancellation = dayjs(now).diff(
      cancellation_date,
      'hour',
    )

    if (distanceInHourFromAppointmentCancellation < 24) {
      throw new Error(
        'A consutla somente poderá ser cancelada com antecedência mínima de 24 horas.',
      )
    }

    const appointment = await this.querysMedRepository.findById(appointment_id)

    if (!appointment) {
      throw new Error(
        'Não é possível cancelar uma consulta que não existe no sistema.',
      )
    }

    const appointmentCancellation =
      await this.querysMedRepository.appointmentCancellation(
        appointment_id,
        reason_cancellation,
      )

    if (!appointmentCancellation?.reason_cancellation) {
      throw new Error('Erro ao cancelar a consuta')
    }

    return { appointmentCancellation }
  }
}
