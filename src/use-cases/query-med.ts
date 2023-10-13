import { QueryMedRepository } from '@/repositories/query-med-repository'
import { isConsultationWithinSchedule } from '@/utils/check-clinic-opening-hours'
import { Doctor, Query, Specialty } from '@prisma/client'

import { PatientRepository } from '@/repositories/patient-repository'
import { DoctorRepository } from '@/repositories/doctor-repository'
import { PatientInactiveError } from './errors/ patient-inactive-error'
import { ClinicOutsideOpeningHoursError } from './errors/clinic-outside-opening-hours-error'
import { DoctorUnavailableOnTime } from './errors/doctor-unavailable-on-time'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import dayjs from 'dayjs'
import { PatientAppointmentSameDate } from './errors/ patient-appointment-same-date'

interface QueryMedUseCaseRequest {
  patientCPF: string
  doctorId?: string
  start_time: Date
  specialty: Specialty
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

    // verificando se a consulta está sendo agendada com antecedência mínima de 30m
    const now = dayjs()
    const distanceInMinutesFromQueryCreation = dayjs(start_time).diff(
      now,
      'minutes',
    )

    if (!(distanceInMinutesFromQueryCreation >= 30)) {
      throw new Error(
        'A consulta pode ser agendada, pois está ocorrendo com pelo menos 30 minutos de antecedência.',
      )
    }

    // verificando se o paciente está inativo no sistema
    const patient = await this.patientsRepository.findByCPF(patientCPF)

    if (!patient?.id) {
      throw new UserAlreadyExistsError()
    }

    if (!patient.activated) {
      throw new PatientInactiveError()
    }

    // verificando se o paciente já tem alguma consulta marcado no dia: Não pode duas consultas na mesma data.

    const queryOnSameDate =
      await this.querysMedRepository.findByPatientIdOnDate(
        patient.id,
        start_time,
      )

    if (queryOnSameDate) {
      throw new PatientAppointmentSameDate()
    }

    // selecionando um médico
    const end_time = dayjs(start_time).add(1, 'hour').toDate()

    let selectedDoctor

    if (doctorId) {
      selectedDoctor = await this.selectDoctorParam(
        doctorId,
        start_time,
        end_time,
      )
    } else {
      selectedDoctor = await this.selectedDoctorRadom(start_time, end_time)
    }

    if (!selectedDoctor) {
      throw new DoctorUnavailableOnTime()
    }

    // criando a consulta

    const query = await this.querysMedRepository.create({
      patientId: patient.id,
      doctorId: selectedDoctor.id,
      specialty,
      start_time,
      end_time,
    })

    // adicionado a nova consulta ao medico.

    await this.doctorRepository.updateDoctorWithQuery(
      selectedDoctor.id,
      query.id,
    )

    return { query }
  }

  private async filterDoctorsWithNoConflict(
    doctors: Array<
      Pick<Doctor, 'name' | 'email' | 'crm' | 'activated' | 'specialty' | 'id'>
    >,
    start_time: Date,
    end_time: Date,
  ) {
    const availableDoctor: Array<
      Pick<Doctor, 'name' | 'email' | 'crm' | 'activated' | 'specialty' | 'id'>
    > = []

    for (const doctor of doctors) {
      const hasConflict = await this.querysMedRepository.hasDoctorConflict(
        doctor.id,
        start_time,
        end_time,
      )

      if (!hasConflict) {
        availableDoctor.push(doctor)
      }
    }

    return availableDoctor
  }

  private async selectDoctorParam(
    doctorId: string,
    start_time: Date,
    end_time: Date,
  ) {
    // verificando se medico exite na base e se está ativo
    const selectedDoctor = this.doctorRepository.findById(doctorId)

    if (!selectedDoctor) {
      throw new UserAlreadyExistsError()
    }

    const doctorActived = await this.doctorRepository.activeDoctor(doctorId)
    if (!doctorActived) {
      throw new UserAlreadyExistsError()
    }

    // veirficando se o medico tem conflito de horarios
    const hasConflict = await this.querysMedRepository.hasDoctorConflict(
      doctorId,
      start_time,
      end_time,
    )

    if (hasConflict) {
      throw new DoctorUnavailableOnTime()
    }
    return selectedDoctor
  }

  private async selectedDoctorRadom(start_time: Date, end_time: Date) {
    const doctors = await this.doctorRepository.findManyAllDoctorsActived()

    const availableDoctorsOnschedule = await this.filterDoctorsWithNoConflict(
      doctors,
      start_time,
      end_time,
    )

    if (!availableDoctorsOnschedule.length) {
      throw new DoctorUnavailableOnTime()
    }

    const doctorRadom = Math.floor(
      Math.random() * availableDoctorsOnschedule.length,
    )
    const selectedDoctor = availableDoctorsOnschedule[doctorRadom]

    return selectedDoctor
  }
}
