import request from 'supertest'
import { test, describe, beforeAll, afterAll, expect } from 'vitest'
import { app } from '@/app'

describe('authenticate testing', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('user should be able to authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    })

    const response = await request(app.server).post('/session').send({
      username: 'johndoe@email.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
