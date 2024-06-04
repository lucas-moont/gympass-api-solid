import { GetUserMetricsService } from '../get-user-metrics'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export function makeGetUserProfileMetrics() {
  const prismaCheckInRepository = new PrismaCheckInsRepository()
  const getUserProfileMetrics = new GetUserMetricsService(
    prismaCheckInRepository,
  )

  return getUserProfileMetrics
}
