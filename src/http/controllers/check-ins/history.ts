import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFetchUserCheckInsHistoryService } from '@/services/factories/make-fetch-user-check-ins-history'
import { z } from 'zod'

export async function history(req: FastifyRequest, reply: FastifyReply) {
  const checkinsHistoryQuerySchema = z.object({
    page: z.number(),
  })

  const { page } = checkinsHistoryQuerySchema.parse(req.query)

  const fetchUserCheckInsHistory = makeFetchUserCheckInsHistoryService()

  const { checkIns } = await fetchUserCheckInsHistory.execute({
    page,
    userId: req.user.sub,
  })

  return reply.status(200).send({
    checkIns,
  })
}
