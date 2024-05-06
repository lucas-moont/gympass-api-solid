import {expect, describe, test} from 'vitest'
import { RegisterUserService } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

describe('Register Use Case', () => {
  test('should hash user password upon registration', async () => {
    const inMemoryUserRepo = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUserService(inMemoryUserRepo)

    const {user} = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'kazuofilhodaputa'
    })

    const isPasswordCorrectlyHashed = await compare(
      'kazuofilhodaputa',
      user.password_hash
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})