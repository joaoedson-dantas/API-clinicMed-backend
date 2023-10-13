export class DoctorUnavailableOnTime extends Error {
  constructor() {
    super('Não há medicos disponíveis para esse horário.')
  }
}
