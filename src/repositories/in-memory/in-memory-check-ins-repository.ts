import { Prisma, CheckIn } from '@prisma/client'
import { CheckInRepository } from '../check-in-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

export class InMemoryCheckInRepository implements CheckInRepository {
  items: CheckIn[] = []

  async findById(checkinId: string) {
    return this.items.find((item) => item.id === checkinId) ?? null
  }

  async save(checkin: CheckIn) {
    const index = this.items.findIndex((item) => item.id === checkin.id)

    if (index >= 0) {
      this.items[index] = checkin
    }
    return checkin
  }

  async countByUserId(userId: string) {
    return this.items.filter((item) => userId === item.user_id).length
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = this.items
      .filter((item) => userId === item.user_id)
      .slice((page - 1) * 20, page * 20)
    return checkIns
  }

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = {
      id: randomUUID(),
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      user_id: data.user_id,
      gym_id: data.gym_id,
    }

    this.items.push(checkIn)

    return checkIn
  }

  async findByUserIdAndDate(userId: string, date: Date) {
    const startofTheDay = dayjs(date).startOf('date')
    const endOftheDay = dayjs(date).endOf('date')

    const checkInOnSameDate = this.items.find((checkin) => {
      const checkInDate = dayjs(checkin.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startofTheDay) && checkInDate.isBefore(endOftheDay)

      return checkin.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDate) {
      return null
    }

    return checkInOnSameDate
  }
}
