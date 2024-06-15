import { makeFetchNearbyGymsService } from '@/services/factories/make-fetch-nearby-gyms-service'
import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function nearby(req: FastifyRequest, reply: FastifyReply) {
  const nearbyQuerySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
    page: z.coerce.number().min(1).default(1),
  })

  const { latitude, longitude, page } = nearbyQuerySchema.parse(req.query)

  const nearbyGymsService = makeFetchNearbyGymsService()

  const gyms = await nearbyGymsService.execute({
    userLongitude: longitude,
    userLatitude: latitude,
    page,
  })

  return reply.status(200).send({
    gyms,
  })
}
