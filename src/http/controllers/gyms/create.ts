import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeCreateGym } from '@/services/factories/make-create-gym-service'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymBodySchema = z.object({
    title: z.string(),
    cnpj: z.string(),
    description: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
    phone: z.string(),
  })

  const { title, cnpj, description, latitude, longitude, phone } =
    createGymBodySchema.parse(request.body)

  const createGym = makeCreateGym()
  const { gym } = await createGym.execute({
    title,
    cnpj,
    description,
    latitude,
    longitude,
    phone,
  })

  return reply.status(201).send({ gym })
}
