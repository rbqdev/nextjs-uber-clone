import { baseUrl } from "@/constants";
import { RideOrder, User } from "@prisma/client";

export const getRideOrder = async (id: number) => {
  try {
    const response = await fetch(`${baseUrl}/api/ride/order/${id}`);
    const { data } = await response.json();
    return data as { rideOrder: RideOrder; rideUser: User };
  } catch (error) {
    throw new Error("Something wrong");
  }
};
