import { DoctorRepository } from '@/repositories/doctor-repository'
import { PatientRepository } from '@/repositories/patient-repository'
import { QueryMedRepository } from '@/repositories/query-med-repository'
import { Cancellation, Specialty } from '@prisma/client'
import { AppointmentNotFound } from './errors/appointment-not-found-error'
import { DoctorNotFound } from './errors/doctor-not-found-error'
import { PatientNotFound } from './errors/patient-not-found-error'

interface AppointmentWithDoctorAndPatient {
  appointment_id: string
  doctor: {
    id: string
    name: string
    crm: string
  }
  patient: {
    id: string
    name: string
    cpf: string
  }
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
      throw new AppointmentNotFound()
    }

    const doctor = await this.doctorRepository.findById(
      appointmentByID.doctorId,
    )
    const patient = await this.patientsRepository.findById(
      appointmentByID.patientId,
    )

    if (!doctor) {
      throw new DoctorNotFound()
    }

    if (!patient?.id) {
      throw new PatientNotFound()
    }

    const appointment: GetAppointmentWithDoctorAndPatientUseCaseResponse = {
      appointment: {
        appointment_id: appointmentByID.id,
        doctor: {
          id: doctor.id,
          name: doctor.name,
          crm: doctor.crm,
        },
        patient: {
          id: patient.id,
          name: patient.name,
          cpf: patient.cpf,
        },
        created_at: appointmentByID.created_at,
        start_time: appointmentByID.start_time,
        end_time: appointmentByID.end_time,
        specialty: appointmentByID.specialty,
      },
    }

    return appointment
  }
}
