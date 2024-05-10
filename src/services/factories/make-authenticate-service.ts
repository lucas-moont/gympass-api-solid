import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository";
import { AuthenticateService } from "../authenticate";

export function makeAuthenticateService() {
  const userRepository = new PrismaUserRepository();
  const authenticateUser = new AuthenticateService(userRepository);

  return authenticateUser;
}
