import { describe, test, beforeAll, afterAll, expect } from 'vitest'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { app } from '@/app'

describe('History check-in E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be to get check-ins history', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const responseGym = await request(app.server)
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

    const { gym } = responseGym.body
    const gymId = gym.id

    await request(app.server)
      .post(`/gyms/${gymId}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -22.8506215,
        longitude: -43.0874256,
      })

    const response = await request(app.server)
      .get(`/check-ins/history`)
      .set('Authorization', `Bearer ${token}`)
      .query({
        page: 1,
      })
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        gym_id: gymId,
      }),
    ])
  })
})
