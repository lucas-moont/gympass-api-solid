import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { RegisterUserService } from '../register'

export function makeRegisterService() {
  const userRepository = new PrismaUserRepository()
  const registerUser = new RegisterUserService(userRepository)

  return registerUser
}
