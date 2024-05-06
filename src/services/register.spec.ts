import { expect, describe, test } from "vitest";
import { RegisterUserService } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExists } from "./errors/user-already-exists-ts";

describe("Register Use Case", () => {
  test("should hash user password upon registration", async () => {
    const inMemoryUserRepo = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUserService(inMemoryUserRepo);

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "johndoe@email.com",
      password: "kazuofilhodaputa",
    });

    const isPasswordCorrectlyHashed = await compare(
      "kazuofilhodaputa",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  test("should not be able to register with same email twice", async () => {
    const inMemoryUserRepo = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUserService(inMemoryUserRepo);

    await registerUseCase.execute({
      name: "John Doe",
      email: "johndoe@email.com",
      password: "kazuofilhodaputa",
    });

    expect(() =>
      registerUseCase.execute({
        name: "John Doe",
        email: "johndoe@email.com",
        password: "kazuofilhodaputa",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExists); //podemos usar resolve caso esperemos que o teste/promise seja certo
  });

  test("should be able to register", async () => {
    const inMemoryUserRepo = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUserService(inMemoryUserRepo);

    await registerUseCase.execute({
      name: "John Doe",
      email: "johndoe@email.com",
      password: "kazuofilhodaputa",
    });

    const inMemoryUserRepoItemsLength = inMemoryUserRepo.items.length

    expect(inMemoryUserRepoItemsLength > 0).toBe(true)
  });
});
