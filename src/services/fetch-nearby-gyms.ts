import { GymRepository } from '@/repositories/gym-repository'
import { Gym } from '@prisma/client'

interface FetchNearbyGymsRequest {
  userLatitude: number
  userLongitude: number
  page: number
}

interface FetchNearbyGymsResponse {
  gyms: Gym[]
}

export class FetchNearbyGymsService {
  constructor(private gymRepository: GymRepository) {}

  async execute({
    userLatitude,
    userLongitude,
    page,
  }: FetchNearbyGymsRequest): Promise<FetchNearbyGymsResponse> {
    const gyms = await this.gymRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
      page,
    })

    return { gyms }
  }
}
