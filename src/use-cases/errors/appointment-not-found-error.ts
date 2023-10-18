export class AppointmentNotFound extends Error {
  constructor() {
    super('Consulta não encontrada no nosso sistema')
  }
}
