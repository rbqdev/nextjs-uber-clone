import { baseUrl } from "@/constants";
import { RideRequest } from "@/sharedTypes";
import { User } from "@prisma/client";
import { Optional } from "@prisma/client/runtime/library";

export const createRideRequestMutation = async (body: Record<string, any>) => {
  try {
    const response = await fetch(`${baseUrl}/api/ride/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const { data } = await response.json();
    return data as { rideRequest: RideRequest; rider: User };
  } catch (error) {
    throw new Error("Something wrong with create ride request");
  }
};

export const updateRideRequestMutation = async (
  id: number,
  body: Record<string, Optional<RideRequest>>
) => {
  try {
    const response = await fetch(`${baseUrl}/api/ride/request/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const { data } = await response.json();
    return data as { rideRequest: RideRequest; rider: User };
  } catch (error) {
    throw new Error("Something wrong with update ride request");
  }
};
