import { QueryMedRepository } from '@/repositories/query-med-repository'
import { PatientRepository } from '@/repositories/patient-repository'
import { DoctorRepository } from '@/repositories/doctor-repository'
import { Cancellation, Query } from '@prisma/client'

interface AppointmentCancellationUseCaseRequest {
  appointment_id: string
  reason_cancellation: Cancellation
}

interface AppointmentCancellationUseCaseResponse {
  appointmentCancellation: Query
}

export class AppointmentCancellationUseCase {
  constructor(
    private querysMedRepository: QueryMedRepository,
    private patientsRepository: PatientRepository,
    private doctorRepository: DoctorRepository,
  ) {}

  async execute({
    appointment_id,
    reason_cancellation,
  }: AppointmentCancellationUseCaseRequest): Promise<AppointmentCancellationUseCaseResponse> {
    // verificando se a consuta existe no sistema.

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
      throw new Error(
        'Erro ao cancelar a consuta, é necessário informar o motivo do cancelamento',
      )
    }

    return { appointmentCancellation }
  }
}
