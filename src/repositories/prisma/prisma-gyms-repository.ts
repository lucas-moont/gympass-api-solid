import { Gym, Prisma } from '@prisma/client'
import { FindManyNearbyParams, GymRepository } from '../gym-repository'
import { prisma } from '@/lib/prisma'

export class PrismaGymsRepository implements GymRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    })

    return gym
  }

  async findByCnpj(cnpj: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        cnpj,
      },
    })

    return gym
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    })

    return gym
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * FROM gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    return gyms
  }

  async findGymByName(gymName: string, page: number) {
    const gyms = prisma.gym.findMany({
      where: {
        title: {
          contains: gymName,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return gyms
  }
}
