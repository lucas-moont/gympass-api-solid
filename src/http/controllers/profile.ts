import { makeGetUserProfile } from '@/services/factories/make-get-user-profile'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(request: FastifyRequest, response: FastifyReply) {
  const getUserProfile = makeGetUserProfile()

  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  })

  return response.status(200).send({
    ...user,
    password_hash: undefined,
  })
}
