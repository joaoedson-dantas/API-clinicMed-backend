export class PatientInactiveError extends Error {
  constructor() {
    super('não pode agendar uma consulta com paciente inativo no sistema')
  }
}
