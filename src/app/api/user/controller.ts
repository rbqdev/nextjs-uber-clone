import { baseUrl } from "@/constants";

export const getUserByEmail = async (email: string) => {
  const response = await fetch(`${baseUrl}/api/user?email=${email}`);
  const { data: user } = await response.json();

  return user;
};
