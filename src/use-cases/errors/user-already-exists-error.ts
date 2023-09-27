export class UserAlreadyExistsError extends Error {
  constructor() {
    super('Login already exists.')
  }
}
