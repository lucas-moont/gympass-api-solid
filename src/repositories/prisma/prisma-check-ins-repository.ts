import { CheckIn, Prisma } from '@prisma/client'
import { CheckInRepository } from '../check-in-repository'
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInRepository {
  async findById(id: string) {
    const checkin = await prisma.checkIn.findUnique({
      where: { id },
    })

    return checkin
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = prisma.checkIn.create({
      data,
    })

    return checkIn
  }

  async save(data: CheckIn) {
    const checkIn = await prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data,
    })

    return checkIn
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return checkIns
  }

  async countByUserId(userId: string) {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })

    return count
  }

  async findByUserIdAndDate(userId: string, date: Date) {
    const starOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: starOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    })

    return checkIn
  }
}
