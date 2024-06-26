import { FastifyRequest, FastifyReply } from 'fastify'

export function verifyUserRole(roleToVerify: 'ADMIN' | 'MEMBER') {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const { role } = req.user

    if (role !== roleToVerify) {
      reply.status(401).send({ message: 'Unauthorized' })
    }
  }
}
