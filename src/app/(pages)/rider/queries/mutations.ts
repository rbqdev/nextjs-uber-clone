import socketClient from "@/configs/socket/client";
import { baseUrl } from "@/constants";
import { RideOrder } from "@prisma/client";

export const createRideOrderMutation = async (body: any) => {
  try {
    const response = await fetch(`${baseUrl}/api/rideOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const { data } = await response.json();
    return data as RideOrder;
  } catch (error) {
    throw new Error("Something wrong");
  }
};
