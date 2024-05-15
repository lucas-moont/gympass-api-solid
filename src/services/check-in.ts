import { CheckInRepository } from "@/repositories/check-in-repository";
import { CheckIn } from "@prisma/client";

interface CheckInRequest {
  userId: string,
  gymId: string 
}

interface CheckInResponse {
  checkin: CheckIn
}

export class CheckInService {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute({userId, gymId}: CheckInRequest): Promise<CheckInResponse>{
    const checkin = await this.checkInRepository.create({
      user_id: userId,
      gym_id: gymId
    })
    
    return {
      checkin
    }
  }
}