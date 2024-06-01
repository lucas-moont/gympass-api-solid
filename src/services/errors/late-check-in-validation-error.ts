export class LateCheckInValidationError extends Error {
  constructor() {
    super(
      'Oopsie. Check-ins should be validated withing 20 minutes of its creation.',
    )
  }
}
