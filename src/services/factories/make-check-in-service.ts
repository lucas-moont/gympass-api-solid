import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { CheckInService } from '../check-in'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeCheckInsService() {
  const prismaCheckInRepository = new PrismaCheckInsRepository()
  const prismaGymRepository = new PrismaGymsRepository()
  const checkInService = new CheckInService(
    prismaCheckInRepository,
    prismaGymRepository,
  )

  return checkInService
}
