import { QueryMedRepository } from '@/repositories/query-med-repository'
import { isConsultationWithinSchedule } from '@/utils/check-clinic-opening-hours'
import { Query } from '@prisma/client'

import { PatientRepository } from '@/repositories/patient-repository'
import { DoctorRepository } from '@/repositories/doctor-repository'
import { PatientInactiveError } from './errors/ patient-inactive-error'
import { ClinicOutsideOpeningHoursError } from './errors/clinic-outside-opening-hours-error'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { filterDoctorsWithNoConflict } from '@/utils/filter-doctors-with-no-conflict'
import { Doctor } from '@/models/Doctor'

interface QueryMedUseCaseRequest {
  patientCPF: string
  doctorId?: string
  start_time: Date
  specialty: string
}

interface QueryMedUseCaseResponse {
  query: Query
}

export class QueryMedUseCase {
  constructor(
    private querysMedRepository: QueryMedRepository,
    private patientsRepository: PatientRepository,
    private doctorRepository: DoctorRepository,
  ) {}

  async execute({
    patientCPF,
    specialty,
    start_time,
    doctorId,
  }: QueryMedUseCaseRequest): Promise<QueryMedUseCaseResponse> {
    // verificando se a clinica está aberta para o horario de consulta solicitado
    const clinicOpen = isConsultationWithinSchedule(start_time)

    if (!clinicOpen) {
      throw new ClinicOutsideOpeningHoursError()
    }

    // verificando se o paciente está inativo no sistema
    const patient = await this.patientsRepository.findByCPF(patientCPF)

    if (!patient) {
      throw new UserAlreadyExistsError()
    }

    if (patient.activated === false) {
      throw new PatientInactiveError()
    }

    // verificando se o paciente já tem alguma consulta marcado no dia: Não pode duas consultas na mesma data.
    const queryOnSameDate =
      await this.querysMedRepository.findByPatientIdOnDate(
        patient.id!,
        new Date(),
      )

    if (queryOnSameDate) {
      throw new Error('Paciente com consuta na mesma data')
    }

    // selecionando um médico

    const doctors = await this.doctorRepository.findManyAllDoctorsActived()

    const availableDoctorsOnschedule = await filterDoctorsWithNoConflict(
      doctors,
      start_time,
    )

    if (availableDoctorsOnschedule.length === 0) {
      throw new Error('Não há medicos disponíveis para esse horário.')
    }

    const doctorRadom = Math.floor(
      Math.random() * availableDoctorsOnschedule.length,
    )
    const selectedDoctor = availableDoctorsOnschedule[doctorRadom]

    // criando a consulta

    const query = await this.querysMedRepository.create({
      patientId: patient.id!,
      doctorId: selectedDoctor.id,
      specialty,
      start_time,
    })

    // adicionado a nova consulta ao medico.

    const doctorWithQuery = await this.doctorRepository.updateDoctorWithQuery(
      selectedDoctor.id,
      query.id,
    )

    return { query }
  }

  private async selectDoctor(start_time: Date, doctorId?: string) {
    if (doctorId) {
      const doctors: Doctor[] = []
      const doctor = await this.doctorRepository.findById(doctorId)
      if (doctor) {
        doctors.push(doctor)
        createDoctorByParameter(doctors, start_time)
      }
    }

    if (!doctorId) {
      const doctors = await this.doctorRepository.findManyAllDoctorsActived()
      selectedDoctorRadom(doctors, start_time)
    }

    async function createDoctorByParameter(
      doctors: Array<
        Pick<
          Doctor,
          'name' | 'email' | 'crm' | 'activated' | 'specialty' | 'id'
        >
      >,
      start_time: Date,
    ) {
      const availableDoctorsOnschedule = await filterDoctorsWithNoConflict(
        doctors,
        start_time,
      )
      if (availableDoctorsOnschedule.length === 0) {
        throw new Error('Médico indisponível nesse horário')
      }
      const selectedDoctor = availableDoctorsOnschedule[0]
      return selectedDoctor
    }

    async function selectedDoctorRadom(
      doctors: Array<
        Pick<
          Doctor,
          'name' | 'email' | 'crm' | 'activated' | 'specialty' | 'id'
        >
      >,
      start_time: Date,
    ) {
      const availableDoctorsOnschedule = await filterDoctorsWithNoConflict(
        doctors,
        start_time,
      )
      if (availableDoctorsOnschedule.length === 0) {
        throw new Error('Não há medicos disponíveis para esse horário.')
      }

      const doctorRadom = Math.floor(
        Math.random() * availableDoctorsOnschedule.length,
      )
      const selectedDoctor = availableDoctorsOnschedule[doctorRadom]
      return selectedDoctor
    }
  }
}

/*  id: string;
created_at: Date
start_time: Date
end_time: Date | null
specialty: string
reason_cancellation: string | null
patientId: string
doctorId: string */

/* id: 'a4f1f76f-9250-4373-b008-5e894af1f20e',
  cpf: '12345678',
  activated: false,
  email: 'malu@gmail.com',
  name: 'Malu Bernardo Dantas',
  tel: '85992002328',
  created_at: 2023-11-20T11:00:00.000Z,
  addressId: 'bb291605-2645-470b-9eb0-a0a77d21b588' */
