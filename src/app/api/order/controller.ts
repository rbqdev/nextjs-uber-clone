import { baseUrl } from "@/constants";

export const createRideOrder = async () => {
  const response = await fetch(`${baseUrl}/api/user`);

  try {
    const { data: order } = await response.json();
    // Emit event

    return order;
  } catch (error) {
    throw new Error();
  }
};
