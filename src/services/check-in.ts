import { CheckInRepository } from "@/repositories/check-in-repository";
import { GymRepository } from "@/repositories/gym-repository";
import { CheckIn } from "@prisma/client";
import { ResourceNotFound } from "./errors/resource-not-found";

interface CheckInRequest {
  userId: string;
  gymId: string;
  userLatitude: number,
  userLongitude: number
}

interface CheckInResponse {
  checkin: CheckIn;
}

export class CheckInService {
  constructor(
    private checkInRepository: CheckInRepository,
    private gymRepository: GymRepository
  ) {}

  async execute({ userId, gymId, userLatitude, userLongitude }: CheckInRequest): Promise<CheckInResponse> {
    const gym = this.gymRepository.findById(gymId)

    if(!gym){
      throw new ResourceNotFound
    }
    
    const checkInOnSameDate = await this.checkInRepository.findByUserIdAndDate(
      userId,
      new Date()
    );

    if(checkInOnSameDate) {
      throw new Error()
    }

    const checkin = await this.checkInRepository.create({
      user_id: userId,
      gym_id: gymId,
    });

    return {
      checkin,
    };
  }
}
