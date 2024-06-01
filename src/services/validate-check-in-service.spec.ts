import { ValidateCheckInService } from './validate-check-in-service'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { beforeEach, test, describe, expect, afterEach } from 'vitest'
import { ResourceNotFound } from './errors/resource-not-found'

let sut: ValidateCheckInService
let checkInRepository: InMemoryCheckInRepository

describe('validate check in service', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository()
    sut = new ValidateCheckInService(checkInRepository)

    //vi.useFakeTimers()
  })

  afterEach(() => {
    //vi.useRealTimers()
  })

  test('user should be able to validate', async () => {
    const createdCheckin = await checkInRepository.create({
      id: '1',
      created_at: new Date(),
      user_id: 'user-01',
      gym_id: 'gym-01',
    })

    const { checkin } = await sut.execute({ checkinId: createdCheckin.id })

    expect(checkin.validated_at).toEqual(expect.any(Date))
    expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  test('it should not be able to validated an inexisting check-in', async () => {
    expect(async () => {
      await sut.execute({ checkinId: 'undefined' })
    }).rejects.toBeInstanceOf(ResourceNotFound)
  })
})
