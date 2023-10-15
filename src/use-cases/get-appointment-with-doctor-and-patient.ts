import { DoctorRepository } from '@/repositories/doctor-repository'
import { PatientRepository } from '@/repositories/patient-repository'
import { QueryMedRepository } from '@/repositories/query-med-repository'
import { Cancellation, Specialty } from '@prisma/client'

interface AppointmentWithDoctorAndPatient {
  appointment_id: string
  doctor_name: string
  patient_name: string
  created_at: Date
  start_time: Date
  end_time: Date
  specialty: Specialty
  reason_cancellation?: Cancellation
}

interface GetAppointmentWithDoctorAndPatientUseCaseRequest {
  appointment_id: string
}

interface GetAppointmentWithDoctorAndPatientUseCaseResponse {
  appointment: AppointmentWithDoctorAndPatient
}

export class AppointmentWithDoctorAndPatientUseCase {
  constructor(
    private querysMedRepository: QueryMedRepository,
    private patientsRepository: PatientRepository,
    private doctorRepository: DoctorRepository,
  ) {}

  async execute({
    appointment_id,
  }: GetAppointmentWithDoctorAndPatientUseCaseRequest): Promise<GetAppointmentWithDoctorAndPatientUseCaseResponse> {
    // verificando se a consulta existe nos sistema:

    const appointmentByID =
      await this.querysMedRepository.findById(appointment_id)

    if (!appointmentByID) {
      throw new Error(
        'Id da consulta inválido: consulta não encontrada no nosso sistma',
      )
    }

    const doctor = await this.doctorRepository.findById(
      appointmentByID.doctorId,
    )
    const patient = await this.patientsRepository.findById(
      appointmentByID.patientId,
    )

    if (!doctor) {
      throw new Error('Erro ao buscar o médico')
    }

    if (!patient) {
      throw new Error('Erro ao buscar o paciente')
    }

    const doctor_name = doctor.name
    const patient_name = patient.name

    const appointment = {
      appointment: {
        appointment_id: appointmentByID.id,
        doctor_name,
        patient_name,
        created_at: appointmentByID.created_at,
        start_time: appointmentByID.start_time,
        end_time: appointmentByID.end_time,
        specialty: appointmentByID.specialty,
      },
    }

    return appointment
  }
}
