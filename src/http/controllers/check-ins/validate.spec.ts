import request from 'supertest'
import { expect, test, beforeAll, afterAll, describe } from 'vitest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Metrics e2e', () => {
  beforeAll(async () => {
    app.ready()
  })

  afterAll(async () => {
    app.close()
  })

  test('should be able to get check-ins count', async () => {
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

    const responseCreatedCheckIn = await request(app.server)
      .post(`/gyms/${gymId}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -22.8506215,
        longitude: -43.0874256,
      })

    let { checkin } = responseCreatedCheckIn.body

    const response = await request(app.server)
      .patch(`/check-ins/${checkin.id}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    checkin = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkin.id,
      },
    })
    expect(response.statusCode).toEqual(204)
    expect(checkin.validated_at).toEqual(expect.any(Date))
  })
})
