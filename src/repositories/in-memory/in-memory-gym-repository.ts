import { randomUUID } from 'crypto'
import { FindManyNearbyParams, GymRepository } from '../gym-repository'
import { Gym, Prisma } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'
import { getsDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryGymRepository implements GymRepository {
  items: Gym[] = []

  async findManyNearby(params: FindManyNearbyParams) {
    return this.items
      .filter((item) => {
        const distance = getsDistanceBetweenCoordinates(
          {
            latitude: params.latitude,
            longitude: params.longitude,
          },
          {
            latitude: item.latitude.toNumber(),
            longitude: item.longitude.toNumber(),
          },
        )

        return distance < 10
      })
      .slice((params.page - 1) * 20, params.page * 20)
  }

  async findGymByName(gymName: string, page: number) {
    return this.items
      .filter((item) =>
        item.title.toLowerCase().includes(gymName.toLowerCase()),
      )
      .slice((page - 1) * 20, page * 20)
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      cnpj: data.cnpj,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.items.push(gym)
    return gym
  }

  async findByCnpj(cnpj: string) {
    const gym = this.items.find((item) => cnpj === item.cnpj)

    if (!gym) {
      return null
    }

    return gym
  }

  async findById(id: string) {
    const gym = this.items.find((item) => id === item.id)

    if (!gym) {
      return null
    }

    return gym
  }
}
