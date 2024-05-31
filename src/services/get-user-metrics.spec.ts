import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsService } from './get-user-metrics'
import { describe, test, expect, beforeEach } from 'vitest'
import { randomUUID } from 'node:crypto'

let sut: GetUserMetricsService
let checkInRepo: InMemoryCheckInRepository

beforeEach(() => {
  checkInRepo = new InMemoryCheckInRepository()
  sut = new GetUserMetricsService(checkInRepo)
})

describe('get user metrics', () => {
  test('user should be able to know how many check-ins he has done', async () => {
    for (let i = 0; i < 10; i++) {
      checkInRepo.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
        id: randomUUID(),
        created_at: new Date(),
      })
    }

    const { checkInsCount } = await sut.execute({ userId: 'user-01' })

    expect(checkInsCount).toEqual(10)
  })
})
