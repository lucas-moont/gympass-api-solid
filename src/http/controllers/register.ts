import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { UserAlreadyExists } from "@/services/errors/user-already-exists-ts";
import { makeRegisterService } from "@/services/factories/make-register-service";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const registerUser = makeRegisterService()
    await registerUser.execute({ name, email, password });
  } catch (err) {
    if (err instanceof UserAlreadyExists) {
      reply.status(406).send({message: err.message});
    }
  }

  return reply.status(201).send();
}
