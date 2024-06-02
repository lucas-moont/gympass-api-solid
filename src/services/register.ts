import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExists } from './errors/user-already-exists-ts'
import { User } from '@prisma/client'

interface RegisterUserServiceRequest {
  name: string
  email: string
  password: string
}

interface RegistrationUserResponse {
  user: User
}

export class RegisterUserService {
  constructor(private userCaseRepo: UsersRepository) {
    // nessa linha é como se setassemos uma propriedade privada para essa classe chamada userCaseRepo
  }

  async execute({
    name,
    email,
    password,
  }: RegisterUserServiceRequest): Promise<RegistrationUserResponse> {
    const userDoesExist = await this.userCaseRepo.findByEmail(email)

    if (userDoesExist) {
      throw new UserAlreadyExists()
    }

    const password_hash = await hash(password, 6)

    //    const prismaUserRepository = new PrismaUserRepository()

    const user = await this.userCaseRepo.create({
      name,
      email,
      password_hash,
    })

    return {
      user,
    }
  }
}
