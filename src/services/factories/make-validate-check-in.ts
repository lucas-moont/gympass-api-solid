import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { ValidateCheckInService } from '../validate-check-in-service'

export function makeValidateCheckInsService() {
  const prismaCheckInRepository = new PrismaCheckInsRepository()
  const validateCheckInService = new ValidateCheckInService(
    prismaCheckInRepository,
  )

  return validateCheckInService
}
