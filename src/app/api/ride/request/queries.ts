import { baseUrl } from "@/constants";
import { RideRequest } from "@/sharedTypes";
import { User } from "@prisma/client";

export const getRideRequest = async (id: number) => {
  try {
    const response = await fetch(`${baseUrl}/api/ride/request/${id}`);
    const { data } = await response.json();
    return data as { rideRequest: RideRequest; rideUser: User };
  } catch (error) {
    throw new Error("Something wrong");
  }
};
