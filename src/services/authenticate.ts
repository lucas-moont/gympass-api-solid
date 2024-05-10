import { UsersRepository } from "@/repositories/users-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { compare } from "bcryptjs";
import { User } from "@prisma/client";

interface AuthentiCateServiceRequest {
  username: string,
  password: string
}

interface AuthenticateServiceResponse {
  user: User
}

export class AuthenticateService {
  constructor(
    private userRepository: UsersRepository
  ) {}

  async execute({username, password}: AuthentiCateServiceRequest): Promise<AuthenticateServiceResponse> {
    const user = await this.userRepository.findByEmail(username)
    if(!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatch = await compare(password, user.password_hash)

    if(!doesPasswordMatch){
      throw new InvalidCredentialsError()
    }

    return {user}
  }
}