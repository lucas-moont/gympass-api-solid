import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInRepository } from "@/repositories/check-in-repository";
import { CheckInService } from "./check-in";
import { expect, test, describe, beforeAll } from "vitest";
import { randomUUID } from "crypto";

let inMemoryCheckInRepo: InMemoryCheckInRepository
let sut: CheckInService

describe('check in tests', () => {
  beforeAll(() => {
    inMemoryCheckInRepo = new InMemoryCheckInRepository()
    sut = new CheckInService(inMemoryCheckInRepo)
  })
  
  test('user should be able to check-in', async () => {
    const {checkin} = await sut.execute({
      gymId: randomUUID(),
      userId: randomUUID()
    })
    
    expect(checkin.id).toEqual(expect.any(String))
  })
})