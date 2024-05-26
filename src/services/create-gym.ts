import { GymRepository } from "@/repositories/gym-repository";
import { Gym } from "@prisma/client";
import { GymAlreadyExists } from "./errors/gym-already-exists";

interface GymRequest {
  title: string,
  cnpj: string,
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

  async execute(data: GymRequest): Promise<GymResponse>{
    let gym = await this.gymRepository.findByCnpj(data.cnpj)

    if(gym){
      throw new GymAlreadyExists()
    }

    gym = await this.gymRepository.create(data)
    return {gym}
  }
}