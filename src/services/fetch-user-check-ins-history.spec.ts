import { test, describe, beforeEach, expect } from 'vitest'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInHistoryService } from './fetch-user-check-ins-history'
import { randomUUID } from 'crypto'

let checkInRepository: InMemoryCheckInRepository
let sut: FetchUserCheckInHistoryService

beforeEach(() => {
  checkInRepository = new InMemoryCheckInRepository()
  sut = new FetchUserCheckInHistoryService(checkInRepository)
})

describe('fetch check in history', () => {
  test('user should be able to fetch check in history using his/her id', async () => {
    checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
      id: randomUUID(),
      created_at: new Date(),
    })

    checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
      id: randomUUID(),
      created_at: new Date(),
    })

    checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-02',
      id: randomUUID(),
      created_at: new Date(),
    })

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
  })

  test('user should be able to fetch check in history using his/her id', async () => {
    for (let i = 1; i <= 22; i++) {
      checkInRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
        id: randomUUID(),
        created_at: new Date(),
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
})
