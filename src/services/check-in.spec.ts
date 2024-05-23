import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInRepository } from "@/repositories/check-in-repository";
import { CheckInService } from "./check-in";
import { expect, test, describe, vi, beforeEach } from "vitest";
import { randomUUID } from "crypto";
import { afterEach } from "node:test";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { Decimal } from "@prisma/client/runtime/library";

let inMemoryCheckInRepo: InMemoryCheckInRepository
let gymRepository: InMemoryGymRepository
let sut: CheckInService

describe('check in tests', () => {
  beforeEach(() => {
    inMemoryCheckInRepo = new InMemoryCheckInRepository()
    gymRepository = new InMemoryGymRepository()
    sut = new CheckInService(inMemoryCheckInRepo, gymRepository)

    gymRepository.items.push({
      id: 'gym-01',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
      title: 'Academia teste',
      phone: '', 
      description: ''
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })


  
  test('user should be able to check-in', async () => {
    const {checkin} = await sut.execute({
      gymId: randomUUID(),
      userId: randomUUID(),
      userLatitude: 0,
      userLongitude: 0

    })
    
    expect(checkin.id).toEqual(expect.any(String))
  })

  test('user should not be able to check in twice a day', async () => {
    
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))
    
    await sut.execute({
      gymId: randomUUID(),
      userId: 'mesmo-id',
      userLatitude: 0,
      userLongitude: 0
    })

    await expect(sut.execute({
      gymId: randomUUID(),
      userId: 'mesmo-id',
      userLatitude: 0,
      userLongitude: 0
    })).rejects.toBeInstanceOf(Error)

  })

  test('user should be able to check in twice in different days', async () => {
    
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))
    
    await sut.execute({
      gymId: randomUUID(),
      userId: 'mesmo-id',
      userLatitude: 0,
      userLongitude: 0
    })

    vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0))


    const {checkin} = await sut.execute({
      gymId: randomUUID(),
      userId: 'mesmo-id',
      userLatitude: 0,
      userLongitude: 0
    })

    expect(checkin.id).toEqual(expect.any(String))
  })

  test('user should not be able to check-in in distant gyms', async () => {
    //TODO: test being developed
    const {checkin} = await sut.execute({
      gymId: randomUUID(),
      userId: randomUUID(),
      userLatitude: 0,
      userLongitude: 0

    })
    
    expect(checkin.id).toEqual(expect.any(String))
  })
})