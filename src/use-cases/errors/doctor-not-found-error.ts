export class DoctorNotFound extends Error {
  constructor() {
    super('Médico não encontrado')
  }
}
