import { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { history } from './history'
import { metrics } from './metrics'
import { validate } from './validate'
import { create } from './create'
import { verifyUserRole } from '@/http/middlewares/verifyUserRole'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/check-ins/history', history)
  app.get('/check-ins/metrics', metrics)

  app.post('/gyms/:gymId/check-ins', create)
  app.patch(
    '/check-ins/:checkinId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validate,
  )
}
