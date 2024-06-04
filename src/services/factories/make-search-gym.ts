import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { SearchGymByName } from '../search-gym'

export function makeSearchGymsService() {
  const prismaGymsRepository = new PrismaGymsRepository()
  const searchGymsService = new SearchGymByName(prismaGymsRepository)

  return searchGymsService
}
