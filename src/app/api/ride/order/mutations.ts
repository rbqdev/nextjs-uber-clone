import { baseUrl } from "@/constants";
import { RideOrder, RideOrderStatus, User } from "@prisma/client";
import { Optional } from "@prisma/client/runtime/library";

export const createRideOrderMutation = async (body: Record<string, any>) => {
  try {
    const response = await fetch(`${baseUrl}/api/ride/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const { data } = await response.json();
    return data as { rideOrder: RideOrder; rideUser: User };
  } catch (error) {
    throw new Error("Something wrong with create ride order");
  }
};

export const updateRideOrderMutation = async (
  orderId: number,
  body: Record<string, Optional<RideOrder>>
) => {
  try {
    const response = await fetch(`${baseUrl}/api/ride/order/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const { data } = await response.json();
    return data as { rideOrder: RideOrder; rideUser: User };
  } catch (error) {
    throw new Error("Something wrong with update ride order");
  }
};
