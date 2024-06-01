import { CheckIn } from '@prisma/client'
import { CheckInRepository } from '@/repositories/check-in-repository'
import { ResourceNotFound } from './errors/resource-not-found'

interface ValidateCheckInRequest {
  checkinId: string
}

interface ValidateCheckInResponse {
  checkin: CheckIn
}

export class ValidateCheckInService {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute({
    checkinId,
  }: ValidateCheckInRequest): Promise<ValidateCheckInResponse> {
    const checkin = await this.checkInRepository.findById(checkinId)

    if (!checkin) {
      throw new ResourceNotFound()
    }

    return {
      checkin,
    }
  }
}
