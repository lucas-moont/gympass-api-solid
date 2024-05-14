import { test, describe, expect } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { GetUserProfileService } from "./get-user-profile";
import { ResourceNotFound } from "./errors/resource-not-found";

describe("get user profile tests", () => {
  test("if can get user profile", async () => {
    const userRepository = new InMemoryUsersRepository();
    const getUserProfile = new GetUserProfileService(userRepository);

    const user = await userRepository.create({
      id: "random",
      name: "John Doe",
      email: "johndoe@teste.com.br",
      password_hash: "12345678",
    });

    const userId = user.id;

    const userProfile = await getUserProfile.execute({ userId });

    expect(userProfile.user.name).toEqual("John Doe");
  });

  test("if cannot get userProfile", () => {
    const userRepository = new InMemoryUsersRepository();
    const getUserProfile = new GetUserProfileService(userRepository);

    expect(async () => {
      await getUserProfile.execute({
        userId: "qualquercoisa",
      });
    }).rejects.toBeInstanceOf(ResourceNotFound);
  });
});
