import { describe, beforeAll, afterAll, test, expect } from 'vitest'
import { app } from '@/app'
import request from 'supertest'

describe('profile testing', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test.only('user should be able to get his profile', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    const authResponse = await request(app.server).post('/session').send({
      username: 'johndoe@email.com',
      password: '123456',
    })

    const { token } = authResponse.body

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'johndoe@email.com',
      }),
    )
  })
})
