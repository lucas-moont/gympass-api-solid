import { expect, describe, test } from "vitest";
import { compare, hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateService } from "./authenticate";

describe("Authenticate Service", () => {
  test("if user chan authenticate sucessfully", async () => {
    const inMemoryUserRepo = new InMemoryUsersRepository();
    const sut = new AuthenticateService(inMemoryUserRepo);

    await inMemoryUserRepo.create({
      name: "John Doe",
      email: "johndoe@email.com",
      password_hash: await hash("123456", 6)
    })

    const { user } = await sut.execute({
      username: "johndoe@email.com",
      password: '123456'      
    });

    expect(user.id).toEqual(expect.any(String));
  });
});
