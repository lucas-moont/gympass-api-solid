import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { GymService } from '../create-gym'

export function makeCreateGym() {
  const prismaGymRepository = new PrismaGymsRepository()
  const createGymService = new GymService(prismaGymRepository)

  return createGymService
}
