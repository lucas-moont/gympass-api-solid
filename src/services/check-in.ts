import { CheckInRepository } from '@/repositories/check-in-repository'
import { GymRepository } from '@/repositories/gym-repository'
import { CheckIn } from '@prisma/client'
import { ResourceNotFound } from './errors/resource-not-found'
import { getsDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxCheckInError } from './errors/max-checkin-error'

interface CheckInRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInResponse {
  checkin: CheckIn
}

export class CheckInService {
  constructor(
    private checkInRepository: CheckInRepository,
    private gymRepository: GymRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInRequest): Promise<CheckInResponse> {
    const gym = await this.gymRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFound()
    }

    const distance = getsDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    const MAX_DISTANCE = 0.1

    if (distance > MAX_DISTANCE) {
      throw new MaxDistanceError()
    }

    const checkInOnSameDate = await this.checkInRepository.findByUserIdAndDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDate) {
      throw new MaxCheckInError()
    }

    const checkin = await this.checkInRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return {
      checkin,
    }
  }
}
