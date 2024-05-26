import { Gym, Prisma } from "@prisma/client";
import { InMemoryGymRepository } from "@/repositories/in-memory/in-memory-gym-repository";
import { test, describe, expect, beforeEach } from "vitest";
import { GymService } from "./create-gym"
import { randomUUID } from "crypto";
import { Decimal } from "@prisma/client/runtime/library";
import { GymAlreadyExists } from "./errors/gym-already-exists";

let gymMemoryRepository: InMemoryGymRepository;
let sut: GymService;

beforeEach(() => {
  gymMemoryRepository = new InMemoryGymRepository();
  sut = new GymService(gymMemoryRepository);
});

describe("gym service tests", () => {
  test("user should not be able to register a gym with same cnpj", async () => {
    await gymMemoryRepository.create({
      cnpj: "92897394000140",
      description: "descrição",
      latitude: new Decimal(0),
      longitude: new Decimal(0),
      phone: "+5521976411674",
      title: "Minha academia",
    });

    expect(
      sut.execute({
        cnpj: "92897394000140",
        description: "descrição",
        latitude: 0,
        longitude: 0,
        phone: "+5521976411674",
        title: "Minha academia",
      })
    ).rejects.toBeInstanceOf(GymAlreadyExists);
  });

  test("user can create gym", async () => {
    const {gym} = await sut.execute({
      cnpj: "92897394000140",
      description: "descrição",
      latitude: 0,
      longitude: 0,
      phone: "+5521976411674",
      title: "Minha academia",
    });

    expect(gym.id).toEqual(expect.any(String))
  });
});
