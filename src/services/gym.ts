import { GymRepository } from "@/repositories/gym-repository";
import { Gym } from "@prisma/client";
import { ResourceNotFound } from "./errors/resource-not-found";

interface GymRequest {
  title: string,
  cnpj: number,
  description?: string | null, //vamos usar o fator da gym ser opcional para futuras aplicações
  phone: string | null, 
  latitude: number,
  longitude: number 
}

interface GymResponse {
  gym: Gym
}

export class GymService {
  constructor(private gymRepository: GymRepository){

  }

  async execute(data: GymRequest): Promise<GymResponse | null>{
    const gym = this.gymRepository.create(data)
    
    return null 
  }
}