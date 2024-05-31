import { GymRepository } from '@/repositories/gym-repository'
import { Gym } from '@prisma/client'

interface SearchGymByNameRequest {
  query: string
}

interface SearchGymByNameResponse {
  gyms: Gym[]
}

export class SearchGymByName {
  constructor(private gymRepository: GymRepository) {}

  async execute(
    data: SearchGymByNameRequest,
  ): Promise<SearchGymByNameResponse> {
    const gyms = await this.gymRepository.findGymByName(data.query)

    return { gyms: gyms || [] }
  }
}
