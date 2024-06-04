import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { FetchUserCheckInHistoryService } from '../fetch-user-check-ins-history'

export function makeFetchUserCheckInsHistoryService() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()
  const fetchUserCheckInsService = new FetchUserCheckInHistoryService(
    prismaCheckInsRepository,
  )

  return fetchUserCheckInsService
}
