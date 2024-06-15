import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { InvalidCredentialsError } from '@/services/errors/invalid-credentials-error'
import { makeAuthenticateService } from '@/services/factories/make-authenticate-service'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    username: z.string().email(),
    password: z.string().min(6),
  })

  const { username, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUser = makeAuthenticateService()
    const { user } = await authenticateUser.execute({ username, password })

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )
    return reply.status(200).send({
      token,
    })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      reply.status(406).send({ message: err.message })
    }
  }
}
