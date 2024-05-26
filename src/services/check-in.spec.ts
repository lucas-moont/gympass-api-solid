import { InMemoryCheckInRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInRepository } from "@/repositories/check-in-repository";
import { CheckInService } from "./check-in";
import { expect, test, describe, vi, beforeEach, afterEach } from "vitest";
import { randomUUID } from "crypto";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { Decimal } from "@prisma/client/runtime/library";

let inMemoryCheckInRepo: InMemoryCheckInRepository;
let gymRepository: InMemoryGymRepository;
let sut: CheckInService;

describe("check in tests", () => {
  beforeEach(() => {
    inMemoryCheckInRepo = new InMemoryCheckInRepository();
    gymRepository = new InMemoryGymRepository();
    sut = new CheckInService(inMemoryCheckInRepo, gymRepository);

    gymRepository.create({
      id: "gym-01",
      latitude: 0,
      longitude: 0,
      cnpj: '123456789',
      title: "Academia teste",
      phone: "",
      description: "",
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("user should be able to check-in", async () => {
    const { checkin } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkin.id).toEqual(expect.any(String));
  });

  test("user should not be able to check in twice a day", async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: 0,
        userLongitude: 0,
      })
    ).rejects.toBeInstanceOf(Error);
  });

  test("user should be able to check in twice in different days", async () => {
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 0,
      userLongitude: 0,
    });

    vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0));

    const { checkin } = await sut.execute({
      gymId: 'gym-01',
      userId: "user-01",
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkin.id).toEqual(expect.any(String));
  });

  test("user should not be able to check-in in distant gyms", async () => {
    gymRepository.items.push({
      id: "gym-02",
      latitude: new Decimal(-22.8506215),
      longitude: new Decimal(-22.8506215),
      title: "Academia teste",
      cnpj: '123456789',
      phone: "",
      description: "",
    });

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -22.8756526,
        userLongitude: -43.1207949,
      })
    ).rejects.toBeInstanceOf(Error);
  });
});
