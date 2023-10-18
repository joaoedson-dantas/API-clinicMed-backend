export class DoctorWithoutSpecialty extends Error {
  constructor() {
    super(
      'É necessário especificar a especialidade quando não é passado um médico',
    )
  }
}
