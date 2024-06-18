import { z } from 'zod'
import { makeValidateCheckInsService } from '@/services/factories/make-validate-check-in'
import { FastifyRequest, FastifyReply } from 'fastify'

export async function validate(req: FastifyRequest, reply: FastifyReply) {
  const validateCheckInsQuerySchema = z.object({
    checkinId: z.string().uuid(),
  })

  const { checkinId } = validateCheckInsQuerySchema.parse(req.params)

  const validateCheckInService = makeValidateCheckInsService()

  await validateCheckInService.execute({
    checkinId,
  })

  reply.status(204).send()
}
