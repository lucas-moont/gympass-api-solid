import { GymAlreadyExists } from "@/services/errors/gym-already-exists";
import { GymRepository } from "../gym-repository";
import { Gym } from "@prisma/client";

export class InMemoryGymRepository implements GymRepository{
  items: Gym[] = []

  async create(data: Gym) {
    const gym = this.items.find(item => data.cnpj === item.cnpj)
    
    if(gym){
      throw new GymAlreadyExists()
    }

    this.items.push(data)
    return data
  }
  
  async findById(id: string) {
    const gym = this.items.find(item => id === item.id)

    if(!gym){
      return null
    }

    return gym
  }
}