export class MaxCheckInError extends Error {
  constructor() {
    super('Max checkins reached.')
  }
}