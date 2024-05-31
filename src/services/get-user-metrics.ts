import { CheckInRepository } from '@/repositories/check-in-repository'

interface GetUserMetricsRequest {
  userId: string
}

interface GetUserMetricsResponse {
  checkInsCount: number
}

export class GetUserMetricsService {
  constructor(private checkInRepo: CheckInRepository) {}

  async execute({
    userId,
  }: GetUserMetricsRequest): Promise<GetUserMetricsResponse> {
    const checkInsCount = await this.checkInRepo.countByUserId(userId)

    return {
      checkInsCount,
    }
  }
}
