import { z } from "zod";
import { FastifyRequest, FastifyReply } from "fastify";
import { RegisterUserService } from "@/services/register";
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { UserAlreadyExists } from "@/services/errors/user-already-exists-ts";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(request.body);

  try {
    const userRepository = new PrismaUserRepository();
    const registerUser = new RegisterUserService(userRepository);
    await registerUser.execute({ name, email, password });
  } catch (err) {
    if (err instanceof UserAlreadyExists) {
      reply.status(406).send({message: err.message});
    }
  }

  return reply.status(201).send();
}
