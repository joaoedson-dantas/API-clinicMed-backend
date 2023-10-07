import dayjs from 'dayjs'

export function isConsultationWithinSchedule(dataConsulation: Date) {
  // verifincado data e hora da consulta
  const openingTime = dayjs().set('hour', 7).set('minute', 0).set('second', 0)
  const closingTime = dayjs().set('hour', 19).set('minute', 0).set('second', 0)

  const consultationDate = dayjs(dataConsulation)
  // verificando se é de segunda a sexta
  const dayOfWeek = consultationDate.day()

  return (
    dayOfWeek >= 1 &&
    dayOfWeek <= 6 &&
    consultationDate.isAfter(openingTime) &&
    consultationDate.isBefore(closingTime)
  )
}
