import { ValidateCheckInService } from './validate-check-in-service'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { beforeEach, test, describe, expect, afterEach, vi } from 'vitest'
import { ResourceNotFound } from './errors/resource-not-found'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let sut: ValidateCheckInService
let checkInRepository: InMemoryCheckInRepository

describe('validate check in service', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository()
    sut = new ValidateCheckInService(checkInRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
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

  test('should not be able to validate check in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 13, 40))

    const createdCheckin = await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const twentyOneMinutes = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutes) // avança o tempo setado em 21 minutos

    await expect(
      sut.execute({ checkinId: createdCheckin.id }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
