export class PatientAppointmentSameDate extends Error {
  constructor() {
    super('Paciente com consuta na mesma data')
  }
}
