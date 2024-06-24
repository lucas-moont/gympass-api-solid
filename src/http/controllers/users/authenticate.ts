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
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d',
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true, // DEFINE QUE O NOSSO COOKIE VAI SER ENCRIPTADO PELO HTTPS
        sameSite: true, // COOKIE SÓ É ACESSÍVEL DENTRO DO MESMO DOMÍNIO
        httpOnly: true, // COOKIE SÓ PODE SER ACESSADO DO BACK-END DA APLICAÇÃO
      })
      .status(200)
      .send({
        token,
      })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      reply.status(406).send({ message: err.message })
    }
  }
}
