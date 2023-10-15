import { Prisma, $Enums } from '@prisma/client'
import { QueryMedRepository } from '../query-med-repository'
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'

export class PrismaQueryRepository implements QueryMedRepository {
  async create(data: Prisma.QueryUncheckedCreateInput) {
    const appointment = await prisma.query.create({
      data,
    })

    return appointment
  }

  async findByPatientIdOnDate(patientId: string, date: Date) {
    const startOftheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const queryOnSameDate = await prisma.query.findFirst({
      where: {
        patientId,
        start_time: {
          gte: startOftheDay.toDate(), // Significa "greater than or equal" (maior ou igual a). É usado para selecionar registros cujo valor de um campo seja maior ou igual ao valor especificado.
          lte: endOfTheDay.toDate(), // Significa "less than or equal" (menor ou igual a). É usado para selecionar registros cujo valor de um campo seja menor ou igual ao valor especificado.
        },
      },
    })
    return queryOnSameDate
  }

  async hasDoctorConflict(doctorId: string, startTime: Date, endTime: Date) {
    const hasConflict = await prisma.query.findFirst({
      where: {
        doctorId,
        start_time: {
          lt: endTime,
        },
        end_time: {
          gt: startTime,
        },
      },
    })

    return !!hasConflict // convertendo o valor em booleano - dupla negação
  }

  async findAllQuers() {
    const querys = await prisma.query.findMany()
    return querys
  }

  async findById(appointment_id: string) {
    const appointment = await prisma.query.findUnique({
      where: {
        id: appointment_id,
      },
    })
    return appointment
  }

  async appointmentCancellation(
    appointment_id: string,
    reason_cancellation: $Enums.Cancellation,
  ) {
    const updatedAppointment = await prisma.query.update({
      where: {
        id: appointment_id,
      },
      data: { reason_cancellation },
    })

    if (!updatedAppointment) {
      return null
    }

    return updatedAppointment
  }
}
