import request from 'supertest'
import { expect, test, beforeAll, afterAll, describe } from 'vitest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Metrics e2e', () => {
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  test('should be able to get check-ins count', async () => {
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
      .get('/check-ins/metrics')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(201)
    expect(response.body.checkInsCount).toEqual(1)
  })
})
