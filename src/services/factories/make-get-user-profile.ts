import { PrismaUserRepository } from '@/repositories/prisma/prisma-user-repository'
import { GetUserProfileService } from '../get-user-profile'

export function makeGetUserProfile() {
  const prismaUserRepository = new PrismaUserRepository()
  const getUserProfileService = new GetUserProfileService(prismaUserRepository)

  return getUserProfileService
}
