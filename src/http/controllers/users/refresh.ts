import { FastifyRequest, FastifyReply } from 'fastify'

export async function refresh(req: FastifyRequest, reply: FastifyReply) {
  await req.jwtVerify({ onlyCookie: true })

  const token = await reply.jwtSign(
    {},
    {
      sign: {
        sub: req.user.sub,
      },
    },
  )

  const refreshToken = await reply.jwtSign(
    {},
    {
      sign: {
        sub: req.user.sub,
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
}
