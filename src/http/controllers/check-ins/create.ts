import { makeCheckInsService } from '@/services/factories/make-check-in-service'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(req: FastifyRequest, reply: FastifyReply) {
  const checkInsParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const checkInsBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const { gymId } = checkInsParamsSchema.parse(req.params)

  const { latitude, longitude } = checkInsBodySchema.parse(req.body)

  const createCheckIn = makeCheckInsService()

  const { checkin } = await createCheckIn.execute({
    gymId,
    userId: req.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(201).send({ checkin })
}
