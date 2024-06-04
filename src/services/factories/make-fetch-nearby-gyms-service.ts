import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { FetchNearbyGymsService } from '../fetch-nearby-gyms'

export function makeFetchNearbyGymsService() {
  const prismaGymRepository = new PrismaGymsRepository()
  const fetchNearbyGymsService = new FetchNearbyGymsService(prismaGymRepository)

  return fetchNearbyGymsService
}
