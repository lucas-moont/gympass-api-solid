import {expect, describe, test} from 'vitest'
import { RegisterUserService } from './register'
import { compare } from 'bcryptjs'

describe('Register Use Case', () => {
  test('should hash user password upon registration', async () => {
    const registerUseCase = new RegisterUserService({
      async findByEmail(email) {
        return null 
      },

      async create(data) {
        return {
          id: 'user-test',
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date()
        }
      },
    })

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