import { makeGetUserProfileMetrics } from '@/services/factories/make-get-users-metrics'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function metrics(req: FastifyRequest, reply: FastifyReply) {
  const getMetricsService = makeGetUserProfileMetrics()

  const { checkInsCount } = await getMetricsService.execute({
    userId: req.user.sub,
  })

  reply.status(201).send({
    checkInsCount,
  })
}
