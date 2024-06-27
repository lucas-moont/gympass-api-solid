import { app } from '@/app'
import { describe, test, beforeAll, afterAll, expect } from 'vitest'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('get gyms nearby', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
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

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Nós é são',
        cnpj: '123456780',
        phone: '123456789',
        latitude: -22.8999217,
        longitude: -43.1798589,
        description: '',
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -22.8506215,
        longitude: -43.0874256,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Nós é maluco',
      }),
    ])
  })
})
