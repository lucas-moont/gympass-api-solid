import { app } from '@/app'
import { beforeAll, afterAll, test, describe, expect } from 'vitest'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('create gyms testing (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able to create gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Nós é maluco',
        cnpj: '123456789',
        phone: '123456789',
        latitude: -22.8506215,
        longitude: -43.0874256,
        description: '',
      })

    expect(response.statusCode).toEqual(201)
  })
})
