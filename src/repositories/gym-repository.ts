import { Gym, Prisma } from '@prisma/client'

export interface GymRepository {
  findById(id: string): Promise<Gym | null>
  findByCnpj(cnpj: string): Promise<Gym | null>
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findGymByName(gymName: string, page: number): Promise<Gym[] | null>
}
