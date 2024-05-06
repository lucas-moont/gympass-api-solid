import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";

export class InMemoryUsersRepository implements UsersRepository {
  async findByEmail(email: string): Promise<User | null> {
    return null
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return {
      id: 'user-test',
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date()
    }
  }
}