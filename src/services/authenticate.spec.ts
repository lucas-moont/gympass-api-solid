import { expect, describe, test, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateService } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let inMemoryUserRepo: InMemoryUsersRepository
let sut: AuthenticateService

describe('Authenticate Service', () => {
  beforeEach(() => {
    inMemoryUserRepo = new InMemoryUsersRepository()
    sut = new AuthenticateService(inMemoryUserRepo)
  })
  test('if user can authenticate sucessfully', async () => {
    await inMemoryUserRepo.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      username: 'johndoe@email.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  test('if user cannot authenticate with invalid credentials', async () => {
    await inMemoryUserRepo.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password_hash: await hash('123456', 6),
    })

    await expect(async () => {
      await sut.execute({
        username: 'johndoe@email.com',
        password: '12345',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
