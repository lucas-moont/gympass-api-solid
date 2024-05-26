export class GymAlreadyExists extends Error {
  constructor(){
    super('Academia já existe')
  }
}