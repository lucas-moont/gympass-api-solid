import { Prisma, CheckIn } from "@prisma/client";
import { CheckInRepository } from "../check-in-repository";
import { randomUUID } from "node:crypto";

export class InMemoryCheckInRepository implements CheckInRepository {
  items: CheckIn[] = [];

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = {
      id: randomUUID(),
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      user_id: data.user_id,
      gym_id: data.gym_id,
    };

    this.items.push(checkIn);

    return checkIn;
  }
}
