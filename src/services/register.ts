import { prisma } from "@/lib/prisma"
import { PrismaUserRepository } from "@/repositories/prisma-user-repository"
import { hash } from "bcryptjs"

interface RegisterUserServiceRequest {
  name: string, 
  email: string, 
  password: string 
}

export class RegisterUserService{
  constructor(private userCaseRepo: any){

  }

  async execute(
    {
      name, 
      email, 
      password
    }: RegisterUserServiceRequest
  ){
    const userDoesExist = await prisma.user.findUnique({
      where: {
        email
      }
    })
  
    if(userDoesExist){
      throw new Error('Email already registered.')
    }
    
    const password_hash = await hash(password, 6)
  
//    const prismaUserRepository = new PrismaUserRepository()
  
    await this.userCaseRepo.create({
      name, 
      email,
      password_hash
    })
  }
}
