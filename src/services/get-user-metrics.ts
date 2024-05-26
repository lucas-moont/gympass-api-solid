import { CheckIn, User } from '@prisma/client'
import { UsersRepository } from '@/repositories/users-repository'

interface GetUserMetricsRequest {
  userId: string
}

interface GetUserMetricsResponse {
  checkInsCount: number
}

export class GetUserMatricsService {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserMetricsRequest): Promise<GetUserMetricsResponse> {}
}
