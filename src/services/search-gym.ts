import { GymRepository } from '@/repositories/gym-repository'
import { Gym } from '@prisma/client'

interface SearchGymByNameRequest {
  query: string
  page: number
}

interface SearchGymByNameResponse {
  gyms: Gym[]
}

export class SearchGymByName {
  constructor(private gymRepository: GymRepository) {}

  async execute(
    data: SearchGymByNameRequest,
  ): Promise<SearchGymByNameResponse> {
    const gyms = await this.gymRepository.findGymByName(data.query, data.page)

    return { gyms: gyms || [] }
  }
}
