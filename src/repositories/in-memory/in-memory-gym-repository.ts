import { GymRepository } from "../gym-repository";
import { Gym } from "@prisma/client";

export class InMemoryGymRepository implements GymRepository{
  items: Gym[] = []
  
  async findById(id: string) {
    const gym = this.items.find(item => id === item.id)

    if(!gym){
      return null
    }

    return gym
  }
}