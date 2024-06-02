import { expect, describe, test, beforeEach } from 'vitest'
import { RegisterUserService } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExists } from './errors/user-already-exists-ts'

let inMemoryUserRepo: InMemoryUsersRepository
let sut: RegisterUserService

describe('Register Use Case', () => {
  beforeEach(() => {
    inMemoryUserRepo = new InMemoryUsersRepository()
    sut = new RegisterUserService(inMemoryUserRepo)
  })
  test('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  test('should not be able to register with same email twice', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email: 'johndoe@email.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExists) // podemos usar resolve caso esperemos que o teste/promise seja certo
  })

  test('should be able to register', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    const inMemoryUserRepoItemsLength = inMemoryUserRepo.items.length

    expect(inMemoryUserRepoItemsLength > 0).toBe(true)
  })
})
