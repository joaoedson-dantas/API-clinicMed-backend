export class PatientNotFound extends Error {
  constructor() {
    super('Paciente não encontrado')
  }
}
