export class ClinicOutsideOpeningHoursError extends Error {
  constructor() {
    super('Clinica fechada: Fora do horario de funcionamento')
  }
}
