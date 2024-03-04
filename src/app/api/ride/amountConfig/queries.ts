import { baseUrl } from "@/constants";
import { RideAmountConfig } from "@prisma/client";

export const getRideAmountConfig = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/ride/amountConfig`);
    const { data } = await response.json();
    return data as RideAmountConfig;
  } catch (error) {
    throw new Error("Something wrong");
  }
};
