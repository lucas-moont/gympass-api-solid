import { describe, test, beforeAll, afterAll, expect } from 'vitest'
import request from 'supertest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { app } from '@/app'

describe('Create check-in E2E', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  test('should be able to create check in', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

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

    const response = await request(app.server)
      .post(`/gyms/${gymId}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -22.8506215,
        longitude: -43.0874256,
      })

    console.log(response.body)

    expect(response.statusCode).toEqual(201)
  })
})
