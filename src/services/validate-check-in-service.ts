import { CheckIn } from '@prisma/client'
import { CheckInRepository } from '@/repositories/check-in-repository'
import { ResourceNotFound } from './errors/resource-not-found'
import dayjs from 'dayjs'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

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

    const differenceInMinutesFromCreation = dayjs(new Date()).diff(
      checkin.created_at,
      'minutes',
    )

    if (differenceInMinutesFromCreation > 20) {
      throw new LateCheckInValidationError()
    }

    checkin.validated_at = new Date()

    this.checkInRepository.save(checkin)

    return {
      checkin,
    }
  }
}
