import { CheckInRepository } from '@/repositories/check-in-repository'
import { CheckIn } from '@prisma/client'

interface FetchUserCheckInHistoryRequest {
  userId: string
  page: number
}

interface FetchUserCheckInHistoryResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInHistoryService {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute(
    data: FetchUserCheckInHistoryRequest,
  ): Promise<FetchUserCheckInHistoryResponse> {
    const checkIns = await this.checkInRepository.findManyByUserId(
      data.userId,
      data.page,
    )
    return { checkIns }
  }
}
